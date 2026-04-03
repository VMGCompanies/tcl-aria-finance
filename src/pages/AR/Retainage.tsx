import { FileCheck } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { formatCurrency, formatDate } from '../../lib/utils'
import type { RetainageRecord } from '../../types/ar.types'

export function ARRetainage() {
  const retainage: RetainageRecord[] = [
    {
      projectId: 'proj-8',
      projectName: 'Naperville Phase 2',
      clientName: 'Allied Construction',
      contractValue: 22500000,
      retainagePct: 10,
      heldAmount: 2250000,
      eligibleDate: '2026-05-15',
      status: 'Pending Release',
    },
    {
      projectId: 'proj-10',
      projectName: 'Northwestern OR Suite',
      clientName: 'Northwestern Medicine',
      contractValue: 17900000,
      retainagePct: 5,
      heldAmount: 895000,
      eligibleDate: '2026-06-01',
      status: 'Pending Release',
    },
    {
      projectId: 'proj-7',
      projectName: "Hilton O'Hare Ballroom",
      clientName: 'Hilton Hotels',
      contractValue: 13560000,
      retainagePct: 10,
      heldAmount: 1356000,
      eligibleDate: '2026-04-30',
      status: 'Release Imminent',
    },
  ]

  const lienWaivers = [
    {
      id: 'lw-1',
      project: 'Naperville Phase 2',
      client: 'Allied Construction',
      type: 'Unconditional',
      amount: 11250000,
      sentDate: '02/26/26',
      status: 'Signed',
    },
    {
      id: 'lw-2',
      project: "Hilton O'Hare Ballroom",
      client: 'Hilton Hotels',
      type: 'Conditional',
      amount: 6780000,
      sentDate: '03/01/26',
      status: 'Pending',
    },
    {
      id: 'lw-3',
      project: 'Northwestern OR Suite',
      client: 'Northwestern Medicine',
      type: 'Conditional',
      amount: 8950000,
      sentDate: '03/15/26',
      status: 'Pending',
    },
  ]

  const COLUMNS: Column<RetainageRecord>[] = [
    {
      key: 'projectName',
      header: 'Project',
      accessor: r => <span className="text-xs font-medium text-[#0F172A]">{r.projectName}</span>,
    },
    {
      key: 'clientName',
      header: 'Client',
      accessor: r => <span className="text-xs text-[#475569]">{r.clientName}</span>,
    },
    {
      key: 'contractValue',
      header: 'Contract Value',
      accessor: r => <span className="text-xs">{formatCurrency(r.contractValue)}</span>,
    },
    {
      key: 'retainagePct',
      header: 'Retainage %',
      accessor: r => <span className="text-xs">{r.retainagePct}%</span>,
    },
    {
      key: 'heldAmount',
      header: 'Held Amount',
      sortable: true,
      accessor: r => (
        <span className="text-xs font-semibold text-[#0F172A]">{formatCurrency(r.heldAmount)}</span>
      ),
    },
    {
      key: 'eligibleDate',
      header: 'Eligible Release',
      accessor: r => <span className="text-xs text-[#475569]">{formatDate(r.eligibleDate)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: r => (
        <StatusBadge
          status={
            r.status === 'Pending Release' ? 'Pending' : r.status === 'Release Imminent' ? 'Active' : 'Paid'
          }
          size="sm"
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      accessor: r =>
        r.status === 'Release Imminent' ? (
          <Button variant="primary" size="sm" onClick={e => e?.stopPropagation()}>
            Release Retainage
          </Button>
        ) : (
          <Button variant="secondary" size="sm">
            View
          </Button>
        ),
    },
  ]

  return (
    <div className="pb-12 pt-8">
      <PageHeader
        title="Retainage & Lien Waivers"
        breadcrumb={[{ label: 'AR' }, { label: 'Retainage' }]}
        subtitle="ARIA-AR tracking retainage schedules and lien waiver compliance"
        actions={
          <Button variant="primary" size="sm">
            <FileCheck size={13} /> Generate Lien Waiver
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <Card padding="sm">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">
            Total Retainage Held
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(retainage.reduce((s, r) => s + r.heldAmount, 0))}
          </div>
        </Card>
        <Card padding="sm" className="border-yellow-200 bg-yellow-50/30">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">
            Release Imminent
          </div>
          <div className="text-2xl font-bold text-yellow-600">
            {formatCurrency(
              retainage
                .filter(r => r.status === 'Release Imminent')
                .reduce((s, r) => s + r.heldAmount, 0)
            )}
          </div>
          <div className="text-xs text-[#94A3B8]">Hilton Hotels — due Apr 30</div>
        </Card>
        <Card padding="sm">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Lien Waivers</div>
          <div className="text-2xl font-bold text-[#0F172A]">{lienWaivers.length} active</div>
          <div className="text-xs text-[#94A3B8]">
            {lienWaivers.filter(l => l.status === 'Pending').length} awaiting signature
          </div>
        </Card>
      </div>

      <h2 className="text-base font-semibold text-[#0F172A] mb-3">Retainage Schedule</h2>
      <DataTable columns={COLUMNS} data={retainage} keyExtractor={r => r.projectId} />

      <h2 className="text-base font-semibold text-[#0F172A] mb-3 mt-6">Lien Waiver Tracker</h2>
      <div className="border border-[#E2E8F0] rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-[#F7F8FA]">
            <tr>
              {['Project', 'Client', 'Type', 'Amount', 'Sent', 'Status', ''].map(h => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {lienWaivers.map(lw => (
              <tr key={lw.id} className="hover:bg-[#F8FAFC]">
                <td className="px-3 py-2.5">{lw.project}</td>
                <td className="px-3 py-2.5 text-[#475569]">{lw.client}</td>
                <td className="px-3 py-2.5">{lw.type}</td>
                <td className="px-3 py-2.5 font-medium">{formatCurrency(lw.amount)}</td>
                <td className="px-3 py-2.5 text-[#94A3B8]">{lw.sentDate}</td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={lw.status === 'Signed' ? 'Paid' : 'Pending'} size="sm" />
                </td>
                <td className="px-3 py-2.5">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
