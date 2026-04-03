import { useState, useEffect, useRef, useCallback } from 'react';
import type { ActivityEntry } from '../types/common.types';
import { LIVE_ACTIVITY } from '../data';
import { useApp } from '../context/AppContext';

const AR_ACTIONS = [
  'Invoice #{num} delivered to {client} — delivery confirmed',
  'Payment reminder dispatched — {client} (Day {day} of Net 30)',
  'Payment of ${amount} matched to Invoice #{num} — 100% confidence',
  'Collection sequence advanced — {client}, Stage {stage}',
  'Lien waiver request generated and sent — {client}',
  'AR aging analysis updated — DSO: 31.4 days',
];
const AP_ACTIONS = [
  'Vendor invoice received — {vendor}, ${amount}',
  '3-way PO match completed — {vendor} — Auto-approved',
  'Duplicate invoice check passed — {vendor}',
  'OCR extraction complete — {vendor}, {conf}% confidence',
  'Payment queued — {vendor}, ${amount}',
  'Early pay discount opportunity flagged — {vendor} ${disc}',
];
const AR_CLIENTS = ['Advocate Health', 'Walmart Distribution', 'City of Elgin', 'Northwestern Medicine', 'Hilton Hotels', 'Allied Construction'];
const AP_VENDORS = ['Graybar Electric', 'Cooper Electric', 'Rexel Holdings', 'WESCO Distribution', 'US Lighting Corp'];

function makeEntry(ade: 'ARIA-AR' | 'ARIA-AP'): ActivityEntry {
  const actions = ade === 'ARIA-AR' ? AR_ACTIONS : AP_ACTIONS;
  const template = actions[Math.floor(Math.random() * actions.length)];
  const action = template
    .replace('{num}', String(4800 + Math.floor(Math.random() * 100)))
    .replace('{client}', AR_CLIENTS[Math.floor(Math.random() * AR_CLIENTS.length)])
    .replace('{vendor}', AP_VENDORS[Math.floor(Math.random() * AP_VENDORS.length)])
    .replace('{amount}', String((Math.floor(Math.random() * 50000) + 1000).toLocaleString()))
    .replace('{day}', String(Math.floor(Math.random() * 25) + 5))
    .replace('{stage}', String(Math.floor(Math.random() * 5) + 1))
    .replace('{conf}', String(95 + Math.floor(Math.random() * 5)))
    .replace('{disc}', String((Math.floor(Math.random() * 1000) + 200).toLocaleString()));
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return {
    id: `live-${Date.now()}-${Math.random()}`,
    timestamp: `Today ${timeStr}`,
    ade,
    action,
    status: Math.random() > 0.2 ? 'success' : 'active',
    channel: (['Email', 'System', 'Portal'] as const)[Math.floor(Math.random() * 3)],
  };
}

export function useAIEngine() {
  const { arRunning, apRunning } = useApp();
  const [feed, setFeed] = useState<ActivityEntry[]>(LIVE_ACTIVITY.slice(0, 8));
  const [isProcessing, setIsProcessing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tick = useCallback(() => {
    if (!arRunning && !apRunning) return;
    setIsProcessing(true);
    const ade = arRunning && apRunning
      ? (Math.random() > 0.5 ? 'ARIA-AR' : 'ARIA-AP')
      : arRunning ? 'ARIA-AR' : 'ARIA-AP';
    const entry = makeEntry(ade);
    setFeed(prev => [entry, ...prev].slice(0, 20));
    setTimeout(() => setIsProcessing(false), 1500);
  }, [arRunning, apRunning]);

  useEffect(() => {
    if (!arRunning && !apRunning) {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      return;
    }
    const schedule = () => {
      const delay = 15000 + Math.random() * 75000; // 15-90s
      intervalRef.current = setTimeout(() => { tick(); schedule(); }, delay);
    };
    schedule();
    return () => { if (intervalRef.current) clearTimeout(intervalRef.current); };
  }, [arRunning, apRunning, tick]);

  return { feed, isProcessing };
}
