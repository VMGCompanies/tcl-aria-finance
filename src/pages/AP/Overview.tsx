import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { KPICard } from '../../components/ui/KPICard'
import { ADEControlPanel } from '../../components/shared/ADEControlPanel'
import { AIActivityFeed } from '../../components/shared/AIActivityFeed'
import { useApp } from '../../context/AppContext'
import { useAIEngine } from '../../hooks/useAIEngine'
import { AP_SUMMARY } from '../../data'
import { formatCurrency, formatPercent } from '../../lib/utils'

export function APOverview() {
  const { apRunning, setAPRunning } = useApp()
  const { feed } = useAIEngine()
  const navigate = useNavigate()
  const apFeed = feed.filter(e => e.ade === 'ARIA-AP')

  return (
    <div className="pb-12 pt-8">
      <PageHeader
        title="ARIA-AP Overview"
        breadcrumb={[{ label: 'AP — Accounts Payable' }]}
        subtitle="Autonomous AP Digital Employee — Procure-to-Pay Operations"
      />

      <Card className="mb-4 border-l-4 border-l-purple-500" padding="default">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-600 font-bold text-sm">AP</span>
          </div>
          <div>
            <h3 className="font-semibold text-[#0F172A] mb-1">About ARIA-AP</h3>
            <p className="text-sm text-[#475569] leading-relaxed mb-2">
              <strong>ARIA-AP</strong> is TCL Electrical &amp; Lighting's fully autonomous Accounts Payable Digital Employee.
              ARIA-AP owns the complete procure-to-pay cycle: receiving and extracting vendor invoices (email, portal, PDF, EDI),
              matching invoices to purchase orders and receiving documents, validating amounts and quantities, flagging discrepancies,
              routing exceptions for human approval, scheduling and executing payments, managing vendor relationships and payment terms,
              and maintaining a complete audit trail.
            </p>
            <p className="text-xs text-[#94A3B8]">
              Replaces <strong>1.5 full-time AP staff</strong> · 3-way match accuracy: 97.4% · Processes invoices in avg 4.2 minutes
            </p>
          </div>
        </div>
      </Card>

      <div className="mb-4">
        <ADEControlPanel
          adeName="ARIA-AP"
          running={apRunning}
          onPause={() => setAPRunning(false)}
          onResume={() => setAPRunning(true)}
          stats={[
            { label: 'Invoices Received', value: AP_SUMMARY.invoicesReceivedToday },
            { label: 'Auto-Approved', value: AP_SUMMARY.autoApprovedToday },
            { label: 'Exceptions Flagged', value: AP_SUMMARY.exceptionsToday },
            { label: 'Payments Scheduled', value: formatCurrency(AP_SUMMARY.paymentsScheduledToday) },
          ]}
          lastAction="Invoice GB-2026-8847 exception alert dispatched to Controller — 7:16 AM"
          nextAction="Payment run execution — Today 5:00 PM · 6 vendors · $69,450"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <KPICard
          label="Avg Processing Time"
          value={`${AP_SUMMARY.avgProcessingMinutes} min`}
          trend={{ value: 'vs 2.3 hrs manual', direction: 'down', isPositive: true }}
          variant="success"
        />
        <KPICard
          label="3-Way Match Rate"
          value={formatPercent(AP_SUMMARY.threeWayMatchRate)}
          trend={{ value: 'Industry avg: 71%', direction: 'up', isPositive: true }}
        />
        <KPICard
          label="Duplicate Detection"
          value={`${AP_SUMMARY.duplicateDetectionRate}%`}
          trend={{ value: 'All-time perfect', direction: 'flat', isPositive: true }}
          variant="success"
        />
        <KPICard
          label="Early Pay Discounts YTD"
          value={formatCurrency(AP_SUMMARY.earlyPayDiscountYTD)}
          trend={{ value: '↑ 31% vs prior year', direction: 'up', isPositive: true }}
        />
        <KPICard
          label="AP Current %"
          value={formatPercent(AP_SUMMARY.apAgingCurrentPct)}
          trend={{ value: '91.4% within terms', direction: 'up', isPositive: true }}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card padding="none">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="font-semibold text-[#0F172A]">ARIA-AP Activity</h3>
            <span className="flex items-center gap-1.5 text-xs text-purple-600">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              Live
            </span>
          </div>
          <AIActivityFeed entries={apFeed.length > 0 ? apFeed : feed.slice(0, 8)} maxHeight={320} />
        </Card>

        <div className="space-y-3">
          {[
            { label: 'Vendor Invoices', desc: `${AP_SUMMARY.exceptionsToday} exceptions pending`, path: '/ap/invoices', badge: `${AP_SUMMARY.invoicesReceivedToday} received today` },
            { label: 'Purchase Orders', desc: '14 open POs', path: '/ap/purchase-orders', badge: '3 pending receipt' },
            { label: 'Payment Queue', desc: formatCurrency(AP_SUMMARY.paymentsScheduledToday) + ' scheduled today', path: '/ap/payments', badge: 'Run at 5:00 PM' },
            { label: 'Subcontractor Mgmt', desc: '5 active subs · 1 non-compliant', path: '/ap/subcontractors', badge: '⚠️ COI expired' },
            { label: 'AP Aging Report', desc: `${AP_SUMMARY.apAgingCurrentPct}% current`, path: '/ap/aging', badge: 'Updated today' },
          ].map(item => (
            <Card key={item.path} hover padding="default" onClick={() => navigate(item.path)}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[#0F172A]">{item.label}</div>
                  <div className="text-xs text-[#94A3B8] mt-0.5">{item.desc}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] bg-[#F7F8FA] border border-[#E2E8F0] text-[#475569] px-2 py-1 rounded">
                    {item.badge}
                  </span>
                  <span className="text-[#94A3B8]">›</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
