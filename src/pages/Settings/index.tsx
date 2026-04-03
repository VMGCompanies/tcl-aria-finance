import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'
import { Building2, Bot, GitBranch, Users, Bell, Plug } from 'lucide-react'

const SUB_NAV = [
  { path: '/settings', label: 'Company Profile', icon: Building2, exact: true },
  { path: '/settings/ade', label: 'ADE Configuration', icon: Bot },
  { path: '/settings/workflows', label: 'Approval Workflows', icon: GitBranch },
  { path: '/settings/users', label: 'User Management', icon: Users },
  { path: '/settings/notifications', label: 'Notifications', icon: Bell },
  { path: '/settings/integrations', label: 'Integrations', icon: Plug },
]

export function Settings() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="pb-12 pt-8">
      <PageHeader
        title="Settings & Configuration"
        subtitle="Platform configuration, ADE settings, and integrations"
      />
      <div className="flex gap-5">
        {/* Sub-nav */}
        <div className="w-52 flex-shrink-0">
          <Card padding="sm">
            {SUB_NAV.map(item => {
              const isActive =
                item.exact
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path) && item.path !== '/settings'
              const isExactActive = item.exact && location.pathname === '/settings'
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors mb-0.5 text-left',
                    isActive || isExactActive
                      ? 'bg-[#1A2E4A] text-white'
                      : 'text-[#475569] hover:bg-[#F7F8FA]'
                  )}
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              )
            })}
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Routes>
            <Route index element={<CompanyProfile />} />
            <Route path="ade" element={<ADEConfig />} />
            <Route path="workflows" element={<ApprovalWorkflows />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="notifications" element={<NotificationSettings />} />
            <Route path="integrations" element={<IntegrationsHub />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function CompanyProfile() {
  return (
    <Card padding="default">
      <h2 className="text-base font-semibold mb-4">Company Profile</h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Company Name', value: 'TCL Electrical & Lighting' },
          { label: 'EIN', value: '36-XXXXXXX' },
          { label: 'Phone', value: '630.844.3274' },
          { label: 'Email', value: 'info@tclelectric.com' },
          { label: 'Address', value: 'Geneva, IL 60134' },
          { label: 'Fiscal Year End', value: 'December 31' },
        ].map(f => (
          <div key={f.label}>
            <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider block mb-1">{f.label}</label>
            <input
              type="text"
              defaultValue={f.value}
              className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A2E4A]/20"
            />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <label className="text-xs font-medium text-[#94A3B8] uppercase tracking-wider block mb-2">Multi-Entity</label>
        <div className="flex flex-wrap gap-2">
          {['TCL Electric ✓', 'US Allied Plumbing', 'Modern Heating & Plumbing', 'Allied Construction', 'Illinois Lighting', 'FLM'].map(e => (
            <span
              key={e}
              className={`px-3 py-1 rounded-full text-xs border ${
                e.includes('✓')
                  ? 'bg-[#1A2E4A] text-white border-[#1A2E4A]'
                  : 'bg-white text-[#475569] border-[#E2E8F0] cursor-pointer hover:bg-[#F7F8FA]'
              }`}
            >
              {e}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="primary">Save Changes</Button>
        <Button variant="secondary">Cancel</Button>
      </div>
    </Card>
  )
}

function ADEConfig() {
  const [arSettings, setARSettings] = useState({
    day10: true, day24: true, day33: true, day45: true, day60: true,
    autoApply: true, matchThreshold: 95, autoRetainage: false, autoLienWaiver: true,
  })

  return (
    <div className="space-y-4">
      <Card padding="default">
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          ARIA-AR Settings
        </h2>
        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-[#475569] uppercase tracking-wider mb-2">Collection Sequence</div>
            {[
              { key: 'day10', label: 'Day 10 — First reminder (informational)' },
              { key: 'day24', label: 'Day 24 — Pre-due reminder' },
              { key: 'day33', label: 'Day 33 — First overdue notice' },
              { key: 'day45', label: 'Day 45 — Escalation to Controller' },
              { key: 'day60', label: 'Day 60 — Formal demand + credit hold' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2 border-b border-[#F1F5F9]">
                <span className="text-sm text-[#475569]">{item.label}</span>
                <label className="relative inline-flex cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(arSettings as Record<string, boolean | number>)[item.key] as boolean}
                    onChange={e => setARSettings(p => ({ ...p, [item.key]: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-checked:bg-[#1A2E4A] rounded-full peer-focus:ring-2 peer-focus:ring-[#1A2E4A]/30 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-[#475569]">Auto-apply payments on receipt</span>
            <label className="relative inline-flex cursor-pointer">
              <input
                type="checkbox"
                checked={arSettings.autoApply}
                onChange={e => setARSettings(p => ({ ...p, autoApply: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-checked:bg-[#1A2E4A] rounded-full peer-focus:ring-2 peer-focus:ring-[#1A2E4A]/30 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-transform peer-checked:after:translate-x-4" />
            </label>
          </div>

          <div>
            <label className="text-xs font-medium text-[#475569] block mb-1">
              Payment matching confidence threshold: <strong>{arSettings.matchThreshold}%</strong>
            </label>
            <input
              type="range"
              min={80}
              max={100}
              value={arSettings.matchThreshold}
              onChange={e => setARSettings(p => ({ ...p, matchThreshold: Number(e.target.value) }))}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      <Card padding="default">
        <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          ARIA-AP Settings
        </h2>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Invoice Intake', value: 'ap@tclelectric.com inbox + Vendor Portal + Manual Upload' },
            { label: '3-Way Match Required', value: 'All invoices' },
            { label: 'Auto-Approval Limit', value: '$5,000 with 3-way match' },
            { label: 'Exception Routing', value: 'Controller → CFO (if no response 24hrs)' },
            { label: 'Payment Run Schedule', value: 'Daily 5:00 PM' },
            { label: 'Duplicate Detection', value: 'Always On (non-configurable)' },
          ].map(f => (
            <div key={f.label} className="flex justify-between items-center py-2 border-b border-[#F1F5F9]">
              <span className="text-[#94A3B8] text-xs">{f.label}</span>
              <span className="font-medium text-xs">{f.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Button variant="primary">Save ADE Configuration</Button>
    </div>
  )
}

function ApprovalWorkflows() {
  return (
    <Card padding="default">
      <h2 className="text-base font-semibold mb-4">Approval Workflow Configuration</h2>
      <div className="bg-[#F7F8FA] rounded-lg p-4 font-mono text-xs text-[#475569] space-y-2">
        <div>Invoice Received</div>
        <div className="ml-4">↓</div>
        <div className="ml-4">ARIA-AP — Auto-processing (OCR + 3-way match)</div>
        <div className="ml-8">↓</div>
        <div className="ml-8 space-y-1">
          <div className="bg-green-50 border border-green-200 p-2 rounded text-green-700">
            [3-way match + under $5K] → Auto-Approve → Payment Queue
          </div>
          <div className="bg-blue-50 border border-blue-200 p-2 rounded text-blue-700">
            [3-way match + over $5K] → Controller Review → [Approve/Reject]
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-yellow-700">
            [Exception] → Controller (24hr SLA) → CFO if no response → [Approve/Reject]
          </div>
          <div className="bg-red-50 border border-red-200 p-2 rounded text-red-700">
            [Over $25K] → Controller + Owner Dual Approval Required
          </div>
        </div>
      </div>
      <div className="mt-4 p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded text-xs text-[#2563EB]">
        Workflow builder available in production deployment. Contact Neuralogic Group to configure custom approval chains.
      </div>
    </Card>
  )
}

function UserManagement() {
  const users = [
    { name: 'Tom Callahan', role: 'Controller', access: 'Admin', ades: 'AR + AP', lastLogin: 'Today 8:22 AM' },
    { name: 'John Callahan (Owner)', role: 'Owner', access: 'Super Admin', ades: 'All', lastLogin: 'Today 9:41 AM' },
    { name: 'Sarah Mitchell', role: 'AP Clerk', access: 'Reviewer', ades: 'AP only', lastLogin: '04/02/26' },
    { name: 'Mark Davis', role: 'AR Specialist', access: 'Reviewer', ades: 'AR only', lastLogin: '04/01/26' },
  ]

  return (
    <Card padding="default">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">User Management</h2>
        <Button variant="primary" size="sm">+ Invite User</Button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E2E8F0]">
            {['Name', 'Role', 'Access Level', 'ADE Access', 'Last Login', ''].map(h => (
              <th key={h} className="text-left py-2 px-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F1F5F9]">
          {users.map(u => (
            <tr key={u.name} className="hover:bg-[#F8FAFC]">
              <td className="py-3 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1A2E4A] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {u.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <span className="font-medium text-xs">{u.name}</span>
                </div>
              </td>
              <td className="py-3 px-3 text-xs text-[#475569]">{u.role}</td>
              <td className="py-3 px-3">
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                  u.access === 'Super Admin'
                    ? 'bg-purple-100 text-purple-700'
                    : u.access === 'Admin'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {u.access}
                </span>
              </td>
              <td className="py-3 px-3 text-xs text-[#475569]">{u.ades}</td>
              <td className="py-3 px-3 text-xs text-[#94A3B8]">{u.lastLogin}</td>
              <td className="py-3 px-3"><Button variant="ghost" size="sm">Edit</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

function NotificationSettings() {
  const events = [
    { event: 'Exception requires review', email: true, sms: true, inapp: true, slack: true },
    { event: 'Payment run executed', email: true, sms: false, inapp: true, slack: true },
    { event: 'Invoice overdue > 30 days', email: true, sms: false, inapp: true, slack: false },
    { event: 'Large invoice received (>$25K)', email: true, sms: true, inapp: true, slack: true },
    { event: 'Subcontractor compliance expiring', email: true, sms: false, inapp: true, slack: false },
    { event: 'ADE paused', email: true, sms: true, inapp: true, slack: true },
  ]

  return (
    <Card padding="default">
      <h2 className="text-base font-semibold mb-4">Notification Settings</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E2E8F0]">
            {['Event', 'Email', 'SMS', 'In-App', 'Slack'].map(h => (
              <th key={h} className="text-left py-2 px-3 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F1F5F9]">
          {events.map(e => (
            <tr key={e.event} className="hover:bg-[#F8FAFC]">
              <td className="py-2.5 px-3 text-xs">{e.event}</td>
              {[e.email, e.sms, e.inapp, e.slack].map((checked, i) => (
                <td key={i} className="py-2.5 px-3">
                  <input type="checkbox" defaultChecked={checked} className="rounded border-[#E2E8F0]" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex gap-2">
        <Button variant="primary">Save Preferences</Button>
        <Button variant="secondary">Reset to Defaults</Button>
      </div>
    </Card>
  )
}

function IntegrationsHub() {
  const integrations = [
    {
      category: 'Accounting / ERP',
      items: [
        { name: 'QuickBooks Online', desc: 'Bidirectional sync of invoices, payments, vendors, chart of accounts', connected: false },
        { name: 'QuickBooks Desktop', desc: 'Connect via Connector App', connected: false },
        { name: 'Sage Intacct', desc: 'Enterprise accounting integration', connected: false },
        { name: 'NetSuite', desc: 'Full ERP integration', connected: false },
        { name: 'Manual / CSV Import', desc: 'Fallback manual import', connected: true },
      ],
    },
    {
      category: 'Banking & Payments',
      items: [
        { name: 'Plaid', desc: 'Real-time bank transaction feed for auto-payment matching', connected: false },
        { name: 'Bill.com', desc: 'ACH and check payment execution', connected: false },
        { name: 'Chase Business Online', desc: 'Commercial banking integration', connected: false },
      ],
    },
    {
      category: 'Documents & E-Signature',
      items: [
        { name: 'DocuSign', desc: 'Automated lien waiver and contract e-signature workflows', connected: false },
        { name: 'Google Drive', desc: 'Document storage and retrieval', connected: false },
      ],
    },
    {
      category: 'Field Operations',
      items: [
        { name: 'Procore', desc: 'Work order completion triggers invoice generation', connected: false },
        { name: 'ServiceTitan', desc: 'Service call completion triggers AR workflow', connected: false },
        { name: 'Jobber', desc: 'Field service management', connected: false },
      ],
    },
    {
      category: 'Communication',
      items: [
        { name: 'Gmail / Google Workspace', desc: 'Vendor invoice intake and client delivery', connected: false },
        { name: 'Slack', desc: 'Exception alerts and ADE status notifications', connected: false },
        { name: 'Twilio', desc: 'SMS collection touchpoints', connected: false },
      ],
    },
    {
      category: 'Tax & Compliance',
      items: [
        { name: 'Avalara', desc: 'Real-time sales tax calculation', connected: false },
        { name: 'Track1099', desc: '1099 filing and vendor tax document management', connected: false },
      ],
    },
  ]

  return (
    <div className="space-y-5">
      <div className="p-4 bg-[#F7F8FA] border border-[#E2E8F0] rounded-lg text-sm text-[#475569]">
        <p>
          Connect Finance IQ Platform to your existing software ecosystem. All integrations are authenticated via OAuth 2.0 or
          API key and communicate through encrypted, SOC 2-compliant channels.
        </p>
      </div>

      {integrations.map(section => (
        <Card key={section.category} padding="default">
          <h3 className="text-sm font-semibold text-[#0F172A] mb-3">{section.category}</h3>
          <div className="space-y-2">
            {section.items.map(item => (
              <div
                key={item.name}
                className="flex items-center justify-between py-2.5 border-b border-[#F1F5F9] last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.connected ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">{item.name}</div>
                    <div className="text-xs text-[#94A3B8]">{item.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.connected ? (
                    <>
                      <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">Connected</span>
                      <Button variant="ghost" size="sm">Configure</Button>
                    </>
                  ) : (
                    <Button variant="secondary" size="sm">Connect</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}

      <Card padding="default">
        <h3 className="text-sm font-semibold mb-3">API Key Management</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[#94A3B8] block mb-1">Finance IQ API Key</label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                defaultValue="aria_live_tcl_xxxxxxxxxxxxxxxxxx"
                className="flex-1 px-3 py-2 text-sm font-mono border border-[#E2E8F0] rounded-lg bg-[#F7F8FA]"
              />
              <Button variant="secondary" size="sm">Show</Button>
              <Button variant="secondary" size="sm">Regenerate</Button>
            </div>
          </div>
          <div>
            <label className="text-xs text-[#94A3B8] block mb-1">Webhook URL</label>
            <div className="px-3 py-2 text-sm font-mono bg-[#F7F8FA] border border-[#E2E8F0] rounded-lg text-[#475569]">
              https://aria.neuralogicgroup.com/webhooks/tcl-electric
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
