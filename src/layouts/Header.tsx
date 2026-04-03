import { useState } from 'react'
import { Bell, Search, ChevronDown, Activity } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { cn } from '../lib/utils'

export function Header() {
  const { arRunning, apRunning, notificationCount, setNotificationsOpen } = useApp()
  const [searchValue, setSearchValue] = useState('')
  const activeCount = (arRunning ? 1 : 0) + (apRunning ? 1 : 0)

  return (
    <header className="fixed top-0 left-[240px] right-0 h-[64px] bg-white border-b border-[#E2E8F0] flex items-center px-4 gap-4 z-20 max-lg:left-0">
      {/* Search */}
      <div className="flex-1 max-w-lg relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder="Search invoices, vendors, clients, work orders…"
          className="w-full pl-9 pr-4 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-[#F7F8FA] focus:outline-none focus:ring-2 focus:ring-[#1A2E4A]/20 focus:border-[#1A2E4A] placeholder:text-[#94A3B8]"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* AI Status */}
        <div className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border',
          activeCount > 0
            ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]'
            : 'bg-gray-100 text-gray-500 border-gray-200'
        )}>
          <span className={cn(
            'w-2 h-2 rounded-full',
            activeCount > 0 ? 'bg-[#2563EB] animate-pulse' : 'bg-gray-400'
          )} />
          <Activity size={12} />
          {activeCount} ADE{activeCount !== 1 ? 's' : ''} Active
        </div>

        {/* Notifications */}
        <button
          onClick={() => setNotificationsOpen(true)}
          className="relative p-2 rounded-lg text-[#475569] hover:bg-[#F7F8FA] hover:text-[#0F172A] transition-colors"
        >
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {/* User */}
        <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-[#F7F8FA] transition-colors">
          <div className="w-8 h-8 rounded-full bg-[#1A2E4A] text-white text-xs font-bold flex items-center justify-center">
            TC
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium text-[#0F172A] leading-tight">Tom Callahan</div>
            <div className="text-[11px] text-[#94A3B8]">Controller</div>
          </div>
          <ChevronDown size={14} className="text-[#94A3B8]" />
        </button>
      </div>
    </header>
  )
}
