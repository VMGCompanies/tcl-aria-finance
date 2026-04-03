import { Bot, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { formatCurrency } from '../../lib/utils'
import { AR_SUMMARY } from '../../data'

interface AgingRow {
  client: string
  current: number
  d31_60: number
  d61_90: number
  d90plus: number
  total: number
}

export function ARAging() {
  const aging: AgingRow[] = [
    { client: 'Advocate Health', current: 4840000, d31_60: 0, d61_90: 0, d90plus: 0, total: 4840000 },
    { client: 'Walmart Distribution', current: 2215000, d31_60: 0, d61_90: 0, d90plus: 0, total: 2215000 },
    { client: 'City of Elgin', current: 2845000, d31_60: 0, d61_90: 0, d90plus: 0, total: 2845000 },
    { client: 'Walgreens Corp', current: 0, d31_60: 1860000, d61_90: 0, d90plus: 0, total: 1860000 },
    { client: 'Loyola University', current: 0, d31_60: 920000, d61_90: 0, d90plus: 0, total: 920000 },
    {
      client: "Hilton Hotels — O'Hare",
      current: 0,
      d31_60: 3390000,
      d61_90: 0,
      d90plus: 0,
      total: 3390000,
    },
    {
      client: 'Village of Schaumburg',
      current: 0,
      d31_60: 0,
      d61_90: 3120000,
      d90plus: 0,
      total: 3120000,
    },
    {
      client: 'Northwestern Medicine',
      current: 0,
      d31_60: 0,
      d61_90: 4475000,
      d90plus: 0,
      total: 4475000,
    },
  ]

  const bucketTotals = {
    current: aging.reduce((s, r) => s + r.current, 0),
    d31_60: aging.reduce((s, r) => s + r.d31_60, 0),
    d61_90: aging.reduce((s, r) => s + r.d61_90, 0),
    d90plus: aging.reduce((s, r) => s + r.d90plus, 0),
  }
  const grandTotal = Object.values(bucketTotals).reduce((a, b) => a + b, 0)

  const chartData = [
    { name: 'Current (0–30)', value: bucketTotals.current, fill: '#16A34A' },
    { name: '31–60 Days', value: bucketTotals.d31_60, fill: '#D97706' },
    { name: '61–90 Days', value: bucketTotals.d61_90, fill: '#DC2626' },
    { name: '90+ Days', value: bucketTotals.d90plus, fill: '#7F1D1D' },
  ]

  const COLUMNS: Column<AgingRow>[] = [
    {
      key: 'client',
      header: 'Client',
      sortable: true,
      accessor: r => <span className="text-xs font-medium">{r.client}</span>,
    },
    {
      key: 'current',
      header: 'Current',
      sortable: true,
      accessor: r => (
        <span className="text-xs text-green-600">{r.current > 0 ? formatCurrency(r.current) : '—'}</span>
      ),
    },
    {
      key: 'd31_60',
      header: '31–60 Days',
      sortable: true,
      accessor: r => (
        <span className="text-xs text-yellow-600">
          {r.d31_60 > 0 ? formatCurrency(r.d31_60) : '—'}
        </span>
      ),
    },
    {
      key: 'd61_90',
      header: '61–90 Days',
      sortable: true,
      accessor: r => (
        <span className="text-xs text-red-600">{r.d61_90 > 0 ? formatCurrency(r.d61_90) : '—'}</span>
      ),
    },
    {
      key: 'd90plus',
      header: '90+ Days',
      accessor: r => (
        <span className="text-xs font-bold text-red-800">
          {r.d90plus > 0 ? formatCurrency(r.d90plus) : '—'}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      accessor: r => <span className="text-xs font-bold">{formatCurrency(r.total)}</span>,
    },
  ]

  return (
    <div className="pb-12 pt-8">
      <PageHeader
        title="AR Aging Report"
        breadcrumb={[{ label: 'AR' }, { label: 'Aging' }]}
        subtitle={`Current DSO: ${AR_SUMMARY.dso} days · ARIA-AR analysis updated today 9:00 AM`}
        actions={
          <Button variant="secondary" size="sm">
            <Download size={13} /> Export to Excel
          </Button>
        }
      />

      {/* ARIA Commentary */}
      <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Bot size={16} className="text-blue-600" />
          <span className="text-sm font-semibold text-blue-700">ARIA-AR Aging Analysis</span>
        </div>
        <p className="text-sm text-[#475569]">
          Current DSO is <strong>31.4 days</strong> — 4.2 days better than prior quarter. Village of
          Schaumburg and Northwestern Medicine account for{' '}
          <strong>71% of the 61–90 day bucket</strong> ({formatCurrency(bucketTotals.d61_90)}). City of
          Elgin is 3 days overdue but falls within their normal municipal payment cycle (avg 38 days).{' '}
          <strong>Recommend escalating:</strong> City of Elgin (Day 3), Village of Schaumburg (Day 47 —
          credit hold), Loyola University (Day 22).
        </p>
      </div>

      {/* Bucket Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {chartData.map(d => (
          <Card key={d.name} padding="sm">
            <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">{d.name}</div>
            <div className="text-xl font-bold" style={{ color: d.fill }}>
              {formatCurrency(d.value)}
            </div>
            <div className="text-[11px] text-[#94A3B8]">
              {grandTotal > 0 ? ((d.value / grandTotal) * 100).toFixed(1) : 0}% of total AR
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <Card padding="default">
          <h3 className="font-semibold text-[#0F172A] mb-3 text-sm">Aging Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                tickFormatter={v => `$${(v / 100000).toFixed(0)}K`}
              />
              <Tooltip formatter={(v: unknown) => [formatCurrency(v as number), '']} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card padding="default">
          <h3 className="font-semibold text-[#0F172A] mb-3 text-sm">Aging Summary</h3>
          <div className="space-y-2">
            {chartData.map(d => (
              <div key={d.name} className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: d.fill }}
                />
                <span className="text-xs text-[#475569] flex-1">{d.name}</span>
                <span className="text-xs font-semibold" style={{ color: d.fill }}>
                  {formatCurrency(d.value)}
                </span>
                <span className="text-[10px] text-[#94A3B8] w-10 text-right">
                  {grandTotal > 0 ? ((d.value / grandTotal) * 100).toFixed(1) : 0}%
                </span>
              </div>
            ))}
            <div className="border-t border-[#E2E8F0] pt-2 flex justify-between">
              <span className="text-xs font-bold text-[#0F172A]">Total Outstanding</span>
              <span className="text-xs font-bold text-[#0F172A]">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </Card>
      </div>

      <DataTable
        columns={COLUMNS}
        data={aging}
        keyExtractor={r => r.client}
        emptyMessage="No aging data"
      />
    </div>
  )
}
