import { type ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  footer?: ReactNode
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = 'lg',
  footer,
}: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-7xl',
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative w-full bg-white rounded-xl shadow-modal my-8',
              sizes[size]
            )}
          >
            {(title || subtitle) && (
              <div className="flex items-start justify-between p-5 border-b border-[#E2E8F0]">
                <div>
                  {title && (
                    <h2 className="text-base font-semibold text-[#0F172A]">{title}</h2>
                  )}
                  {subtitle && (
                    <p className="text-sm text-[#475569] mt-0.5">{subtitle}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#475569] hover:bg-gray-100 ml-4 flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="p-5">{children}</div>
            {footer && <div className="px-5 pb-5">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
