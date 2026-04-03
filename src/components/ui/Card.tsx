import { type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface Props {
  children: ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'default' | 'lg'
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className, padding = 'default', hover, onClick }: Props) {
  const paddings = { none: '', sm: 'p-3', default: 'p-4', lg: 'p-6' }
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-lg border border-[#E2E8F0] shadow-card',
        paddings[padding],
        hover && 'hover:shadow-md hover:border-[#CBD5E1] transition-all cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
