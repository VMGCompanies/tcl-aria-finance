import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Zap, FileText, DollarSign, RefreshCw, Clipboard, TrendingUp,
  Bot, Download, ShoppingCart, CreditCard, HardHat, FolderOpen, Users, Building2,
  Settings, Plug, BookOpen, Bell, UserCheck
} from 'lucide-react'
import { cn } from '../lib/utils'
import { ROUTES } from '../lib/constants'
import { useApp } from '../context/AppContext'

const NAV_SECTIONS = [
  {
    label: 'OVERVIEW',
    items: [{ to: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Executive Dashboard', end: true }]
  },
  {
    label: 'AR — ACCOUNTS RECEIVABLE',
    items: [
      { to: ROUTES.AR, icon: Zap, label: 'ARIA-AR Overview', end: true },
      { to: ROUTES.AR_INVOICES, icon: FileText, label: 'Invoices' },
      { to: ROUTES.AR_COLLECTIONS, icon: DollarSign, label: 'Collections' },
      { to: ROUTES.AR_RECONCILIATION, icon: RefreshCw, label: 'Payment Reconciliation' },
      { to: ROUTES.AR_RETAINAGE, icon: Clipboard, label: 'Retainage & Lien Waivers' },
      { to: ROUTES.AR_AGING, icon: TrendingUp, label: 'AR Aging Report' },
    ]
  },
  {
    label: 'AP — ACCOUNTS PAYABLE',
    items: [
      { to: ROUTES.AP, icon: Bot, label: 'ARIA-AP Overview', end: true },
      { to: ROUTES.AP_INVOICES, icon: Download, label: 'Vendor Invoices' },
      { to: ROUTES.AP_POS, icon: ShoppingCart, label: 'Purchase Orders' },
      { to: ROUTES.AP_PAYMENTS, icon: CreditCard, label: 'Payment Queue' },
      { to: ROUTES.AP_SUBCONTRACTORS, icon: HardHat, label: 'Subcontractor Mgmt' },
      { to: ROUTES.AP_AGING, icon: TrendingUp, label: 'AP Aging Report' },
    ]
  },
  {
    label: 'OPERATIONS',
    items: [
      { to: '/projects', icon: FolderOpen, label: 'Projects & Work Orders', end: false },
      { to: '/technicians', icon: Users, label: 'Field Technician Roster', end: false },
      { to: '/clients', icon: Building2, label: 'Client Accounts', end: false },
    ]
  },
  {
    label: 'PLATFORM',
    items: [
      { to: ROUTES.SETTINGS, icon: Settings, label: 'Settings & Configuration', end: true },
      { to: ROUTES.SETTINGS_INTEGRATIONS, icon: Plug, label: 'Integrations' },
      { to: ROUTES.AUDIT_LOG, icon: BookOpen, label: 'Audit Log' },
      { to: '/notifications', icon: Bell, label: 'Notifications', end: false },
      { to: ROUTES.SETTINGS_USERS, icon: UserCheck, label: 'User Management' },
    ]
  }
]

export function Sidebar() {
  const { arRunning, apRunning } = useApp()

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-[#1A2E4A] text-white flex flex-col z-30 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-white/10 min-h-[64px]">
        <div className="flex-1 min-w-0">
          <img src="/tcl-logo.png" alt="TCL Electrical & Lighting" className="h-8 w-auto object-contain mb-1.5" style={{ filter: 'brightness(0) invert(1)' }} />
          <div className="text-[11px] text-white/60 tracking-tight">Finance IQ Platform</div>
        </div>
        <div className="flex flex-col gap-0.5">
          <span
            className={cn('w-2 h-2 rounded-full', arRunning ? 'bg-green-400' : 'bg-yellow-400')}
            title={`ARIA-AR ${arRunning ? 'Running' : 'Paused'}`}
          />
          <span
            className={cn('w-2 h-2 rounded-full', apRunning ? 'bg-green-400' : 'bg-yellow-400')}
            title={`ARIA-AP ${apRunning ? 'Running' : 'Paused'}`}
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2">
        {NAV_SECTIONS.map(section => (
          <div key={section.label} className="mb-4">
            <div className="text-[10px] font-semibold text-white/30 tracking-widest px-2 mb-1">
              {section.label}
            </div>
            {section.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => cn(
                  'flex items-center gap-2.5 px-2 py-1.5 rounded text-sm transition-colors mb-0.5',
                  isActive
                    ? 'bg-white/15 text-white font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <item.icon size={15} />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 text-[10px] text-white/30 text-center">
        Neuralogic Group ADE Platform
      </div>
    </aside>
  )
}
