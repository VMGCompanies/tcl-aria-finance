import type { TimeSeriesPoint, ActivityEntry } from './common.types';

export type InvoiceStatus = 'Draft' | 'Sent' | 'Current' | 'Partial' | 'Paid' | 'Overdue' | 'Disputed' | 'Void';
export type AgingBucket = 'Current' | '1–30' | '31–60' | '61–90' | '90+';

export interface InvoiceLineItem {
  description: string;
  qty: number;
  unit: string;
  unitPrice: number; // cents
  total: number; // cents
}

export interface ARInvoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientContact: string;
  clientEmail: string;
  projectId: string;
  projectName: string;
  siteAddress: string;
  serviceType: string;
  workOrderNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number; // cents
  amountPaid: number; // cents
  balance: number; // cents
  status: InvoiceStatus;
  agingBucket: AgingBucket;
  lineItems: InvoiceLineItem[];
  daysOverdue: number;
  lienWaiverRequired: boolean;
  lienWaiverStatus?: 'pending' | 'sent' | 'received';
  retainageAmount?: number;
  poNumber?: string;
  projectManager: string;
  leadTech: string;
  crewSize: number;
  completionDate: string;
  aiActivity: ActivityEntry[];
  collectionStage: number;
  notes?: string;
}

export interface CollectionAccount {
  clientId: string;
  clientName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  invoices: string[];
  totalBalance: number;
  daysOverdue: number;
  collectionStage: number;
  lastTouch: string;
  nextAction: string;
  aiStatus: string;
  aiAssessment: string;
  paymentHistory: { avgDays: number; totalInvoices: number; disputes: number };
}

export interface Payment {
  id: string;
  date: string;
  method: string;
  amount: number;
  payer: string;
  matchedTo: string | null;
  matchedInvoiceId: string | null;
  confidence: number;
  status: 'auto-matched' | 'needs-review' | 'manual' | 'returned';
  reference?: string;
  notes?: string;
}

export interface RetainageRecord {
  projectId: string;
  projectName: string;
  clientName: string;
  contractValue: number;
  retainagePct: number;
  heldAmount: number;
  eligibleDate: string;
  status: 'Pending Release' | 'Release Imminent' | 'Released' | 'Disputed';
}

export interface LienWaiver {
  id: string;
  projectName: string;
  clientName: string;
  type: 'Conditional' | 'Unconditional';
  amount: number;
  sentDate: string;
  status: 'Pending' | 'Signed' | 'Overdue';
  docuSignId?: string;
}

export interface ARSummary {
  totalOutstanding: number;
  current: number;
  overdue31_90: number;
  totalAP: number;
  invoicesThisMonth: number;
  aiInvoicesThisMonth: number;
  cashThisWeek: number;
  dso: number;
  firstTouchRate: number;
  invoiceAccuracyRate: number;
  disputeRate: number;
  cashYTD: number;
  trend: TimeSeriesPoint[];
}
