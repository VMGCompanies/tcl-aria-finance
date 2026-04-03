import type { ActivityEntry } from '../../types/common.types'
import { cn } from '../../lib/utils'
import { CheckCircle, AlertTriangle, RefreshCw, Info } from 'lucide-react'

const STATUS_ICONS = {
  success: CheckCircle,
  warning: AlertTriangle,
  active: RefreshCw,
  info: Info,
}

const STATUS_COLORS = {
  success: 'text-green-600',
  warning: 'text-yellow-600',
  active: 'text-blue-600',
  info: 'text-gray-500',
}

const ADE_COLORS: Record<string, string> = {
  'ARIA-AR': 'bg-blue-100 text-blue-700',
  'ARIA-AP': 'bg-purple-100 text-purple-700',
  'Human': 'bg-gray-100 text-gray-700',
}

export function AIActivityFeed({
  entries,
  maxHeight = 400,
}: {
  entries: ActivityEntry[]
  maxHeight?: number
}) {
  return (
    <div className="overflow-y-auto divide-y divide-[#F1F5F9]" style={{ maxHeight }}>
      {entries.map((entry, i) => {
        const Icon = STATUS_ICONS[entry.status]
        return (
          <div
            key={entry.id}
            className={cn('flex gap-3 px-3 py-2.5 text-xs', i === 0 && 'bg-blue-50/40')}
          >
            <Icon
              size={13}
              className={cn(
                'mt-0.5 flex-shrink-0',
                STATUS_COLORS[entry.status],
                entry.status === 'active' && 'animate-spin'
              )}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span
                  className={cn(
                    'text-[10px] font-semibold px-1.5 py-0.5 rounded-sm',
                    ADE_COLORS[entry.ade]
                  )}
                >
                  {entry.ade}
                </span>
                <span className="text-[#94A3B8] flex-shrink-0">{entry.timestamp}</span>
                {entry.channel && (
                  <span className="text-[10px] text-[#94A3B8] bg-gray-100 px-1.5 py-0.5 rounded">
                    {entry.channel}
                  </span>
                )}
              </div>
              <div className="text-[#475569] leading-snug">{entry.action}</div>
            </div>
          </div>
        )
      })}
      {entries.length === 0 && (
        <div className="px-4 py-8 text-center text-xs text-[#94A3B8]">No activity yet</div>
      )}
    </div>
  )
}
