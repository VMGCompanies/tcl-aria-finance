import type { Notification } from '../../types/common.types';

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'action-required', ade: 'ARIA-AP', title: 'Graybar Electric overage — $843.60 discount expires TODAY', description: 'Invoice GB-2026-8847 is $2,180 over PO. Early pay discount of $843.60 expires at 5PM today. Approval required.', timestamp: '2:14 PM', link: '/ap/invoices' },
  { id: 'n2', type: 'action-required', ade: 'ARIA-AP', title: 'Metro Electric Sub — COI expired, $28,500 payment held', description: 'Certificate of Insurance expired 03/15/26. Payment of $28,500 withheld. Renewal requested, no response yet.', timestamp: '9:02 AM', link: '/ap/subcontractors' },
  { id: 'n3', type: 'pending', ade: 'ARIA-AR', title: 'Walgreens dispute — INV #TCL-4744 ($18,600)', description: 'Client claims work not completed per scope. Legal review flag set. Controller assignment recommended.', timestamp: 'Yesterday 3:18 PM', link: '/ar/invoices' },
  { id: 'n4', type: 'pending', ade: 'ARIA-AP', title: 'ABCO Electric — no PO on file, $7,440 held', description: 'No matching Purchase Order found for ABCO Electric Supply. Invoice held pending PO creation or approval.', timestamp: 'Yesterday 3:01 PM', link: '/ap/invoices' },
  { id: 'n5', type: 'pending', ade: 'ARIA-AR', title: 'City of Elgin — 3 days overdue, collection active', description: 'Invoice #TCL-4798 ($28,450) is 3 days past due. Standard municipal overdue sequence running.', timestamp: 'Today 9:00 AM', link: '/ar/collections' },
  { id: 'n6', type: 'completed', ade: 'ARIA-AR', title: 'Payment reconciled — Chicagoland Property Mgmt $14,800', description: 'ACH matched 100% to Invoice #TCL-4788. Invoice marked PAID.', timestamp: 'Today 2:15 PM', link: '/ar/reconciliation' },
  { id: 'n7', type: 'completed', ade: 'ARIA-AR', title: 'Invoice #TCL-4836 delivered — Advocate Health', description: 'PDF delivered and upload to vendor portal confirmed.', timestamp: 'Today 4:03 PM', link: '/ar/invoices' },
  { id: 'n8', type: 'completed', ade: 'ARIA-AP', title: '11 vendor invoices auto-processed — 3-way match', description: 'Cooper Electric, Rexel, US Lighting, WESCO and 7 others auto-approved and queued.', timestamp: 'Today 11:31 AM', link: '/ap/invoices' },
  { id: 'n9', type: 'completed', ade: 'ARIA-AR', title: 'Collection sequence advanced — 6 accounts', description: "City of Elgin, Village of Schaumburg, Loyola, Hilton O'Hare, Northwestern Medicine, ABCO reviewed.", timestamp: 'Today 9:00 AM', link: '/ar/collections' },
  { id: 'n10', type: 'completed', ade: 'ARIA-AP', title: 'Payment run executed — $44,320 (7 vendors)', description: 'Yesterday 5PM payment run completed successfully. Bank confirmations received for all ACH.', timestamp: 'Yesterday 5:04 PM', link: '/ap/payments' },
];
