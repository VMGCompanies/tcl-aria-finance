import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { NotificationsPanel } from '../components/shared/NotificationsPanel'
import { useApp } from '../context/AppContext'

export function AppLayout() {
  const { sidebarOpen } = useApp()
  return (
    <div className="flex h-screen bg-[#F7F8FA] overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => {}} />}
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[240px]">
        <Header />
        <main className="flex-1 overflow-y-auto pt-[64px] pb-8">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
      <NotificationsPanel />
      {/* Demo Mode Banner */}
      <DemoBanner />
      {/* Status Bar */}
      <StatusBar />
    </div>
  )
}

function DemoBanner() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div className="fixed top-[64px] left-[240px] right-0 z-10 bg-[#1A2E4A] text-white px-4 py-2 flex items-center justify-between text-sm max-lg:left-0">
      <span>🎯 <strong>Demo Mode Active</strong> — All data is simulated for demonstration purposes. This is what your live platform looks like on Day 1.</span>
      <div className="flex items-center gap-3">
        <button className="bg-[#E8700A] text-white px-3 py-1 rounded text-xs font-semibold hover:bg-orange-600 transition-colors">Schedule Go-Live</button>
        <button onClick={() => setVisible(false)} className="text-white/60 hover:text-white text-lg leading-none">×</button>
      </div>
    </div>
  )
}

function StatusBar() {
  return (
    <div className="fixed bottom-0 left-[240px] right-0 h-8 bg-white border-t border-[#E2E8F0] flex items-center px-4 text-xs text-[#94A3B8] max-lg:left-0">
      <span>Finance IQ Platform v2.4.1</span>
      <span className="mx-2">|</span>
      <span>TCL Electrical &amp; Lighting</span>
      <span className="mx-2">|</span>
      <span className="text-green-600 font-medium">2 ADEs Running</span>
      <span className="mx-2">|</span>
      <span>Last Sync: 2 min ago</span>
      <span className="mx-2">|</span>
      <span className="text-green-600">● All Systems Operational</span>
      <span className="ml-auto text-[#94A3B8]">Powered by Neuralogic Group</span>
    </div>
  )
}
