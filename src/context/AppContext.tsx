import { createContext, useContext, useState, useCallback } from 'react';
import type { Notification } from '../types/common.types';
import { NOTIFICATIONS } from '../data';

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
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [arRunning, setARRunning] = useState(true);
  const [apRunning, setAPRunning] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const notificationCount = notifications.filter(n => n.type !== 'completed').length;

  return (
    <AppContext.Provider value={{
      arRunning, apRunning, setARRunning, setAPRunning,
      sidebarOpen, setSidebarOpen,
      notifications, dismissNotification, notificationCount,
      notificationsOpen, setNotificationsOpen,
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
