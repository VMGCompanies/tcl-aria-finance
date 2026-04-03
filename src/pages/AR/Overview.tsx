import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { KPICard } from '../../components/ui/KPICard'
import { ADEControlPanel } from '../../components/shared/ADEControlPanel'
import { AIActivityFeed } from '../../components/shared/AIActivityFeed'
import { useApp } from '../../context/AppContext'
import { useAIEngine } from '../../hooks/useAIEngine'
import { AR_SUMMARY } from '../../data'
import { formatCurrency, formatPercent } from '../../lib/utils'

export function AROverview() {
  const { arRunning, setARRunning } = useApp()
  const { feed } = useAIEngine()
  const navigate = useNavigate()
  const arFeed = feed.filter(e => e.ade === 'ARIA-AR')

  return (
    <div className="pb-12 pt-8">
      <PageHeader
        title="ARIA-AR Overview"
        breadcrumb={[{ label: 'AR — Accounts Receivable' }]}
        subtitle="Autonomous AR Digital Employee — Invoice-to-Cash Operations"
      />

      {/* ADE Description */}
      <Card className="mb-4 border-l-4 border-l-[#2563EB]" padding="default">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 font-bold text-sm">AR</span>
          </div>
          <div>
            <h3 className="font-semibold text-[#0F172A] mb-1">About ARIA-AR</h3>
            <p className="text-sm text-[#475569] leading-relaxed mb-2">
              <strong>ARIA-AR</strong> is TCL Electrical & Lighting's fully autonomous Accounts Receivable Digital
              Employee, deployed by Neuralogic Group. ARIA-AR owns the complete invoice-to-cash cycle: generating
              invoices from completed work orders, delivering them to clients via the appropriate channel, executing
              multi-stage collection sequences, reconciling incoming payments, managing retainage schedules, processing
              lien waivers, and producing aging and cash flow analytics — all without human intervention except at
              defined approval gates.
            </p>
            <p className="text-xs text-[#94A3B8]">
              Replaces the equivalent workload of <strong>2.5 full-time AR staff</strong> · Operates 24/7/365 · Zero
              processing lag
            </p>
          </div>
        </div>
      </Card>

      {/* ADE Control Panel */}
      <div className="mb-4">
        <ADEControlPanel
          adeName="ARIA-AR"
          running={arRunning}
          onPause={() => setARRunning(false)}
          onResume={() => setARRunning(true)}
          stats={[
            { label: 'Invoices Sent', value: 12 },
            { label: 'Payments Matched', value: 8 },
            { label: 'Collection Touches', value: 34 },
            { label: 'Exceptions', value: 2 },
          ]}
          lastAction="Invoice #TCL-4836 delivered to Advocate Health — 4:03 PM"
          nextAction="Invoice delivery to Advocate Health — Invoice #TCL-4836 at 3:00 PM"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <KPICard
          label="Avg Days to Payment"
          value={`${AR_SUMMARY.dso} days`}
          trend={{ value: '↓ 4.2 days vs Q3', direction: 'down', isPositive: true }}
          variant="success"
        />
        <KPICard
          label="First-Touch Collection"
          value={formatPercent(AR_SUMMARY.firstTouchRate)}
          trend={{ value: 'Industry avg: 64%', direction: 'up', isPositive: true }}
        />
        <KPICard
          label="Invoice Accuracy"
          value={formatPercent(AR_SUMMARY.invoiceAccuracyRate)}
          trend={{ value: 'vs 94.2% manual', direction: 'up', isPositive: true }}
          variant="success"
        />
        <KPICard
          label="Disputed Invoice Rate"
          value={formatPercent(AR_SUMMARY.disputeRate)}
          trend={{ value: 'vs 3.8% industry', direction: 'down', isPositive: true }}
          variant="success"
        />
        <KPICard
          label="Cash Collected YTD"
          value={formatCurrency(AR_SUMMARY.cashYTD)}
          trend={{ value: '↑ 18.4% YoY', direction: 'up', isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Live AR feed */}
        <Card padding="none">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="font-semibold text-[#0F172A]">ARIA-AR Activity</h3>
            <span className="flex items-center gap-1.5 text-xs text-[#2563EB]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
              Live
            </span>
          </div>
          <AIActivityFeed entries={arFeed.length > 0 ? arFeed : feed.slice(0, 8)} maxHeight={320} />
        </Card>

        {/* Quick navigation */}
        <div className="space-y-3">
          {[
            {
              label: 'Invoices',
              desc: `${formatCurrency(AR_SUMMARY.totalOutstanding)} outstanding`,
              path: '/ar/invoices',
              badge: '20+ active',
            },
            {
              label: 'Collections',
              desc: '6 accounts in active sequence',
              path: '/ar/collections',
              badge: '3 overdue',
            },
            {
              label: 'Payment Reconciliation',
              desc: '4 payments pending match',
              path: '/ar/reconciliation',
              badge: '1 exception',
            },
            {
              label: 'Retainage & Lien Waivers',
              desc: '$45,010 tracked retainage',
              path: '/ar/retainage',
              badge: '1 imminent release',
            },
            {
              label: 'AR Aging Report',
              desc: `DSO: ${AR_SUMMARY.dso} days`,
              path: '/ar/aging',
              badge: 'Updated today',
            },
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
