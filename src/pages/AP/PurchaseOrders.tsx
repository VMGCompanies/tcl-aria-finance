import { PageHeader } from '../../components/ui/PageHeader'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { PurchaseOrder } from '../../types/ap.types'
import { Plus } from 'lucide-react'

export function APPurchaseOrders() {
  const pos: PurchaseOrder[] = [
    { id: 'po-8847', poNumber: 'TCL-PO-8847', vendorId: 'ven-graybar', vendorName: 'Graybar Electric Supply', projectId: 'proj-1', projectName: 'Advocate Health LED Retrofit', issueDate: '2026-03-20', amount: 4000000, amountReceived: 4218000, amountInvoiced: 4218000, status: 'Partial', lineItems: [] },
    { id: 'po-8821', poNumber: 'TCL-PO-8821', vendorId: 'ven-cooper', vendorName: 'Cooper Electric Inc.', projectId: 'proj-3', projectName: 'Municipal Complex Upgrade', issueDate: '2026-03-22', amount: 1834000, amountReceived: 1834000, amountInvoiced: 1834000, status: 'Closed', lineItems: [] },
    { id: 'po-8815', poNumber: 'TCL-PO-8815', vendorId: 'ven-rexel', vendorName: 'Rexel Holdings', projectId: 'proj-4', projectName: 'Chicagoland Parking Lots', issueDate: '2026-03-25', amount: 987000, amountReceived: 987000, amountInvoiced: 987000, status: 'Closed', lineItems: [] },
    { id: 'po-8809', poNumber: 'TCL-PO-8809', vendorId: 'ven-sunbelt', vendorName: 'Sunbelt Rentals', projectId: 'proj-5', projectName: 'Northwestern Medicine', issueDate: '2026-03-28', amount: 420000, amountReceived: 0, amountInvoiced: 420000, status: 'Partial', lineItems: [] },
    { id: 'po-8805', poNumber: 'TCL-PO-8805', vendorId: 'ven-uslighting', vendorName: 'US Lighting Corp', projectId: 'proj-2', projectName: 'Walmart Distribution Q2', issueDate: '2026-03-26', amount: 3160000, amountReceived: 3160000, amountInvoiced: 3160000, status: 'Open', lineItems: [] },
    { id: 'po-8801', poNumber: 'TCL-PO-8801', vendorId: 'ven-wesco', vendorName: 'WESCO Distribution', projectId: 'proj-6', projectName: 'Loyola Campus Project', issueDate: '2026-03-29', amount: 2210000, amountReceived: 2210000, amountInvoiced: 2210000, status: 'Open', lineItems: [] },
    { id: 'po-8798', poNumber: 'TCL-PO-8798', vendorId: 'ven-mccann', vendorName: 'McCann Industries', projectId: 'proj-7', projectName: "Hilton O'Hare Ballroom", issueDate: '2026-03-27', amount: 180000, amountReceived: 0, amountInvoiced: 180000, status: 'Open', lineItems: [] },
    { id: 'po-8795', poNumber: 'TCL-PO-8795', vendorId: 'ven-metro-elec', vendorName: 'Metro Electric Sub', projectId: 'proj-8', projectName: 'Naperville Phase 3', issueDate: '2026-03-15', amount: 2850000, amountReceived: 2850000, amountInvoiced: 2850000, status: 'Open', lineItems: [] },
  ]

  const COLUMNS: Column<PurchaseOrder>[] = [
    {
      key: 'poNumber',
      header: 'PO Number',
      accessor: r => <span className="font-mono text-xs text-[#1A2E4A] font-semibold">{r.poNumber}</span>,
    },
    {
      key: 'vendorName',
      header: 'Vendor',
      sortable: true,
      accessor: r => <span className="text-xs font-medium">{r.vendorName}</span>,
    },
    {
      key: 'projectName',
      header: 'Project',
      accessor: r => <span className="text-xs text-[#475569]">{r.projectName}</span>,
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      accessor: r => <span className="text-xs">{formatDate(r.issueDate)}</span>,
    },
    {
      key: 'amount',
      header: 'PO Amount',
      sortable: true,
      accessor: r => <span className="text-xs font-medium">{formatCurrency(r.amount)}</span>,
    },
    {
      key: 'amountInvoiced',
      header: 'Invoiced',
      accessor: r => {
        const over = r.amountInvoiced > r.amount
        return (
          <span className={`text-xs ${over ? 'text-red-600 font-bold' : 'text-[#475569]'}`}>
            {formatCurrency(r.amountInvoiced)}{over && ' ⚠️'}
          </span>
        )
      },
    },
    {
      key: 'status',
      header: 'Status',
      accessor: r => (
        <StatusBadge
          status={r.status === 'Open' ? 'Active' : r.status === 'Closed' ? 'Paid' : 'Partial'}
          size="sm"
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      accessor: () => <Button variant="ghost" size="sm">View</Button>,
    },
  ]

  return (
    <div className="pb-12 pt-8">
      <PageHeader
        title="Purchase Orders"
        breadcrumb={[{ label: 'AP' }, { label: 'Purchase Orders' }]}
        subtitle={`${pos.length} active POs · ARIA-AP matching all incoming invoices`}
        actions={<Button variant="primary" size="sm"><Plus size={13} /> Create PO</Button>}
      />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <Card padding="sm">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Open POs</div>
          <div className="text-2xl font-bold">{pos.filter(p => p.status === 'Open').length}</div>
        </Card>
        <Card padding="sm" className="border-yellow-200">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Over Budget</div>
          <div className="text-2xl font-bold text-yellow-600">{pos.filter(p => p.amountInvoiced > p.amount).length}</div>
        </Card>
        <Card padding="sm">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Total Open Value</div>
          <div className="text-xl font-bold">
            {formatCurrency(pos.filter(p => p.status === 'Open').reduce((s, p) => s + p.amount, 0))}
          </div>
        </Card>
      </div>

      <DataTable
        columns={COLUMNS}
        data={pos}
        keyExtractor={r => r.id}
        rowClassName={r => r.amountInvoiced > r.amount ? 'bg-yellow-50/40' : ''}
      />
    </div>
  )
}
