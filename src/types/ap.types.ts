import type { ActivityEntry } from './common.types';

export type VendorInvoiceStatus = 'Auto-Approved' | 'Approved' | 'Exception' | 'Queued' | 'Scheduled' | 'Held' | 'Paid';
export type MatchStatus = 'three-way' | 'two-way' | 'no-match' | 'exception';

export interface VendorInvoiceLineItem {
  description: string;
  poQty: number | null;
  receivedQty: number | null;
  invoiceQty: number;
  unit: string;
  unitPrice: number;
  total: number;
  match: 'match' | 'exception' | 'no-po';
}

export interface VendorInvoice {
  id: string;
  vendorInvoiceNumber: string;
  vendorId: string;
  vendorName: string;
  vendorContact: string;
  vendorPhone: string;
  vendorEmail: string;
  category: string;
  poNumber: string | null;
  receiptNumber: string | null;
  invoiceDate: string;
  dueDate: string;
  terms: string;
  amount: number; // cents
  discountAvailable: number; // cents
  discountExpiry: string | null;
  matchStatus: MatchStatus;
  matchLabel: string;
  status: VendorInvoiceStatus;
  exceptionReason?: string;
  lineItems: VendorInvoiceLineItem[];
  aiActivity: ActivityEntry[];
  aiAnalysis?: string;
  ocrConfidence?: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  projectId: string;
  projectName: string;
  issueDate: string;
  amount: number;
  amountReceived: number;
  amountInvoiced: number;
  status: 'Open' | 'Partial' | 'Closed' | 'Cancelled';
  lineItems: { description: string; qty: number; unit: string; unitPrice: number; total: number }[];
}

export interface Subcontractor {
  id: string;
  name: string;
  specialty: string;
  activeProjects: number;
  w9Status: 'on-file' | 'missing' | 'expired';
  coiStatus: 'valid' | 'expired' | 'missing' | 'expiring-soon';
  coiExpiry: string;
  lienWaiverStatus: 'received' | 'pending' | 'na';
  complianceStatus: 'Compliant' | 'Non-Compliant' | 'Expiring Soon';
  contact: string;
  phone: string;
  email: string;
  insurance: string;
  ein: string;
  is1099: boolean;
}

export interface PaymentQueueItem {
  id: string;
  vendorId: string;
  vendorName: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  discount: number;
  netPayment: number;
  method: 'ACH' | 'Check' | 'Wire';
  priority: 'Urgent' | 'Routine';
  scheduledDate: string;
  selected: boolean;
}
