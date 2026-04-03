import type { PaymentQueueItem } from '../../types/ap.types';

export const PAYMENT_QUEUE: PaymentQueueItem[] = [
  { id: 'pq-1', vendorId: 'ven-ill-gas', vendorName: 'Illinois Gas & Electric', invoiceId: 'ap-ill-gas-q2', invoiceNumber: 'ILL-GAS-Q2', amount: 284000, discount: 0, netPayment: 284000, method: 'ACH', priority: 'Routine', scheduledDate: '2026-04-03', selected: true },
  { id: 'pq-2', vendorId: 'ven-verizon', vendorName: 'Verizon Business', invoiceId: 'ap-verizon', invoiceNumber: 'VERIZON-B2B', amount: 124000, discount: 0, netPayment: 124000, method: 'ACH', priority: 'Routine', scheduledDate: '2026-04-03', selected: true },
  { id: 'pq-3', vendorId: 'ven-mccann', vendorName: 'McCann Industries', invoiceId: 'ap-mccann-0421', invoiceNumber: 'MCCANN-0421', amount: 180000, discount: 0, netPayment: 180000, method: 'Check', priority: 'Routine', scheduledDate: '2026-04-03', selected: true },
  { id: 'pq-4', vendorId: 'ven-wesco', vendorName: 'WESCO Distribution', invoiceId: 'ap-wesco-44102', invoiceNumber: 'WESCO-44102', amount: 2210000, discount: 0, netPayment: 2210000, method: 'ACH', priority: 'Routine', scheduledDate: '2026-04-03', selected: true },
  { id: 'pq-5', vendorId: 'ven-rexel', vendorName: 'Rexel Holdings', invoiceId: 'ap-rlt-22817', invoiceNumber: 'RLT-22817', amount: 987000, discount: 0, netPayment: 987000, method: 'ACH', priority: 'Routine', scheduledDate: '2026-04-03', selected: true },
  { id: 'pq-6', vendorId: 'ven-uslighting', vendorName: 'US Lighting Corp', invoiceId: 'ap-usl-003312', invoiceNumber: 'USL-003312', amount: 3160000, discount: 0, netPayment: 3160000, method: 'ACH', priority: 'Routine', scheduledDate: '2026-04-03', selected: true },
];
