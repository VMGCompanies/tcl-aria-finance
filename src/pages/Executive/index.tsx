import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import { AlertTriangle, CheckCircle, Eye, XCircle } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { KPICard } from '../../components/ui/KPICard'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { AIActivityFeed } from '../../components/shared/AIActivityFeed'
import { useAIEngine } from '../../hooks/useAIEngine'
import { formatCurrency } from '../../lib/utils'
import { AR_SUMMARY, AP_SUMMARY } from '../../data'

export function ExecutiveDashboard() {
  const { feed } = useAIEngine()
  const navigate = useNavigate()
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])

  const ALERTS = [
    {
      id: 'alert1',
      type: 'ap' as const,
      title: 'ARIA-AP: Invoice from Graybar Electric ($42,180) — Over PO threshold by $2,180. Early pay discount $843.60 expires TODAY.',
      actions: ['View Details', 'Approve Override', 'Reject & Return'],
      link: '/ap/invoices',
      urgency: 'critical',
    },
    {
      id: 'alert2',
      type: 'ar' as const,
      title: 'ARIA-AR: Client dispute filed — Walgreens Corp (Invoice #TCL-4744, $18,600). Legal review flag active.',
      actions: ['View Details', 'Assign to Controller', 'Dismiss Flag'],
      link: '/ar/invoices',
      urgency: 'high',
    },
    {
      id: 'alert3',
      type: 'ap' as const,
      title: 'ARIA-AP: Metro Electric Sub — COI expired 03/15/26. $28,500 payment withheld. 8 days since renewal request.',
      actions: ['View Details', 'Override & Pay', 'Escalate'],
      link: '/ap/subcontractors',
      urgency: 'high',
    },
  ]

  const visibleAlerts = ALERTS.filter(a => !dismissedAlerts.includes(a.id))

  const agingChartData = AR_SUMMARY.agingByCategory.map(d => ({
    name: d.category,
    'Current': d.current / 100000,
    '31–60': d.d30_60 / 100000,
    '61–90': d.d60_90 / 100000,
    '90+': d.d90plus / 100000,
  }))

  const cashForecastData = [
    { week: 'Apr 4–10', expected: 68500, low: 52000, high: 82000 },
    { week: 'Apr 11–17', expected: 124800, low: 95000, high: 148000 },
    { week: 'Apr 18–24', expected: 89200, low: 71000, high: 108000 },
    { week: 'Apr 25–30', expected: 142000, low: 115000, high: 165000 },
  ]

  const apDueSoon = [
    { date: 'Apr 4', vendor: 'McCann Industries', amount: 1800, method: 'Check', urgency: 'high' },
    { date: 'Apr 7', vendor: 'Illinois Gas & Electric', amount: 2840, method: 'ACH', urgency: 'medium' },
    { date: 'Apr 9', vendor: 'Sunbelt Rentals', amount: 4200, method: 'ACH', urgency: 'medium' },
    { date: 'Apr 10', vendor: 'Graybar Electric (if approved)', amount: 41336, method: 'ACH', urgency: 'critical' },
    { date: 'Apr 11', vendor: 'Metro Electric Sub (COI hold)', amount: 28500, method: 'ACH', urgency: 'blocked' },
    { date: 'Apr 12', vendor: 'Verizon Business', amount: 1240, method: 'ACH', urgency: 'low' },
    { date: 'Apr 14', vendor: 'Apex Lighting Solutions', amount: 14200, method: 'ACH', urgency: 'medium' },
  ]

  return (
    <div className="pb-12 pt-8">
      <PageHeader
        title="Executive Dashboard"
        subtitle="TCL Electrical & Lighting — Finance IQ Platform real-time financial command center"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Export Report</Button>
            <Button variant="primary" size="sm">View AR Pipeline</Button>
          </div>
        }
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KPICard
          label="Total AR Outstanding"
          value={formatCurrency(AR_SUMMARY.totalOutstanding)}
          trend={{ value: '↑ 8.3% vs last month', direction: 'up', isPositive: false }}
          sparkline={AR_SUMMARY.trendWeeks.map(w => w.outstanding / 100000)}
          aiDriven="AI-monitored 24/7"
        />
        <KPICard
          label="Current (0–30 days)"
          value={formatCurrency(AR_SUMMARY.current)}
          trend={{ value: '54.8% of AR', direction: 'flat', isPositive: true }}
          variant="success"
          sparkline={[58, 61, 55, 63, 57, 60, 54, 55].map(v => v * 1000000)}
        />
        <KPICard
          label="Overdue (31–90 days)"
          value={formatCurrency(AR_SUMMARY.overdue31_90)}
          trend={{ value: '↑ 12.1% — AI flagged', direction: 'up', isPositive: false }}
          variant="warning"
          sparkline={[32, 35, 33, 38, 36, 40, 38, 41].map(v => v * 1000000)}
          aiDriven="3 accounts AI-escalated"
        />
        <KPICard
          label="Total AP Outstanding"
          value={formatCurrency(AP_SUMMARY.totalOutstanding)}
          trend={{ value: '↓ 3.2% vs last month', direction: 'down', isPositive: true }}
          sparkline={AP_SUMMARY.trendWeeks.map(w => w.outstanding / 100000)}
        />
        <KPICard
          label="Invoices Processed (Month)"
          value={AR_SUMMARY.invoicesThisMonth.toString()}
          trend={{ value: `${AR_SUMMARY.aiInvoicesThisMonth} by ARIA-AP`, direction: 'up', isPositive: true }}
          aiDriven={`${Math.round(AR_SUMMARY.aiInvoicesThisMonth / AR_SUMMARY.invoicesThisMonth * 100)}% AI-driven`}
        />
        <KPICard
          label="Cash Collected (Week)"
          value={formatCurrency(AR_SUMMARY.cashThisWeek)}
          trend={{ value: '↑ 22.4% vs prior week', direction: 'up', isPositive: true }}
          variant="success"
          sparkline={[62, 71, 58, 80, 74, 88, 77, 94].map(v => v * 100000)}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        {/* AR Aging Chart */}
        <div className="xl:col-span-2">
          <Card padding="default">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-[#0F172A]">AR Aging by Client Category</h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">Balance ($000s) by aging bucket</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/ar/aging')}>View Full Report</Button>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={agingChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={v => `$${v}K`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} width={90} />
                <Tooltip formatter={(v: unknown) => [`$${((v as number) * 1000).toLocaleString()}`, '']} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Current" fill="#16A34A" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="31–60" fill="#D97706" stackId="a" />
                <Bar dataKey="61–90" fill="#DC2626" stackId="a" />
                <Bar dataKey="90+" fill="#7F1D1D" stackId="a" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* AI Activity Feed */}
        <Card padding="none">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#0F172A]">AI Activity Feed</h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">Live ARIA-AR & ARIA-AP actions</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-[#2563EB] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
              Live
            </span>
          </div>
          <AIActivityFeed entries={feed} maxHeight={260} />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        {/* Human Action Required */}
        <div className="xl:col-span-2">
          <Card padding="default">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-[#0F172A] flex items-center gap-2">
                  <AlertTriangle size={16} className="text-yellow-500" />
                  Human Action Required
                  {visibleAlerts.length > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {visibleAlerts.length}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">Items awaiting your decision before ARIA can proceed</p>
              </div>
            </div>
            {visibleAlerts.length === 0 ? (
              <div className="flex items-center gap-2 py-4 text-green-600 text-sm">
                <CheckCircle size={16} />
                All items resolved — no action required
              </div>
            ) : (
              <div className="space-y-3">
                {visibleAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.urgency === 'critical' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              alert.type === 'ap'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {alert.type === 'ap' ? 'ARIA-AP' : 'ARIA-AR'}
                          </span>
                          {alert.urgency === 'critical' && (
                            <span className="text-[10px] font-bold text-red-600 uppercase">Time Sensitive</span>
                          )}
                        </div>
                        <p className="text-sm text-[#0F172A]">{alert.title}</p>
                      </div>
                      <button
                        onClick={() => setDismissedAlerts(prev => [...prev, alert.id])}
                        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                      >
                        <XCircle size={14} />
                      </button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="primary" size="sm" onClick={() => navigate(alert.link)}>
                        <Eye size={11} /> {alert.actions[0]}
                      </Button>
                      <Button variant="success" size="sm">{alert.actions[1]}</Button>
                      <Button variant="ghost" size="sm">{alert.actions[2]}</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* AP Due Soon */}
        <Card padding="default">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-[#0F172A]">AP Due — Next 7 Days</h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">Upcoming payment obligations</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/ap/payments')}>View Queue</Button>
          </div>
          <div className="space-y-2">
            {apDueSoon.map((item, i) => {
              const urgencyColor =
                item.urgency === 'critical'
                  ? 'border-red-500 bg-red-50'
                  : item.urgency === 'high'
                  ? 'border-orange-400 bg-orange-50'
                  : item.urgency === 'medium'
                  ? 'border-blue-300 bg-blue-50'
                  : item.urgency === 'blocked'
                  ? 'border-red-300 bg-red-50 opacity-60'
                  : 'border-gray-200 bg-gray-50'
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between p-2 rounded border-l-4 border ${urgencyColor} text-xs`}
                >
                  <div>
                    <div className="font-medium text-[#0F172A] truncate max-w-[150px]">{item.vendor}</div>
                    <div className="text-[#94A3B8]">
                      {item.date} · {item.method}
                    </div>
                  </div>
                  <div className="font-semibold text-[#0F172A]">{formatCurrency(item.amount * 100)}</div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Cash Flow Forecast */}
      <Card padding="default">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#0F172A]">4-Week Cash Inflow Forecast</h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              ARIA-AR projection based on invoice due dates and historical payment behavior. Confidence: High (87.3%)
            </p>
          </div>
          <div className="text-xs text-[#94A3B8]">
            Expected total: {formatCurrency((68500 + 124800 + 89200 + 142000) * 100)}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={cashForecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip formatter={(v: unknown) => [formatCurrency((v as number) * 100), '']} />
            <Bar dataKey="expected" fill="#1A2E4A" radius={[3, 3, 0, 0]} name="Expected" />
            <Bar dataKey="high" fill="#C5D2E3" radius={[3, 3, 0, 0]} name="High Case" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
