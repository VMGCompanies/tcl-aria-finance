import { type ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Props {
  label: string
  value: string
  trend?: {
    value: string
    direction: 'up' | 'down' | 'flat'
    isPositive: boolean
  }
  subtext?: string
  icon?: ReactNode
  aiDriven?: string
  variant?: 'default' | 'warning' | 'danger' | 'success'
  sparkline?: number[]
}

export function KPICard({
  label,
  value,
  trend,
  subtext,
  icon,
  aiDriven,
  variant = 'default',
  sparkline,
}: Props) {
  const variantStyles = {
    default: 'border-[#E2E8F0]',
    warning: 'border-yellow-200 bg-yellow-50/30',
    danger: 'border-red-200 bg-red-50/30',
    success: 'border-green-200 bg-green-50/30',
  }

  return (
    <div className={cn('bg-white rounded-lg border shadow-card p-4', variantStyles[variant])}>
      <div className="flex items-start justify-between mb-3">
        <div className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider leading-tight">
          {label}
        </div>
        {icon && <div className="text-[#94A3B8]">{icon}</div>}
      </div>
      <div className="text-2xl font-bold text-[#0F172A] mb-1">{value}</div>
      {trend && (
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-medium',
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          )}
        >
          {trend.direction === 'up' ? (
            <TrendingUp size={12} />
          ) : trend.direction === 'down' ? (
            <TrendingDown size={12} />
          ) : (
            <Minus size={12} />
          )}
          {trend.value}
        </div>
      )}
      {subtext && <div className="text-[11px] text-[#94A3B8] mt-1">{subtext}</div>}
      {aiDriven && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-[#2563EB]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
          {aiDriven}
        </div>
      )}
      {sparkline && sparkline.length > 1 && (
        <div className="mt-3">
          <MiniSparkline values={sparkline} isPositive={trend?.isPositive ?? true} />
        </div>
      )}
    </div>
  )
}

function MiniSparkline({
  values,
  isPositive,
}: {
  values: number[]
  isPositive: boolean
}) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const w = 100
  const h = 28
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w
      const y = h - ((v - min) / range) * h
      return `${x},${y}`
    })
    .join(' ')
  const color = isPositive ? '#16A34A' : '#DC2626'
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7" preserveAspectRatio="none">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
