import { type ReactNode, type MouseEvent } from 'react'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

interface Props {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'orange' | 'success'
  size?: 'sm' | 'default' | 'lg'
  onClick?: (e?: MouseEvent) => void
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit'
  className?: string
  icon?: ReactNode
}

export function Button({
  children,
  variant = 'primary',
  size = 'default',
  onClick,
  disabled,
  loading,
  type = 'button',
  className,
  icon,
}: Props) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-[#1A2E4A] text-white hover:bg-[#142338] focus:ring-[#1A2E4A]',
    secondary:
      'bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F7F8FA] focus:ring-[#1A2E4A]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-[#475569] hover:bg-[#F7F8FA] hover:text-[#0F172A] focus:ring-[#1A2E4A]',
    orange: 'bg-[#E8700A] text-white hover:bg-orange-700 focus:ring-[#E8700A]',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  }

  const sizes = {
    sm: 'h-7 px-2.5 text-xs',
    default: 'h-9 px-3.5 text-sm',
    lg: 'h-11 px-5 text-sm',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
      {children}
    </button>
  )
}
