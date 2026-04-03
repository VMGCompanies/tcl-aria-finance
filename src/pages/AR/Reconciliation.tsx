import { useState } from 'react'
import { CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { formatCurrency, formatDate } from '../../lib/utils'

interface Payment {
  id: string
  date: string
  method: string
  amount: number
  payer: string
  matchedTo: string | null
  invoiceId: string | null
  confidence: number
  status: string
  reference?: string
}

export function ARReconciliation() {
  const [reviewPayment, setReviewPayment] = useState<Payment | null>(null)
  const [confirmed, setConfirmed] = useState<string[]>([])

  const payments: Payment[] = [
    {
      id: 'pmt-1',
      date: '2026-04-03',
      method: 'ACH',
      amount: 1480000,
      payer: 'Chicagoland Property Mgmt',
      matchedTo: 'INV #TCL-4788',
      invoiceId: 'inv-4788',
      confidence: 100,
      status: 'Auto-Matched',
    },
    {
      id: 'pmt-2',
      date: '2026-04-03',
      method: 'Check #8841',
      amount: 3390000,
      payer: 'Hilton Hotels',
      matchedTo: 'INV #TCL-4710 (partial)',
      invoiceId: 'inv-4710',
      confidence: 98,
      status: 'Auto-Matched',
    },
    {
      id: 'pmt-3',
      date: '2026-04-02',
      method: 'ACH',
      amount: 4475000,
      payer: 'Northwestern Medicine',
      matchedTo: 'INV #TCL-4651 (partial)',
      invoiceId: 'inv-4651',
      confidence: 95,
      status: 'Auto-Matched',
    },
    {
      id: 'pmt-4',
      date: '2026-04-02',
      method: 'Wire',
      amount: 1860000,
      payer: 'Unknown — ref: "TCL March"',
      matchedTo: null,
      invoiceId: null,
      confidence: 0,
      status: 'Needs Review',
      reference: 'TCL March',
    },
  ]

  const COLUMNS: Column<Payment>[] = [
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      accessor: r => <span className="text-xs">{formatDate(r.date)}</span>,
    },
    {
      key: 'method',
      header: 'Method',
      accessor: r => <span className="text-xs font-mono">{r.method}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      accessor: r => <span className="text-xs font-semibold">{formatCurrency(r.amount)}</span>,
    },
    {
      key: 'payer',
      header: 'Payer',
      accessor: r => <span className="text-xs text-[#475569]">{r.payer}</span>,
    },
    {
      key: 'matchedTo',
      header: 'Matched To',
      accessor: r => (
        <span className={`text-xs ${r.matchedTo ? 'text-[#0F172A]' : 'text-red-500 italic'}`}>
          {r.matchedTo || 'No match found'}
        </span>
      ),
    },
    {
      key: 'confidence',
      header: 'Confidence',
      accessor: r => (
        <span
          className={`text-xs font-semibold ${
            r.confidence === 100
              ? 'text-green-600'
              : r.confidence >= 90
              ? 'text-blue-600'
              : r.confidence > 0
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}
        >
          {r.confidence > 0 ? `${r.confidence}%` : '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      accessor: r => {
        const isConfirmed = confirmed.includes(r.id)
        if (r.status === 'Needs Review' && !isConfirmed) {
          return (
            <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 uppercase">
              Needs Review
            </span>
          )
        }
        return (
          <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-green-50 text-green-700 uppercase">
            Matched
          </span>
        )
      },
    },
    {
      key: 'actions',
      header: '',
      accessor: r =>
        r.status === 'Needs Review' && !confirmed.includes(r.id) ? (
          <Button
            variant="orange"
            size="sm"
            onClick={e => {
              e?.stopPropagation()
              setReviewPayment(r)
            }}
          >
            Review
          </Button>
        ) : null,
    },
  ]

  return (
    <div className="pb-12 pt-8">
      <PageHeader
        title="Payment Reconciliation"
        breadcrumb={[{ label: 'AR' }, { label: 'Reconciliation' }]}
        subtitle="ARIA-AR auto-matching incoming payments to open invoices"
        actions={
          <Button variant="primary" size="sm">
            <RefreshCw size={13} /> Sync Bank Feed
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <Card padding="sm">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">
            Auto-Matched Today
          </div>
          <div className="text-2xl font-bold text-green-600">3</div>
          <div className="text-xs text-[#94A3B8]">
            {formatCurrency(1480000 + 3390000 + 4475000)} applied
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Needs Review</div>
          <div className="text-2xl font-bold text-yellow-600">{confirmed.length > 0 ? 0 : 1}</div>
        </Card>
        <Card padding="sm">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Match Rate</div>
          <div className="text-2xl font-bold text-[#0F172A]">97.4%</div>
          <div className="text-xs text-[#94A3B8]">All-time average</div>
        </Card>
      </div>

      <DataTable
        columns={COLUMNS}
        data={payments}
        keyExtractor={r => r.id}
        onRowClick={r => r.status === 'Needs Review' && setReviewPayment(r)}
        rowClassName={r =>
          r.status === 'Needs Review' && !confirmed.includes(r.id) ? 'bg-yellow-50/40' : ''
        }
      />

      {reviewPayment && (
        <Modal
          open
          onClose={() => setReviewPayment(null)}
          title="Review Unmatched Payment"
          size="md"
        >
          <div className="space-y-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
              <div className="flex items-center gap-2 mb-2 text-yellow-700 font-semibold">
                <AlertTriangle size={14} /> ARIA-AR Analysis
              </div>
              <p className="text-[#475569]">
                Wire transfer of {formatCurrency(reviewPayment.amount)} received{' '}
                {formatDate(reviewPayment.date)}. Reference "{reviewPayment.reference}" — closest match
                is Invoice #TCL-4744 (Walgreens, {formatCurrency(reviewPayment.amount)}, currently in
                Disputed status). Recommend human verification before posting.
              </p>
            </div>
            <div className="text-sm space-y-2">
              <div>
                <span className="text-[#94A3B8]">Amount:</span>{' '}
                <strong>{formatCurrency(reviewPayment.amount)}</strong>
              </div>
              <div>
                <span className="text-[#94A3B8]">Payer:</span> {reviewPayment.payer}
              </div>
              <div>
                <span className="text-[#94A3B8]">Reference:</span>{' '}
                <span className="font-mono">{reviewPayment.reference}</span>
              </div>
              <div>
                <span className="text-[#94A3B8]">Date:</span> {formatDate(reviewPayment.date)}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="success"
                onClick={() => {
                  setConfirmed(p => [...p, reviewPayment.id])
                  setReviewPayment(null)
                }}
              >
                <CheckCircle size={13} /> Confirm Match — INV #TCL-4744
              </Button>
              <Button variant="secondary" onClick={() => setReviewPayment(null)}>
                Manual Assignment
              </Button>
              <Button variant="danger" onClick={() => setReviewPayment(null)}>
                Return to Sender
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
