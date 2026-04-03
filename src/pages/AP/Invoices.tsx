import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Card } from '../../components/ui/Card'
import { AP_INVOICES } from '../../data'
import type { VendorInvoice } from '../../types/ap.types'
import { formatCurrency, formatDate } from '../../lib/utils'
import { Bot, AlertTriangle, CheckCircle, XCircle, Download, Eye } from 'lucide-react'
import { AIActivityFeed } from '../../components/shared/AIActivityFeed'

export function APInvoices() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState<VendorInvoice | null>(null)

  const filtered = filter === 'All' ? AP_INVOICES : AP_INVOICES.filter(i => {
    if (filter === 'Exception') return i.status === 'Exception' || i.status === 'Held'
    if (filter === 'Auto-Approved') return i.status === 'Auto-Approved' || i.status === 'Approved'
    return i.status === filter
  })

  const exceptionCount = AP_INVOICES.filter(i => i.status === 'Exception' || i.status === 'Held').length

  const FILTERS = [
    { label: 'All', count: AP_INVOICES.length },
    { label: 'Exception', count: exceptionCount },
    { label: 'Auto-Approved', count: AP_INVOICES.filter(i => i.status === 'Auto-Approved').length },
    { label: 'Queued', count: AP_INVOICES.filter(i => i.status === 'Queued').length },
    { label: 'Approved', count: AP_INVOICES.filter(i => i.status === 'Approved').length },
  ]

  const COLUMNS: Column<VendorInvoice>[] = [
    {
      key: 'vendorInvoiceNumber',
      header: 'Invoice #',
      accessor: r => <span className="font-mono text-xs text-[#1A2E4A]">{r.vendorInvoiceNumber}</span>,
    },
    {
      key: 'vendorName',
      header: 'Vendor',
      sortable: true,
      accessor: r => (
        <div>
          <div className="font-medium text-[#0F172A] text-xs">{r.vendorName}</div>
          <div className="text-[11px] text-[#94A3B8]">{r.category}</div>
        </div>
      ),
    },
    {
      key: 'poNumber',
      header: 'PO #',
      accessor: r => <span className="text-xs font-mono text-[#475569]">{r.poNumber || '—'}</span>,
    },
    {
      key: 'invoiceDate',
      header: 'Inv. Date',
      accessor: r => <span className="text-xs">{formatDate(r.invoiceDate)}</span>,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      accessor: r => <span className="text-xs">{formatDate(r.dueDate)}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      accessor: r => <span className="text-xs font-semibold">{formatCurrency(r.amount)}</span>,
    },
    {
      key: 'matchLabel',
      header: 'Match Status',
      accessor: r => (
        <span className={`text-xs ${r.matchStatus === 'exception' || r.matchStatus === 'no-match' ? 'text-yellow-600' : 'text-green-600'}`}>
          {r.matchLabel}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: r => <StatusBadge status={r.status === 'Held' ? 'Held' : r.status} size="sm" />,
    },
    {
      key: 'actions',
      header: '',
      accessor: r => (
        <Button variant="ghost" size="sm" onClick={e => { e?.stopPropagation(); setSelected(r) }}>
          <Eye size={12} />
        </Button>
      ),
    },
  ]

  return (
    <div className="pb-12 pt-8">
      <PageHeader
        title="Vendor Invoices"
        breadcrumb={[{ label: 'AP' }, { label: 'Vendor Invoices' }]}
        subtitle={`ARIA-AP processing all incoming vendor invoices · ${exceptionCount} exceptions require attention`}
        actions={<Button variant="primary" size="sm"><Download size={13} /> Upload Invoice</Button>}
      />

      {exceptionCount > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3 text-sm">
          <AlertTriangle size={16} className="text-yellow-600 flex-shrink-0" />
          <span className="text-[#0F172A]">
            <strong>{exceptionCount} invoices</strong> require human review before payment can proceed.
          </span>
          <Button variant="orange" size="sm" className="ml-auto" onClick={() => setFilter('Exception')}>
            Review Exceptions
          </Button>
        </div>
      )}

      <div className="flex gap-1 mb-4 overflow-x-auto">
        {FILTERS.map(f => (
          <button
            key={f.label}
            onClick={() => setFilter(f.label)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f.label
                ? 'bg-[#1A2E4A] text-white'
                : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F7F8FA]'
            }`}
          >
            {f.label}
            <span className={`text-[10px] px-1 py-0.5 rounded-full ${filter === f.label ? 'bg-white/20' : 'bg-[#F7F8FA] text-[#94A3B8]'}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      <DataTable
        columns={COLUMNS}
        data={filtered}
        keyExtractor={r => r.id}
        onRowClick={setSelected}
        rowClassName={r => (r.status === 'Exception' || r.status === 'Held') ? 'bg-yellow-50/40' : ''}
      />

      {selected && <VendorInvoiceDetailModal invoice={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function VendorInvoiceDetailModal({ invoice, onClose }: { invoice: VendorInvoice; onClose: () => void }) {
  const isException = invoice.status === 'Exception' || invoice.status === 'Held'

  return (
    <Modal open onClose={onClose} title={`Vendor Invoice — ${invoice.vendorInvoiceNumber}`} subtitle={invoice.vendorName} size="xl">
      <div className="space-y-5">
        {/* Header row */}
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge status={isException ? 'Exception' : invoice.status} />
          {invoice.discountAvailable > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs font-semibold text-green-700">
              💰 Discount {formatCurrency(invoice.discountAvailable)} available
              {invoice.discountExpiry ? ` — expires ${formatDate(invoice.discountExpiry)}` : ''}
            </div>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" size="sm"><Download size={13} /> Invoice PDF</Button>
            {isException && (
              <>
                <Button variant="success" size="sm">
                  Approve {invoice.discountAvailable > 0 ? `& Capture ${formatCurrency(invoice.discountAvailable)}` : ''}
                </Button>
                <Button variant="danger" size="sm"><XCircle size={13} /> Reject</Button>
              </>
            )}
          </div>
        </div>

        {/* ARIA Analysis Banner */}
        {invoice.aiAnalysis && (
          <div className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Bot size={15} className="text-[#2563EB]" />
              <span className="text-sm font-semibold text-[#2563EB]">ARIA-AP Analysis</span>
              {invoice.ocrConfidence && (
                <span className="text-[11px] text-[#94A3B8] ml-auto">OCR: {invoice.ocrConfidence}% confidence</span>
              )}
            </div>
            <p className="text-sm text-[#475569]">{invoice.aiAnalysis}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-[#94A3B8] uppercase tracking-wider text-[10px] mb-0.5">Vendor</div>
                <div className="font-medium">{invoice.vendorName}</div>
                <div className="text-[#475569]">{invoice.vendorContact}</div>
                <div className="text-[#475569]">{invoice.vendorPhone}</div>
              </div>
              <div>
                <div className="text-[#94A3B8] uppercase tracking-wider text-[10px] mb-0.5">Invoice</div>
                <div className="font-mono">{invoice.vendorInvoiceNumber}</div>
                <div className="text-[#475569]">Date: {formatDate(invoice.invoiceDate)}</div>
                <div className="text-[#475569]">Due: {formatDate(invoice.dueDate)} · {invoice.terms}</div>
              </div>
            </div>

            {/* 3-Way Match */}
            <div>
              <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">3-Way Match Analysis</h4>
              <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-[#F7F8FA]">
                    <tr>
                      {['Line Item', 'PO Qty', 'Received', 'Inv. Qty', 'Unit Price', 'Total', 'Match'].map(h => (
                        <th key={h} className="px-2 py-2 text-left text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {invoice.lineItems.map((li, i) => (
                      <tr key={i} className={li.match === 'exception' ? 'bg-yellow-50' : li.match === 'no-po' ? 'bg-red-50' : ''}>
                        <td className="px-2 py-2 font-medium">{li.description}</td>
                        <td className="px-2 py-2 text-[#475569]">{li.poQty ?? '—'}</td>
                        <td className="px-2 py-2 text-[#475569]">{li.receivedQty ?? '—'}</td>
                        <td className="px-2 py-2">{li.invoiceQty}</td>
                        <td className="px-2 py-2">{formatCurrency(li.unitPrice)}</td>
                        <td className="px-2 py-2 font-medium">{formatCurrency(li.total)}</td>
                        <td className="px-2 py-2">
                          {li.match === 'match' ? (
                            <CheckCircle size={12} className="text-green-500" />
                          ) : li.match === 'exception' ? (
                            <AlertTriangle size={12} className="text-yellow-500" />
                          ) : (
                            <XCircle size={12} className="text-red-500" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#F7F8FA] border-t-2 border-[#E2E8F0]">
                    <tr>
                      <td colSpan={5} className="px-2 py-2 font-bold text-right">Total</td>
                      <td className="px-2 py-2 font-bold">{formatCurrency(invoice.amount)}</td>
                      <td className="px-2 py-2">
                        {invoice.matchStatus === 'exception' || invoice.matchStatus === 'no-match' ? (
                          <AlertTriangle size={12} className="text-yellow-500" />
                        ) : (
                          <CheckCircle size={12} className="text-green-500" />
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Activity Log */}
            <div>
              <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">ARIA-AP Activity Log</h4>
              <Card padding="none">
                <AIActivityFeed entries={invoice.aiActivity} maxHeight={180} />
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card padding="sm">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Category</span>
                  <span>{invoice.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">PO Number</span>
                  <span className="font-mono">{invoice.poNumber || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Terms</span>
                  <span>{invoice.terms}</span>
                </div>
                <div className="flex justify-between border-t border-[#E2E8F0] pt-2">
                  <span className="text-[#94A3B8] font-semibold">Invoice Total</span>
                  <span className="font-bold">{formatCurrency(invoice.amount)}</span>
                </div>
                {invoice.discountAvailable > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Early Pay Discount</span>
                    <span className="font-medium">-{formatCurrency(invoice.discountAvailable)}</span>
                  </div>
                )}
              </div>
            </Card>

            <div>
              <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Vendor Profile</h4>
              <Card padding="sm">
                <div className="space-y-1.5 text-xs">
                  <div className="font-medium text-[#0F172A]">{invoice.vendorName}</div>
                  <div className="text-[#475569]">{invoice.vendorContact}</div>
                  <div className="text-[#475569]">{invoice.vendorPhone}</div>
                  <div className="text-[#2563EB]">{invoice.vendorEmail}</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
