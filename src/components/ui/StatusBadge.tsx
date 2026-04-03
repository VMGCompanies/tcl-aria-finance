import { cn } from '../../lib/utils'
import { STATUS_COLORS } from '../../lib/constants'

interface Props {
  status: string
  size?: 'sm' | 'default'
  showDot?: boolean
}

export function StatusBadge({ status, size = 'default', showDot = true }: Props) {
  const config = STATUS_COLORS[status] || { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wider',
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[11px]',
        config.bg,
        config.text
      )}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} />
      )}
      {status}
    </span>
  )
}
