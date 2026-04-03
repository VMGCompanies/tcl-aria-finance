import { Zap, Bot, Play, Pause, Activity, DollarSign } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../lib/utils'

function formatK(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n}`
}

interface ADECardProps {
  name: 'ARIA-AR' | 'ARIA-AP'
  running: boolean
  onToggle: () => void
  actions: number
  dollars: number
  lastAction: string
  color: 'blue' | 'purple'
}

function ADECard({ name, running, onToggle, actions, dollars, lastAction, color }: ADECardProps) {
  const isBlue = color === 'blue'
  const accent = isBlue ? '#2563EB' : '#7C3AED'
  const bg = isBlue ? 'bg-blue-50' : 'bg-purple-50'
  const border = isBlue ? 'border-blue-200' : 'border-purple-200'
  const text = isBlue ? 'text-blue-700' : 'text-purple-700'
  const badgeBg = isBlue ? 'bg-blue-600' : 'bg-purple-600'
  const Icon = isBlue ? Zap : Bot

  return (
    <div className={cn('rounded-xl border-2 p-4 flex flex-col gap-3', bg, border, running && 'shadow-md')}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={cn('w-8 h-8 rounded-lg flex items-center justify-center text-white', badgeBg)}
          >
            <Icon size={16} />
          </div>
          <div>
            <div className="font-bold text-[#0F172A] text-sm">{name}</div>
            <div className="text-[10px] text-[#64748B]">
              {isBlue ? 'Accounts Receivable' : 'Accounts Payable'} Agent
            </div>
          </div>
        </div>

        {/* Status pill */}
        <div className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
          running ? `${text} ${bg}` : 'text-gray-500 bg-gray-100'
        )}>
          {running && (
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: accent }}
            />
          )}
          {running ? 'Running' : 'Paused'}
        </div>
      </div>

      {/* Live animation bar */}
      {running && (
        <div className="h-1 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full animate-[progress_2s_ease-in-out_infinite]"
            style={{ backgroundColor: accent, width: '60%', animation: 'ade-scan 2s ease-in-out infinite' }}
          />
        </div>
      )}
      {!running && <div className="h-1 rounded-full bg-gray-100" />}

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2">
        <div className={cn('rounded-lg p-2.5 text-center', isBlue ? 'bg-blue-100/60' : 'bg-purple-100/60')}>
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Activity size={10} style={{ color: accent }} />
            <span className="text-[9px] font-semibold text-[#64748B] uppercase tracking-wide">Actions Today</span>
          </div>
          <div className="font-bold text-lg leading-tight" style={{ color: accent }}>{actions}</div>
        </div>
        <div className={cn('rounded-lg p-2.5 text-center', isBlue ? 'bg-blue-100/60' : 'bg-purple-100/60')}>
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <DollarSign size={10} style={{ color: accent }} />
            <span className="text-[9px] font-semibold text-[#64748B] uppercase tracking-wide">Processed</span>
          </div>
          <div className="font-bold text-lg leading-tight" style={{ color: accent }}>{formatK(dollars)}</div>
        </div>
      </div>

      {/* Last action */}
      <div className="text-[11px] text-[#64748B] bg-white/80 rounded-lg px-2.5 py-1.5 border border-white truncate">
        <span className="font-medium" style={{ color: accent }}>Last: </span>
        {lastAction}
      </div>

      {/* Start/Stop button */}
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all',
          running
            ? 'bg-white border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-400'
            : 'text-white hover:opacity-90',
        )}
        style={running ? {} : { backgroundColor: accent }}
      >
        {running ? <><Pause size={14} /> Pause Agent</> : <><Play size={14} /> Start Agent</>}
      </button>
    </div>
  )
}

export function ADELivePanel() {
  const { arRunning, apRunning, setARRunning, setAPRunning, arStats, apStats, lastARAction, lastAPAction } = useApp()

  const totalActions = arStats.actions + apStats.actions
  const totalDollars = arStats.dollars + apStats.dollars
  const bothRunning = arRunning && apRunning
  const noneRunning = !arRunning && !apRunning

  return (
    <div className="mb-6">
      {/* Top control bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            'flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full',
            noneRunning ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'
          )}>
            {!noneRunning && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
            {noneRunning ? 'All Agents Paused' : `${[arRunning, apRunning].filter(Boolean).length} Agent${bothRunning ? 's' : ''} Running`}
          </div>
          <span className="text-xs text-[#94A3B8]">{totalActions} actions · {formatK(totalDollars)} processed today</span>
        </div>
        <div className="flex gap-2">
          {!bothRunning && (
            <button
              onClick={() => { setARRunning(true); setAPRunning(true) }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1A2E4A] text-white hover:bg-[#142338] flex items-center gap-1.5"
            >
              <Play size={11} /> Start All
            </button>
          )}
          {!noneRunning && (
            <button
              onClick={() => { setARRunning(false); setAPRunning(false) }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1.5"
            >
              <Pause size={11} /> Pause All
            </button>
          )}
        </div>
      </div>

      {/* ADE cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ADECard
          name="ARIA-AR"
          running={arRunning}
          onToggle={() => setARRunning(!arRunning)}
          actions={arStats.actions}
          dollars={arStats.dollars}
          lastAction={lastARAction}
          color="blue"
        />
        <ADECard
          name="ARIA-AP"
          running={apRunning}
          onToggle={() => setAPRunning(!apRunning)}
          actions={apStats.actions}
          dollars={apStats.dollars}
          lastAction={lastAPAction}
          color="purple"
        />
      </div>
    </div>
  )
}
