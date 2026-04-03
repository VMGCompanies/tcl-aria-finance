import { useState } from 'react'
import { FileText, Download, Send, DollarSign, AlertCircle, CheckCircle, RefreshCw, Clock } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Card } from '../../components/ui/Card'
import { AIActivityFeed } from '../../components/shared/AIActivityFeed'
import { ALL_AR_INVOICES } from '../../data'
import type { ARInvoice } from '../../types/ar.types'
import { formatCurrency, formatDate, getDaysOverdue } from '../../lib/utils'

type FilterType = 'All' | 'Current' | 'Overdue' | 'Partial' | 'Paid' | 'Disputed'

export function ARInvoices() {
  const [filter, setFilter] = useState<FilterType>('All')
  const [search, setSearch] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState<ARInvoice | null>(null)
  const [paymentModal, setPaymentModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')

  const filtered = ALL_AR_INVOICES.filter(inv => {
    if (filter !== 'All' && !inv.status.startsWith(filter)) return false
    if (
      search &&
      !inv.clientName.toLowerCase().includes(search.toLowerCase()) &&
      !inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  const COLUMNS: Column<ARInvoice>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice #',
      sortable: true,
      accessor: r => (
        <span className="font-mono font-semibold text-[#1A2E4A] text-xs">{r.invoiceNumber}</span>
      ),
    },
    {
      key: 'clientName',
      header: 'Client',
      sortable: true,
      accessor: r => (
        <div>
          <div className="font-medium text-[#0F172A] text-xs">{r.clientName}</div>
          <div className="text-[11px] text-[#94A3B8]">{r.serviceType}</div>
        </div>
      ),
    },
    {
      key: 'projectName',
      header: 'Project',
      accessor: r => (
        <span className="text-xs text-[#475569] max-w-[180px] block truncate">{r.projectName}</span>
      ),
    },
    {
      key: 'issueDate',
      header: 'Inv. Date',
      sortable: true,
      accessor: r => <span className="text-xs text-[#475569]">{formatDate(r.issueDate)}</span>,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      sortable: true,
      accessor: r => {
        const overdue = getDaysOverdue(r.dueDate)
        return (
          <span
            className={`text-xs ${
              overdue > 0 && r.status !== 'Paid' ? 'text-red-600 font-medium' : 'text-[#475569]'
            }`}
          >
            {formatDate(r.dueDate)}
            {overdue > 0 && r.status !== 'Paid' && (
              <span className="ml-1 text-[10px]">(+{overdue}d)</span>
            )}
          </span>
        )
      },
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      accessor: r => <span className="text-xs font-medium">{formatCurrency(r.amount)}</span>,
    },
    {
      key: 'balance',
      header: 'Balance',
      sortable: true,
      accessor: r => (
        <span
          className={`text-xs font-semibold ${r.balance === 0 ? 'text-green-600' : 'text-[#0F172A]'}`}
        >
          {r.balance === 0 ? '—' : formatCurrency(r.balance)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: r => <StatusBadge status={r.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: r => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e?.stopPropagation()
              setSelectedInvoice(r)
            }}
            className="text-xs px-2"
          >
            View
          </Button>
          {r.status !== 'Paid' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={e => {
                e?.stopPropagation()
                setSelectedInvoice(r)
                setPaymentModal(true)
              }}
              className="text-xs px-2"
            >
              Pay
            </Button>
          )}
        </div>
      ),
    },
  ]

  const FILTER_TABS: { label: string; value: FilterType; count: number }[] = [
    { label: 'All', value: 'All', count: ALL_AR_INVOICES.length },
    {
      label: 'Current',
      value: 'Current',
      count: ALL_AR_INVOICES.filter(i => i.status === 'Current').length,
    },
    {
      label: 'Overdue',
      value: 'Overdue',
      count: ALL_AR_INVOICES.filter(i => i.status === 'Overdue').length,
    },
    {
      label: 'Partial',
      value: 'Partial',
      count: ALL_AR_INVOICES.filter(i => i.status === 'Partial').length,
    },
    {
      label: 'Paid',
      value: 'Paid',
      count: ALL_AR_INVOICES.filter(i => i.status === 'Paid').length,
    },
    {
      label: 'Disputed',
      value: 'Disputed',
      count: ALL_AR_INVOICES.filter(i => i.status === 'Disputed').length,
    },
  ]

  return (
    <div className="pb-12 pt-8">
      <PageHeader
        title="Invoices"
        breadcrumb={[{ label: 'AR' }, { label: 'Invoices' }]}
        subtitle={`${ALL_AR_INVOICES.length} total invoices · ARIA-AR monitoring all accounts`}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Download size={13} /> Export
            </Button>
            <Button variant="primary" size="sm">
              <FileText size={13} /> New Invoice
            </Button>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto">
        {FILTER_TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === t.value
                ? 'bg-[#1A2E4A] text-white'
                : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F7F8FA]'
            }`}
          >
            {t.label}
            <span
              className={`text-[10px] px-1 py-0.5 rounded-full ${
                filter === t.value ? 'bg-white/20' : 'bg-[#F7F8FA] text-[#94A3B8]'
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
        <div className="ml-auto">
          <input
            type="text"
            placeholder="Search invoices..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-sm px-3 py-1.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2E4A]/20 w-48"
          />
        </div>
      </div>

      <DataTable
        columns={COLUMNS}
        data={filtered}
        keyExtractor={r => r.id}
        onRowClick={setSelectedInvoice}
        pageSize={15}
        rowClassName={r =>
          r.status === 'Disputed' ? 'bg-orange-50/40' : r.status === 'Overdue' ? 'bg-red-50/30' : ''
        }
      />

      {/* Invoice Detail Modal */}
      {selectedInvoice && !paymentModal && (
        <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}

      {/* Apply Payment Modal */}
      {paymentModal && selectedInvoice && (
        <Modal
          open
          onClose={() => setPaymentModal(false)}
          title={`Apply Payment — ${selectedInvoice.invoiceNumber}`}
          subtitle={`Balance: ${formatCurrency(selectedInvoice.balance)}`}
          size="sm"
          footer={
            <div className="flex gap-2">
              <Button variant="success" onClick={() => setPaymentModal(false)}>
                Apply Payment
              </Button>
              <Button variant="secondary" onClick={() => setPaymentModal(false)}>
                Cancel
              </Button>
            </div>
          }
        >
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-[#475569] block mb-1">Payment Amount</label>
              <input
                type="text"
                value={paymentAmount}
                onChange={e => setPaymentAmount(e.target.value)}
                placeholder={formatCurrency(selectedInvoice.balance)}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2E4A]/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#475569] block mb-1">Payment Method</label>
              <select className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none">
                <option>ACH</option>
                <option>Check</option>
                <option>Wire</option>
                <option>Credit Card</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#475569] block mb-1">Payment Date</label>
              <input
                type="date"
                defaultValue="2026-04-03"
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#475569] block mb-1">Reference / Check #</label>
              <input
                type="text"
                placeholder="Optional"
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function InvoiceDetailModal({
  invoice,
  onClose,
}: {
  invoice: ARInvoice
  onClose: () => void
}) {
  const collectionStages = [
    { label: 'Invoice Delivered', day: 'Day 0', done: true },
    { label: 'Day 10 Reminder', day: 'Day 10', done: invoice.collectionStage >= 2 },
    { label: 'Day 24 Pre-Due', day: 'Day 24', done: invoice.collectionStage >= 2 },
    { label: 'Due Date Monitor', day: 'Day 30', done: invoice.collectionStage >= 3 },
    {
      label: 'First Overdue Notice',
      day: 'Day 33',
      done: invoice.collectionStage >= 3,
      active: invoice.collectionStage === 3,
    },
    { label: 'Escalate to Controller', day: 'Day 45', done: invoice.collectionStage >= 4 },
    { label: 'Formal Demand', day: 'Day 60', done: invoice.collectionStage >= 5 },
  ]

  return (
    <Modal
      open
      onClose={onClose}
      title={`Invoice ${invoice.invoiceNumber}`}
      subtitle={invoice.clientName}
      size="xl"
    >
      {/* Header actions */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <StatusBadge status={invoice.status} />
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" size="sm">
            <Download size={13} /> Download PDF
          </Button>
          <Button variant="secondary" size="sm">
            <Send size={13} /> Resend
          </Button>
          <Button variant="primary" size="sm">
            <DollarSign size={13} /> Record Payment
          </Button>
          {invoice.status !== 'Disputed' && (
            <Button variant="danger" size="sm">
              <AlertCircle size={13} /> Dispute
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Client Contact</div>
              <div className="font-medium text-[#0F172A]">{invoice.clientContact}</div>
              <div className="text-[#475569]">{invoice.clientEmail}</div>
            </div>
            <div>
              <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Site Address</div>
              <div className="text-[#475569]">{invoice.siteAddress}</div>
            </div>
            <div>
              <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Work Order</div>
              <div className="font-mono text-xs">{invoice.workOrderNumber}</div>
              {invoice.poNumber && (
                <div className="text-[#94A3B8] text-xs">PO: {invoice.poNumber}</div>
              )}
            </div>
            <div>
              <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Team</div>
              <div className="text-xs text-[#475569]">PM: {invoice.projectManager}</div>
              <div className="text-xs text-[#475569]">
                Lead: {invoice.leadTech} + {invoice.crewSize - 1} crew
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              Line Items
            </h4>
            <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-[#F7F8FA]">
                  <tr>
                    {['Description', 'Qty', 'Unit', 'Unit Price', 'Total'].map(h => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left font-semibold text-[#94A3B8] uppercase tracking-wider text-[10px]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {invoice.lineItems.map((li, i) => (
                    <tr key={i} className="hover:bg-[#F8FAFC]">
                      <td className="px-3 py-2 text-[#0F172A]">{li.description}</td>
                      <td className="px-3 py-2 text-[#475569]">{li.qty}</td>
                      <td className="px-3 py-2 text-[#475569]">{li.unit}</td>
                      <td className="px-3 py-2 text-[#475569]">{formatCurrency(li.unitPrice)}</td>
                      <td className="px-3 py-2 font-medium text-[#0F172A]">{formatCurrency(li.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[#F7F8FA] border-t-2 border-[#E2E8F0]">
                  <tr>
                    <td colSpan={4} className="px-3 py-2 font-bold text-[#0F172A] text-right">
                      Total
                    </td>
                    <td className="px-3 py-2 font-bold text-[#0F172A]">{formatCurrency(invoice.amount)}</td>
                  </tr>
                  {invoice.amountPaid > 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-1.5 text-green-600 text-right text-xs">
                        Paid
                      </td>
                      <td className="px-3 py-1.5 text-green-600 text-xs font-medium">
                        ({formatCurrency(invoice.amountPaid)})
                      </td>
                    </tr>
                  )}
                  {invoice.balance > 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-1.5 font-bold text-[#0F172A] text-right">
                        Balance Due
                      </td>
                      <td className="px-3 py-1.5 font-bold text-[#0F172A]">
                        {formatCurrency(invoice.balance)}
                      </td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          </div>

          {/* ARIA-AR Activity */}
          <div>
            <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
              ARIA-AR Activity Log
            </h4>
            <Card padding="none">
              <AIActivityFeed entries={invoice.aiActivity} maxHeight={200} />
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          {/* Summary */}
          <Card padding="sm">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#94A3B8] text-xs">Invoice Date</span>
                <span className="font-medium text-xs">{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8] text-xs">Due Date</span>
                <span className="font-medium text-xs">{formatDate(invoice.dueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8] text-xs">Invoice Total</span>
                <span className="font-bold">{formatCurrency(invoice.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#94A3B8] text-xs">Paid</span>
                <span className="text-green-600 font-medium text-xs">{formatCurrency(invoice.amountPaid)}</span>
              </div>
              <div className="flex justify-between border-t border-[#E2E8F0] pt-2">
                <span className="text-[#94A3B8] text-xs font-semibold">Balance Due</span>
                <span
                  className={`font-bold ${invoice.balance === 0 ? 'text-green-600' : 'text-[#0F172A]'}`}
                >
                  {formatCurrency(invoice.balance)}
                </span>
              </div>
            </div>
          </Card>

          {/* Collection Sequence */}
          <div>
            <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              Collection Sequence
            </h4>
            <div className="space-y-1.5">
              {collectionStages.map((stage, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-xs py-1 px-2 rounded ${
                    stage.active ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                >
                  {stage.done ? (
                    <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                  ) : stage.active ? (
                    <RefreshCw size={12} className="text-blue-500 animate-spin flex-shrink-0" />
                  ) : (
                    <Clock size={12} className="text-gray-300 flex-shrink-0" />
                  )}
                  <span className={stage.done ? 'text-[#475569]' : 'text-[#94A3B8]'}>{stage.label}</span>
                  <span className="ml-auto text-[10px] text-[#94A3B8]">{stage.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div>
            <h4 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              Documents
            </h4>
            {['Invoice PDF', 'Signed Completion Certificate', 'Site Photos (3)', 'Permit Documents'].map(
              doc => (
                <button
                  key={doc}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#475569] hover:bg-[#F7F8FA] rounded transition-colors"
                >
                  <FileText size={12} className="text-[#94A3B8]" />
                  {doc}
                  <Download size={11} className="ml-auto text-[#94A3B8]" />
                </button>
              )
            )}
          </div>

          {invoice.notes && (
            <Card padding="sm" className="bg-yellow-50 border-yellow-200">
              <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Notes</div>
              <p className="text-xs text-[#475569]">{invoice.notes}</p>
            </Card>
          )}
        </div>
      </div>
    </Modal>
  )
}
