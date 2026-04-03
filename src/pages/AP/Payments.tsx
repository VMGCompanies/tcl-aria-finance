import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { formatCurrency } from '../../lib/utils'
import { PAYMENT_QUEUE } from '../../data'
import type { PaymentQueueItem } from '../../types/ap.types'
import { CheckCircle, CreditCard, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export function APPayments() {
  const [items, setItems] = useState<PaymentQueueItem[]>(PAYMENT_QUEUE)
  const [showConfirm, setShowConfirm] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [executed, setExecuted] = useState(false)
  const [executionLog, setExecutionLog] = useState<string[]>([])

  const selected = items.filter(i => i.selected)
  const total = selected.reduce((sum, i) => sum + i.netPayment, 0)

  const toggleItem = (id: string) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, selected: !i.selected } : i))

  const executePaymentRun = async () => {
    setShowConfirm(false)
    setExecuting(true)
    setExecutionLog([])
    for (const item of selected) {
      await new Promise(r => setTimeout(r, 1200))
      setExecutionLog(prev => [
        ...prev,
        `✅ ${item.vendorName} — ${formatCurrency(item.netPayment)} via ${item.method} — Ref: ACH${Math.floor(Math.random() * 9000000 + 1000000)}`,
      ])
    }
    await new Promise(r => setTimeout(r, 800))
    setExecuting(false)
    setExecuted(true)
  }

  return (
    <div className="pb-12 pt-8">
      <PageHeader
        title="Payment Queue"
        breadcrumb={[{ label: 'AP' }, { label: 'Payment Queue' }]}
        subtitle="Today's 5:00 PM payment run · ARIA-AP will execute after your approval"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Modify Run</Button>
            <Button variant="secondary" size="sm">Add Invoice</Button>
            <Button
              variant="orange"
              size="sm"
              onClick={() => setShowConfirm(true)}
              disabled={selected.length === 0 || executed}
            >
              <CreditCard size={13} />
              {executed ? 'Run Executed ✓' : `Approve & Execute — ${formatCurrency(total)}`}
            </Button>
          </div>
        }
      />

      {executing && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3 text-blue-700 font-semibold text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            ARIA-AP executing payment run…
          </div>
          <div className="space-y-1.5">
            {executionLog.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-[#475569] font-mono"
              >
                {log}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {executed && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <div className="font-semibold text-green-700">Payment run complete</div>
            <div className="text-sm text-[#475569]">
              {selected.length} vendors paid · {formatCurrency(total)} total · All ACH confirmations received
            </div>
          </div>
        </div>
      )}

      <Card padding="none">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[#0F172A]">Scheduled Payment Run — Today 5:00 PM</h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              {selected.length} payments selected · {formatCurrency(total)} total
            </p>
          </div>
          <div className="text-sm font-semibold text-[#1A2E4A]">{formatCurrency(total)}</div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[#F7F8FA]">
            <tr>
              {['', 'Vendor', 'Invoice #', 'Amount', 'Discount', 'Net Payment', 'Method', 'Priority'].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {items.map(item => (
              <tr key={item.id} className={`hover:bg-[#F8FAFC] ${!item.selected ? 'opacity-50' : ''}`}>
                <td className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleItem(item.id)}
                    className="rounded border-[#E2E8F0]"
                  />
                </td>
                <td className="px-3 py-2.5 font-medium text-xs">{item.vendorName}</td>
                <td className="px-3 py-2.5 font-mono text-xs text-[#475569]">{item.invoiceNumber}</td>
                <td className="px-3 py-2.5 text-xs">{formatCurrency(item.amount)}</td>
                <td className="px-3 py-2.5 text-xs text-green-600">
                  {item.discount > 0 ? `-${formatCurrency(item.discount)}` : '—'}
                </td>
                <td className="px-3 py-2.5 font-semibold text-xs">{formatCurrency(item.netPayment)}</td>
                <td className="px-3 py-2.5 text-xs text-[#475569]">{item.method}</td>
                <td className="px-3 py-2.5">
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                    item.priority === 'Urgent' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#F7F8FA] border-t-2 border-[#E2E8F0]">
            <tr>
              <td colSpan={5} className="px-3 py-2.5 font-bold text-[#0F172A] text-right">Total</td>
              <td className="px-3 py-2.5 font-bold text-[#0F172A]">{formatCurrency(total)}</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </Card>

      <Modal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Approve Payment Run"
        size="sm"
        footer={
          <div className="flex gap-2">
            <Button variant="orange" onClick={executePaymentRun}>
              <CreditCard size={13} /> Execute {formatCurrency(total)}
            </Button>
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>Cancel</Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-[#475569]">
              You are about to authorize ARIA-AP to execute{' '}
              <strong>{selected.length} payments</strong> totaling{' '}
              <strong>{formatCurrency(total)}</strong>. This action cannot be undone.
            </p>
          </div>
          <div className="bg-[#F7F8FA] rounded-lg p-3 space-y-1 text-xs">
            {selected.map(i => (
              <div key={i.id} className="flex justify-between">
                <span className="text-[#475569]">{i.vendorName}</span>
                <span className="font-medium">{formatCurrency(i.netPayment)} · {i.method}</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}
