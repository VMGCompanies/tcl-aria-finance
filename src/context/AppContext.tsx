import { createContext, useContext, useState, useCallback } from 'react';
import type { Notification } from '../types/common.types';
import { NOTIFICATIONS } from '../data';

interface SessionStats {
  actions: number;
  dollars: number;
}

interface AppContextType {
  arRunning: boolean;
  apRunning: boolean;
  setARRunning: (v: boolean) => void;
  setAPRunning: (v: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  notifications: Notification[];
  dismissNotification: (id: string) => void;
  notificationCount: number;
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
  arStats: SessionStats;
  apStats: SessionStats;
  incrementARStats: (dollars: number) => void;
  incrementAPStats: (dollars: number) => void;
  lastARAction: string;
  lastAPAction: string;
  setLastARAction: (s: string) => void;
  setLastAPAction: (s: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [arRunning, setARRunning] = useState(true);
  const [apRunning, setAPRunning] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [arStats, setARStats] = useState<SessionStats>({ actions: 47, dollars: 284600 });
  const [apStats, setAPStats] = useState<SessionStats>({ actions: 31, dollars: 187200 });
  const [lastARAction, setLastARAction] = useState('Payment reminder dispatched — Advocate Health');
  const [lastAPAction, setLastAPAction] = useState('3-way PO match completed — Graybar Electric');

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const incrementARStats = useCallback((dollars: number) => {
    setARStats(prev => ({ actions: prev.actions + 1, dollars: prev.dollars + dollars }));
  }, []);

  const incrementAPStats = useCallback((dollars: number) => {
    setAPStats(prev => ({ actions: prev.actions + 1, dollars: prev.dollars + dollars }));
  }, []);

  const notificationCount = notifications.filter(n => n.type !== 'completed').length;

  return (
    <AppContext.Provider value={{
      arRunning, apRunning, setARRunning, setAPRunning,
      sidebarOpen, setSidebarOpen,
      notifications, dismissNotification, notificationCount,
      notificationsOpen, setNotificationsOpen,
      arStats, apStats, incrementARStats, incrementAPStats,
      lastARAction, lastAPAction, setLastARAction, setLastAPAction,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
