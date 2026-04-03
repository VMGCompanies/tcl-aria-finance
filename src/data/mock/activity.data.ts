import type { ActivityEntry } from '../../types/common.types';

export const LIVE_ACTIVITY: ActivityEntry[] = [
  { id: 'a1', timestamp: 'Today 2:14 PM', ade: 'ARIA-AR', action: 'Invoice #TCL-4821 sent to Walmart Distribution Center — Bolingbrook, IL', status: 'success', channel: 'Email' },
  { id: 'a2', timestamp: 'Today 2:11 PM', ade: 'ARIA-AP', action: '3-way PO match completed — Graybar Electric Supply, PO #8847', status: 'success', channel: 'System' },
  { id: 'a3', timestamp: 'Today 2:09 PM', ade: 'ARIA-AR', action: 'Payment reminder sequence initiated — City of Elgin (Invoice #TCL-4798, $28,450)', status: 'active', channel: 'Email' },
  { id: 'a4', timestamp: 'Today 2:06 PM', ade: 'ARIA-AP', action: 'Exception flagged — Cooper Electric, Invoice discrepancy $340', status: 'warning', channel: 'System' },
  { id: 'a5', timestamp: 'Today 2:03 PM', ade: 'ARIA-AR', action: 'Lien waiver request sent — Allied Construction, Project #PROJ-2241', status: 'success', channel: 'Portal' },
  { id: 'a6', timestamp: 'Today 1:58 PM', ade: 'ARIA-AR', action: 'Payment posted — Chicagoland Property Management, $14,800', status: 'success', channel: 'System' },
  { id: 'a7', timestamp: 'Today 1:52 PM', ade: 'ARIA-AP', action: 'Vendor invoice received — WESCO Distribution, $22,100', status: 'info', channel: 'Email' },
  { id: 'a8', timestamp: 'Today 1:47 PM', ade: 'ARIA-AR', action: 'Overdue notice dispatched — Village of Schaumburg (Invoice #TCL-4672, $31,200)', status: 'active', channel: 'Email' },
  { id: 'a9', timestamp: 'Today 1:41 PM', ade: 'ARIA-AP', action: 'Early pay discount alert — Graybar Electric $843.60 expires today 5PM', status: 'warning', channel: 'System' },
  { id: 'a10', timestamp: 'Today 1:35 PM', ade: 'ARIA-AR', action: 'Collection sequence advanced — Loyola University Chicago, Day 21', status: 'active', channel: 'System' },
  { id: 'a11', timestamp: 'Today 1:28 PM', ade: 'ARIA-AP', action: 'COI renewal request sent — Metro Electric Sub (policy expired 03/15/26)', status: 'warning', channel: 'Email' },
  { id: 'a12', timestamp: 'Today 1:22 PM', ade: 'ARIA-AR', action: 'Invoice #TCL-4836 delivered — Advocate Health, ap@advocatehealth.com', status: 'success', channel: 'Email' },
];

export const AI_ACTION_TEMPLATES = [
  { ade: 'ARIA-AR' as const, action: 'Invoice #{num} delivered to {client}', status: 'success' as const, channel: 'Email' as const },
  { ade: 'ARIA-AR' as const, action: 'Payment reminder sent — {client} (Day {day} of Net 30)', status: 'active' as const, channel: 'Email' as const },
  { ade: 'ARIA-AR' as const, action: 'Payment matched — {client} ${amount}', status: 'success' as const, channel: 'System' as const },
  { ade: 'ARIA-AP' as const, action: '3-way PO match completed — {vendor}', status: 'success' as const, channel: 'System' as const },
  { ade: 'ARIA-AP' as const, action: 'Vendor invoice processed — {vendor}, ${amount}', status: 'info' as const, channel: 'Email' as const },
  { ade: 'ARIA-AP' as const, action: 'Exception flagged — {vendor}, discrepancy ${amount}', status: 'warning' as const, channel: 'System' as const },
];
