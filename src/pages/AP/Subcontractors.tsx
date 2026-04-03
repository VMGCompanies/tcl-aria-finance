import { useState } from 'react'
import { PageHeader } from '../../components/ui/PageHeader'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Card } from '../../components/ui/Card'
import { SUBCONTRACTORS } from '../../data'
import type { Subcontractor } from '../../types/ap.types'
import { CheckCircle, XCircle, AlertTriangle, Plus, Upload } from 'lucide-react'
import { formatDate } from '../../lib/utils'

export function APSubcontractors() {
  const [selected, setSelected] = useState<Subcontractor | null>(null)
  const [onboarding, setOnboarding] = useState(false)

  const COLUMNS: Column<Subcontractor>[] = [
    {
      key: 'name',
      header: 'Subcontractor',
      sortable: true,
      accessor: r => (
        <div>
          <div className="font-medium text-[#0F172A] text-xs">{r.name}</div>
          <div className="text-[11px] text-[#94A3B8]">{r.specialty}</div>
        </div>
      ),
    },
    {
      key: 'activeProjects',
      header: 'Active Projects',
      accessor: r => <span className="text-xs">{r.activeProjects}</span>,
    },
    {
      key: 'w9Status',
      header: 'W-9',
      accessor: r => (
        r.w9Status === 'on-file'
          ? <CheckCircle size={14} className="text-green-500" />
          : <XCircle size={14} className="text-red-500" />
      ),
    },
    {
      key: 'coiStatus',
      header: 'COI',
      accessor: r => (
        r.coiStatus === 'valid'
          ? <CheckCircle size={14} className="text-green-500" />
          : r.coiStatus === 'expiring-soon'
          ? <AlertTriangle size={14} className="text-yellow-500" />
          : <XCircle size={14} className="text-red-500" />
      ),
    },
    {
      key: 'coiExpiry',
      header: 'COI Expiry',
      accessor: r => (
        <span className={`text-xs ${
          r.coiStatus === 'expired'
            ? 'text-red-600 font-bold'
            : r.coiStatus === 'expiring-soon'
            ? 'text-yellow-600'
            : 'text-[#475569]'
        }`}>
          {formatDate(r.coiExpiry)}
        </span>
      ),
    },
    {
      key: 'lienWaiverStatus',
      header: 'Lien Waiver',
      accessor: r => (
        r.lienWaiverStatus === 'received'
          ? <CheckCircle size={14} className="text-green-500" />
          : r.lienWaiverStatus === 'pending'
          ? <AlertTriangle size={14} className="text-yellow-500" />
          : <span className="text-xs text-[#94A3B8]">N/A</span>
      ),
    },
    {
      key: 'complianceStatus',
      header: 'Compliance',
      accessor: r => (
        <StatusBadge
          status={
            r.complianceStatus === 'Compliant'
              ? 'Compliant'
              : r.complianceStatus === 'Non-Compliant'
              ? 'Non-Compliant'
              : 'Pending'
          }
          size="sm"
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      accessor: r => (
        <Button variant="ghost" size="sm" onClick={e => { e?.stopPropagation(); setSelected(r) }}>
          Details
        </Button>
      ),
    },
  ]

  return (
    <div className="pb-12 pt-8">
      <PageHeader
        title="Subcontractor Management"
        breadcrumb={[{ label: 'AP' }, { label: 'Subcontractors' }]}
        subtitle="ARIA-AP tracking compliance, COI, W-9, and lien waivers for all active subcontractors"
        actions={
          <Button variant="primary" size="sm" onClick={() => setOnboarding(true)}>
            <Plus size={13} /> Add Subcontractor
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-5">
        <Card padding="sm" className="border-green-200 bg-green-50/30">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Compliant</div>
          <div className="text-2xl font-bold text-green-600">
            {SUBCONTRACTORS.filter(s => s.complianceStatus === 'Compliant').length}
          </div>
        </Card>
        <Card padding="sm" className="border-red-200 bg-red-50/30">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Non-Compliant</div>
          <div className="text-2xl font-bold text-red-600">
            {SUBCONTRACTORS.filter(s => s.complianceStatus === 'Non-Compliant').length}
          </div>
          <div className="text-xs text-[#94A3B8]">Payments held</div>
        </Card>
        <Card padding="sm" className="border-yellow-200 bg-yellow-50/30">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Expiring Soon</div>
          <div className="text-2xl font-bold text-yellow-600">
            {SUBCONTRACTORS.filter(s => s.complianceStatus === 'Expiring Soon').length}
          </div>
          <div className="text-xs text-[#94A3B8]">Action needed</div>
        </Card>
      </div>

      <DataTable
        columns={COLUMNS}
        data={SUBCONTRACTORS}
        keyExtractor={r => r.id}
        onRowClick={setSelected}
        rowClassName={r =>
          r.complianceStatus === 'Non-Compliant'
            ? 'bg-red-50/30'
            : r.complianceStatus === 'Expiring Soon'
            ? 'bg-yellow-50/30'
            : ''
        }
      />

      {selected && (
        <Modal open onClose={() => setSelected(null)} title={selected.name} subtitle={selected.specialty} size="md">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-[#94A3B8] uppercase tracking-wider text-[10px] mb-1">Contact</div>
                <div className="font-medium">{selected.contact}</div>
                <div className="text-[#475569]">{selected.phone}</div>
                <div className="text-[#2563EB]">{selected.email}</div>
              </div>
              <div>
                <div className="text-[#94A3B8] uppercase tracking-wider text-[10px] mb-1">Tax Info</div>
                <div className="text-[#475569]">EIN: {selected.ein}</div>
                <div className="text-[#475569]">1099: {selected.is1099 ? 'Yes' : 'No'}</div>
                <div className="text-[#475569]">Insurance: {selected.insurance}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: 'W-9 Status',
                  ok: selected.w9Status === 'on-file',
                  text: selected.w9Status === 'on-file' ? 'On File ✓' : 'Missing ✗',
                },
                {
                  label: 'COI Status',
                  ok: selected.coiStatus === 'valid',
                  text:
                    selected.coiStatus === 'valid'
                      ? `Valid until ${formatDate(selected.coiExpiry)}`
                      : `EXPIRED ${formatDate(selected.coiExpiry)}`,
                },
                {
                  label: 'Lien Waiver',
                  ok: selected.lienWaiverStatus === 'received',
                  text: selected.lienWaiverStatus === 'received' ? 'Received ✓' : 'Pending',
                },
              ].map(item => (
                <div
                  key={item.label}
                  className={`p-2.5 rounded-lg border text-xs ${item.ok ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                >
                  <div className={`font-semibold mb-0.5 ${item.ok ? 'text-green-700' : 'text-red-700'}`}>{item.label}</div>
                  <div className={item.ok ? 'text-green-600' : 'text-red-600'}>{item.text}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" size="sm"><Upload size={12} /> Upload New COI</Button>
              <Button variant="secondary" size="sm"><Upload size={12} /> Upload W-9</Button>
              {selected.complianceStatus === 'Non-Compliant' && (
                <Button variant="danger" size="sm">Override &amp; Release Payment</Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Onboarding Modal */}
      <Modal
        open={onboarding}
        onClose={() => setOnboarding(false)}
        title="Add Subcontractor"
        subtitle="ARIA-AP will validate documents on upload"
        size="md"
      >
        <div className="space-y-3">
          {[
            { label: 'Company Name', type: 'text', placeholder: 'Metro Electric Sub LLC' },
            { label: 'EIN', type: 'text', placeholder: 'XX-XXXXXXX' },
            { label: 'Primary Contact', type: 'text', placeholder: 'Full name' },
            { label: 'Contact Email', type: 'email', placeholder: 'contact@company.com' },
            { label: 'Contact Phone', type: 'tel', placeholder: '(xxx) xxx-xxxx' },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs font-medium text-[#475569] block mb-1">{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2E4A]/20"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#475569] block mb-1">W-9 Upload</label>
              <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-3 text-center text-xs text-[#94A3B8] cursor-pointer hover:bg-[#F7F8FA]">
                <Upload size={16} className="mx-auto mb-1" />
                Click to upload
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#475569] block mb-1">COI Upload</label>
              <div className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-3 text-center text-xs text-[#94A3B8] cursor-pointer hover:bg-[#F7F8FA]">
                <Upload size={16} className="mx-auto mb-1" />
                Click to upload
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary">Add Subcontractor</Button>
            <Button variant="secondary" onClick={() => setOnboarding(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
