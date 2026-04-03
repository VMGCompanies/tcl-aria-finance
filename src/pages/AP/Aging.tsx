import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { formatCurrency } from '../../lib/utils'
import { AP_INVOICES } from '../../data'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'
import { Download } from 'lucide-react'

type AgingRow = {
  vendor: string
  current: number
  d15: number
  d30: number
  d60plus: number
  total: number
}

export function APAging() {
  const aging: AgingRow[] = [
    { vendor: 'Graybar Electric Supply', current: 0, d15: 4218000, d30: 0, d60plus: 0, total: 4218000 },
    { vendor: 'Cooper Electric Inc.', current: 1834000, d15: 0, d30: 0, d60plus: 0, total: 1834000 },
    { vendor: 'Rexel Holdings', current: 987000, d15: 0, d30: 0, d60plus: 0, total: 987000 },
    { vendor: 'WESCO Distribution', current: 2210000, d15: 0, d30: 0, d60plus: 0, total: 2210000 },
    { vendor: 'US Lighting Corp', current: 3160000, d15: 0, d30: 0, d60plus: 0, total: 3160000 },
    { vendor: 'Metro Electric Sub', current: 0, d15: 2850000, d30: 0, d60plus: 0, total: 2850000 },
    { vendor: 'McCann Industries', current: 0, d15: 180000, d30: 0, d60plus: 0, total: 180000 },
    { vendor: 'Illinois Gas & Electric', current: 284000, d15: 0, d30: 0, d60plus: 0, total: 284000 },
  ]

  const grandTotal = aging.reduce((s, r) => s + r.total, 0)

  const chartData = [
    { name: 'Current', value: aging.reduce((s, r) => s + r.current, 0), fill: '#16A34A' },
    { name: '1–15 Days', value: aging.reduce((s, r) => s + r.d15, 0), fill: '#2563EB' },
    { name: '16–30 Days', value: aging.reduce((s, r) => s + r.d30, 0), fill: '#D97706' },
    { name: '31+ Days', value: aging.reduce((s, r) => s + r.d60plus, 0), fill: '#DC2626' },
  ]

  const COLUMNS: Column<AgingRow>[] = [
    {
      key: 'vendor',
      header: 'Vendor',
      sortable: true,
      accessor: r => <span className="text-xs font-medium">{r.vendor}</span>,
    },
    {
      key: 'current',
      header: 'Current',
      accessor: r => <span className="text-xs text-green-600">{r.current > 0 ? formatCurrency(r.current) : '—'}</span>,
    },
    {
      key: 'd15',
      header: '1–15 Days',
      accessor: r => <span className="text-xs text-blue-600">{r.d15 > 0 ? formatCurrency(r.d15) : '—'}</span>,
    },
    {
      key: 'd30',
      header: '16–30 Days',
      accessor: r => <span className="text-xs text-yellow-600">{r.d30 > 0 ? formatCurrency(r.d30) : '—'}</span>,
    },
    {
      key: 'd60plus',
      header: '31+ Days',
      accessor: r => (
        <span className="text-xs font-bold text-red-600">{r.d60plus > 0 ? formatCurrency(r.d60plus) : '—'}</span>
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
        title="AP Aging Report"
        breadcrumb={[{ label: 'AP' }, { label: 'Aging' }]}
        subtitle={`${AP_INVOICES.length} vendor invoices tracked · ARIA-AP current: 91.4%`}
        actions={<Button variant="secondary" size="sm"><Download size={13} /> Export</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {chartData.map(d => (
          <Card key={d.name} padding="sm">
            <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">{d.name}</div>
            <div className="text-xl font-bold" style={{ color: d.fill }}>{formatCurrency(d.value)}</div>
            <div className="text-[11px] text-[#94A3B8]">
              {grandTotal > 0 ? ((d.value / grandTotal) * 100).toFixed(1) : 0}%
            </div>
          </Card>
        ))}
      </div>

      <Card padding="default" className="mb-5">
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} />
            <YAxis
              tick={{ fontSize: 11, fill: '#94A3B8' }}
              tickFormatter={v => `$${((v as number) / 100000).toFixed(0)}K`}
            />
            <Tooltip formatter={(v: unknown) => [formatCurrency(v as number), '']} />
            <Bar dataKey="value" radius={[3, 3, 0, 0]}>
              {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <DataTable columns={COLUMNS} data={aging} keyExtractor={r => r.vendor} />
    </div>
  )
}
