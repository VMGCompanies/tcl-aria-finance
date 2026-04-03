export interface TimeSeriesPoint {
  week: string;
  value: number;
}

export interface ActivityEntry {
  id: string;
  timestamp: string;
  ade: 'ARIA-AR' | 'ARIA-AP' | 'Human';
  actor?: string;
  action: string;
  entity?: string;
  entityId?: string;
  details?: string;
  status: 'success' | 'warning' | 'active' | 'info';
  channel?: 'Email' | 'Portal' | 'Phone' | 'SMS' | 'System';
}

export interface Notification {
  id: string;
  type: 'action-required' | 'pending' | 'completed';
  ade: 'ARIA-AR' | 'ARIA-AP';
  title: string;
  description: string;
  timestamp: string;
  link?: string;
}

export interface User {
  id: string;
  name: string;
  role: string;
  accessLevel: 'super-admin' | 'admin' | 'reviewer';
  ades: string[];
  lastLogin: string;
  email: string;
}
