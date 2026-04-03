import { useState } from 'react'
import { AlertCircle, Phone, Mail, UserCheck, PauseCircle, TrendingUp, Bot } from 'lucide-react'
import { PageHeader } from '../../components/ui/PageHeader'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Card } from '../../components/ui/Card'
import { formatCurrency } from '../../lib/utils'

interface CollectionAccount {
  clientId: string
  clientName: string
  contactName: string
  contactPhone: string
  contactEmail: string
  invoiceCount: number
  totalBalance: number
  daysOverdue: number
  collectionStage: string
  lastTouch: string
  nextAction: string
  aiStatus: string
  aiAssessment: string
  paymentHistory: { avgDays: number; totalInvoices: number; disputes: number }
}

export function ARCollections() {
  const [selectedClient, setSelectedClient] = useState<CollectionAccount | null>(null)

  const collectionAccounts: CollectionAccount[] = [
    {
      clientId: 'cli-elgin',
      clientName: 'City of Elgin',
      contactName: 'Robert Garza',
      contactPhone: '(847) 931-5640',
      contactEmail: 'robert.garza@cityofelgin.org',
      invoiceCount: 1,
      totalBalance: 2845000,
      daysOverdue: 3,
      collectionStage: 'Day 3 Overdue Notice',
      lastTouch: 'Today 9:00 AM',
      nextAction: 'Day 10 — Follow-up if unpaid',
      aiStatus: 'Active',
      aiAssessment:
        'Municipal client. Payment likely within 5–10 business days based on historical pattern. Recommend standard overdue sequence without escalation.',
      paymentHistory: { avgDays: 38, totalInvoices: 8, disputes: 0 },
    },
    {
      clientId: 'cli-schaumburg',
      clientName: 'Village of Schaumburg',
      contactName: 'Carol Westbrook',
      contactPhone: '(847) 923-3000',
      contactEmail: 'ap@villageofschaumburg.com',
      invoiceCount: 1,
      totalBalance: 3120000,
      daysOverdue: 47,
      collectionStage: 'Credit Hold Active',
      lastTouch: 'Today 9:00 AM',
      nextAction: 'Awaiting controller direction',
      aiStatus: 'Escalated',
      aiAssessment:
        'Day 47 overdue. Credit hold flag active. 2 attempts with no response. This municipality is significantly past their usual payment pattern (avg 32 days). Formal demand sent. Recommend legal consultation.',
      paymentHistory: { avgDays: 32, totalInvoices: 12, disputes: 0 },
    },
    {
      clientId: 'cli-loyola',
      clientName: 'Loyola University Chicago',
      contactName: 'Frank Beaumont',
      contactPhone: '(773) 508-3000',
      contactEmail: 'fbeaumont@luc.edu',
      invoiceCount: 1,
      totalBalance: 920000,
      daysOverdue: 22,
      collectionStage: 'Escalated to Controller',
      lastTouch: 'Yesterday 9:00 AM',
      nextAction: 'Day 30 — Formal demand',
      aiStatus: 'Active',
      aiAssessment:
        'Day 22 overdue on emergency service invoice. Educational institution — typically slow AP process. No dispute filed. Recommend controller phone call before formal demand.',
      paymentHistory: { avgDays: 41, totalInvoices: 5, disputes: 0 },
    },
    {
      clientId: 'cli-hilton',
      clientName: "Hilton Hotels — O'Hare",
      contactName: 'Grace Liu',
      contactPhone: '(847) 678-4000',
      contactEmail: 'gfliu@hilton-ohare.com',
      invoiceCount: 1,
      totalBalance: 3390000,
      daysOverdue: 32,
      collectionStage: 'Active Collection — Balance',
      lastTouch: 'Today 8:00 AM',
      nextAction: 'Day 40 — Escalate',
      aiStatus: 'Active',
      aiAssessment:
        '$33,900 balance after 50% partial payment received. Strong payment history. Likely administrative delay on second payment. Standard escalation recommended at Day 40.',
      paymentHistory: { avgDays: 28, totalInvoices: 6, disputes: 0 },
    },
    {
      clientId: 'cli-walgreens',
      clientName: 'Walgreens Corp — Regional',
      contactName: 'Patricia Ortiz',
      contactPhone: '(224) 231-0000',
      contactEmail: 'ap.midwest@walgreens.com',
      invoiceCount: 1,
      totalBalance: 1860000,
      daysOverdue: 18,
      collectionStage: 'DISPUTED — Collection Paused',
      lastTouch: '03/18/26 2:01 PM',
      nextAction: 'Awaiting dispute resolution',
      aiStatus: 'Paused',
      aiAssessment:
        'Client filed dispute claiming incomplete work. Collection sequence paused per policy. Legal review flag set. PM is reviewing site photos and completion certificate.',
      paymentHistory: { avgDays: 22, totalInvoices: 9, disputes: 1 },
    },
    {
      clientId: 'cli-northwestern',
      clientName: 'Northwestern Medicine',
      contactName: 'James Aldridge',
      contactPhone: '(312) 926-2000',
      contactEmail: 'jaldridge@nm.org',
      invoiceCount: 1,
      totalBalance: 4475000,
      daysOverdue: 55,
      collectionStage: 'Escalated to Controller',
      lastTouch: 'Today 9:00 AM',
      nextAction: 'Day 60 — Formal demand + credit hold',
      aiStatus: 'Escalated',
      aiAssessment:
        'Day 55 on $44,750 balance (50% already paid). Healthcare systems often run 60-75 days informally. Recommend courtesy call from Controller before formal demand. Strong long-term client.',
      paymentHistory: { avgDays: 52, totalInvoices: 4, disputes: 0 },
    },
  ]

  const COLUMNS: Column<CollectionAccount>[] = [
    {
      key: 'clientName',
      header: 'Client',
      sortable: true,
      accessor: r => (
        <div>
          <div className="font-medium text-[#0F172A] text-xs">{r.clientName}</div>
          <div className="text-[11px] text-[#94A3B8]">
            {r.contactName} · {r.contactPhone}
          </div>
        </div>
      ),
    },
    {
      key: 'totalBalance',
      header: 'Balance',
      sortable: true,
      accessor: r => (
        <span className="text-xs font-semibold text-[#0F172A]">{formatCurrency(r.totalBalance)}</span>
      ),
    },
    {
      key: 'daysOverdue',
      header: 'Days Overdue',
      sortable: true,
      accessor: r => (
        <span
          className={`text-xs font-bold ${
            r.daysOverdue > 30
              ? 'text-red-600'
              : r.daysOverdue > 10
              ? 'text-yellow-600'
              : 'text-orange-500'
          }`}
        >
          {r.daysOverdue}d
        </span>
      ),
    },
    {
      key: 'collectionStage',
      header: 'Stage',
      accessor: r => <span className="text-xs text-[#475569]">{r.collectionStage}</span>,
    },
    {
      key: 'lastTouch',
      header: 'Last Touch',
      accessor: r => <span className="text-xs text-[#94A3B8]">{r.lastTouch}</span>,
    },
    {
      key: 'aiStatus',
      header: 'AI Status',
      accessor: r => {
        const colors: Record<string, string> = {
          Active: 'text-blue-600 bg-blue-50',
          Escalated: 'text-red-600 bg-red-50',
          Paused: 'text-yellow-600 bg-yellow-50',
        }
        return (
          <span
            className={`text-[10px] font-semibold px-2 py-1 rounded-full uppercase ${
              colors[r.aiStatus] || 'text-gray-600 bg-gray-50'
            }`}
          >
            {r.aiStatus}
          </span>
        )
      },
    },
    {
      key: 'actions',
      header: '',
      accessor: r => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs px-2"
            onClick={e => {
              e?.stopPropagation()
              setSelectedClient(r)
            }}
          >
            Details
          </Button>
          <Button variant="ghost" size="sm" className="text-xs px-2">
            <PauseCircle size={11} />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="pb-12 pt-8">
      <PageHeader
        title="Collections"
        breadcrumb={[{ label: 'AR' }, { label: 'Collections' }]}
        subtitle="ARIA-AR managing active collection sequences across all overdue accounts"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              Export
            </Button>
            <Button variant="primary" size="sm">
              <TrendingUp size={13} /> Run Collection Analysis
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <Card padding="sm">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">
            Accounts in Collection
          </div>
          <div className="text-2xl font-bold text-[#0F172A]">{collectionAccounts.length}</div>
        </Card>
        <Card padding="sm">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">
            Total Under Collection
          </div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(collectionAccounts.reduce((sum, a) => sum + a.totalBalance, 0))}
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Escalated</div>
          <div className="text-2xl font-bold text-yellow-600">
            {collectionAccounts.filter(a => a.aiStatus === 'Escalated').length}
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">
            Disputed (Paused)
          </div>
          <div className="text-2xl font-bold text-orange-600">
            {collectionAccounts.filter(a => a.aiStatus === 'Paused').length}
          </div>
        </Card>
      </div>

      <DataTable
        columns={COLUMNS}
        data={collectionAccounts}
        keyExtractor={r => r.clientId}
        onRowClick={setSelectedClient}
        rowClassName={r => (r.daysOverdue > 30 ? 'bg-red-50/30' : '')}
      />

      {selectedClient && (
        <Modal
          open
          onClose={() => setSelectedClient(null)}
          title={`Collection Detail — ${selectedClient.clientName}`}
          size="lg"
        >
          <div className="space-y-4">
            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">Contact</div>
                <div className="font-medium">{selectedClient.contactName}</div>
                <div className="text-[#475569]">{selectedClient.contactPhone}</div>
                <div className="text-[#475569]">{selectedClient.contactEmail}</div>
              </div>
              <div>
                <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-1">
                  Payment History
                </div>
                <div className="text-sm text-[#475569]">
                  {selectedClient.paymentHistory.totalInvoices} prior invoices
                </div>
                <div className="text-sm text-[#475569]">
                  Avg {selectedClient.paymentHistory.avgDays} days to pay
                </div>
                <div className="text-sm text-[#475569]">
                  {selectedClient.paymentHistory.disputes} disputes
                </div>
              </div>
            </div>

            {/* ARIA Assessment */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Bot size={14} className="text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">ARIA-AR Assessment</span>
              </div>
              <p className="text-sm text-[#475569]">{selectedClient.aiAssessment}</p>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button variant="primary" size="sm">
                <Phone size={12} /> Log Phone Call
              </Button>
              <Button variant="secondary" size="sm">
                <Mail size={12} /> Send Email
              </Button>
              <Button variant="secondary" size="sm">
                <UserCheck size={12} /> Mark Promised to Pay
              </Button>
              <Button variant="ghost" size="sm">
                <PauseCircle size={12} /> Pause Sequence
              </Button>
              <Button variant="danger" size="sm">
                <AlertCircle size={12} /> Override AI
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
