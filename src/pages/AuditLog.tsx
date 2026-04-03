import { useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { DataTable, type Column } from '../components/ui/DataTable'
import { Button } from '../components/ui/Button'
import { AUDIT_LOG } from '../data'
import { CheckCircle, AlertTriangle, RefreshCw, Info, Download } from 'lucide-react'

type AuditEntry = typeof AUDIT_LOG[0]

export function AuditLog() {
  const [filterActor, setFilterActor] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = AUDIT_LOG.filter(e => {
    if (filterActor === 'ARIA-AR' && e.ade !== 'ARIA-AR') return false
    if (filterActor === 'ARIA-AP' && e.ade !== 'ARIA-AP') return false
    if (filterActor === 'Human' && e.ade !== 'Human') return false
    if (
      search &&
      !e.action.toLowerCase().includes(search.toLowerCase()) &&
      !e.entityId?.toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }
    return true
  })

  const STATUS_ICON: Record<string, React.ReactNode> = {
    success: <CheckCircle size={13} className="text-green-500" />,
    warning: <AlertTriangle size={13} className="text-yellow-500" />,
    active: <RefreshCw size={13} className="text-blue-500" />,
    info: <Info size={13} className="text-gray-400" />,
  }

  const ADE_CHIP: Record<string, string> = {
    'ARIA-AR': 'bg-blue-100 text-blue-700',
    'ARIA-AP': 'bg-purple-100 text-purple-700',
    'Human': 'bg-gray-100 text-gray-700',
  }

  const COLUMNS: Column<AuditEntry>[] = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      width: '150px',
      accessor: r => <span className="text-xs font-mono text-[#475569]">{r.timestamp}</span>,
    },
    {
      key: 'ade',
      header: 'Actor',
      width: '120px',
      accessor: r => (
        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full uppercase ${ADE_CHIP[r.ade] || 'bg-gray-100 text-gray-700'}`}>
          {r.actor || r.ade}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      accessor: r => <span className="text-xs font-medium text-[#0F172A]">{r.action}</span>,
    },
    {
      key: 'entity',
      header: 'Entity',
      width: '130px',
      accessor: r => <span className="text-xs text-[#475569]">{r.entity}</span>,
    },
    {
      key: 'entityId',
      header: 'Entity ID',
      width: '130px',
      accessor: r => <span className="text-xs font-mono text-[#94A3B8]">{r.entityId}</span>,
    },
    {
      key: 'details',
      header: 'Details',
      accessor: r => <span className="text-xs text-[#475569] max-w-xs block truncate">{r.details}</span>,
    },
    {
      key: 'status',
      header: '',
      width: '30px',
      accessor: r => STATUS_ICON[r.status] || null,
    },
  ]

  return (
    <div className="pb-12 pt-8">
      <PageHeader
        title="Audit Log"
        subtitle="Tamper-evident record of all ADE and human actions"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm"><Download size={13} /> Export CSV</Button>
            <Button variant="secondary" size="sm"><Download size={13} /> Export PDF</Button>
          </div>
        }
      />

      <div className="flex items-center gap-3 mb-4">
        <div className="flex gap-1">
          {['All', 'ARIA-AR', 'ARIA-AP', 'Human'].map(f => (
            <button
              key={f}
              onClick={() => setFilterActor(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterActor === f
                  ? 'bg-[#1A2E4A] text-white'
                  : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-[#F7F8FA]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search actions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="ml-auto text-sm px-3 py-1.5 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2E4A]/20 w-52"
        />
      </div>

      <DataTable
        columns={COLUMNS}
        data={filtered}
        keyExtractor={r => r.id}
        pageSize={20}
        emptyMessage="No audit log entries found"
      />

      <div className="mt-4 text-xs text-[#94A3B8] flex items-center gap-1">
        <CheckCircle size={11} className="text-green-500" />
        This log is tamper-evident and cryptographically signed. All entries are immutable once recorded.
      </div>
    </div>
  )
}
