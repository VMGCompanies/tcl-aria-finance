import { X, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import type { Notification } from '../../types/common.types'
import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export function NotificationsPanel() {
  const { notifications, notificationsOpen, setNotificationsOpen, dismissNotification } = useApp()
  const actionRequired = notifications.filter(n => n.type === 'action-required')
  const pending = notifications.filter(n => n.type === 'pending')
  const completed = notifications.filter(n => n.type === 'completed')

  return (
    <AnimatePresence>
      {notificationsOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed right-0 top-0 h-full w-[380px] bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
              <h2 className="font-semibold text-[#0F172A]">Notifications</h2>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="p-1.5 rounded hover:bg-gray-100"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {actionRequired.length > 0 && (
                <NotifSection
                  title="Action Required"
                  count={actionRequired.length}
                  color="red"
                  icon={AlertCircle}
                  notifications={actionRequired}
                  onDismiss={dismissNotification}
                />
              )}
              {pending.length > 0 && (
                <NotifSection
                  title="Pending Review"
                  count={pending.length}
                  color="yellow"
                  icon={Clock}
                  notifications={pending}
                  onDismiss={dismissNotification}
                />
              )}
              {completed.length > 0 && (
                <NotifSection
                  title="Completed Today"
                  count={completed.length}
                  color="green"
                  icon={CheckCircle}
                  notifications={completed}
                  onDismiss={dismissNotification}
                />
              )}
              {notifications.length === 0 && (
                <div className="p-8 text-center text-sm text-[#94A3B8]">
                  No notifications
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function NotifSection({
  title,
  count,
  color,
  icon: Icon,
  notifications,
  onDismiss,
}: {
  title: string
  count: number
  color: string
  icon: React.ElementType
  notifications: Notification[]
  onDismiss: (id: string) => void
}) {
  const colors: Record<string, string> = {
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    green: 'text-green-600',
  }
  const bgColors: Record<string, string> = {
    red: 'bg-red-50 border-red-100',
    yellow: 'bg-yellow-50 border-yellow-100',
    green: 'bg-green-50 border-green-100',
  }

  return (
    <div className="p-4">
      <div className={cn('flex items-center gap-2 mb-3 text-sm font-semibold', colors[color])}>
        <Icon size={14} />
        {title} ({count})
      </div>
      <div className="space-y-2">
        {notifications.map(n => (
          <div
            key={n.id}
            className={cn('p-3 rounded-lg border text-sm', bgColors[color])}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="font-medium text-[#0F172A] text-xs mb-1">
                  <span className="font-bold text-[10px] uppercase tracking-wider mr-1 opacity-60">
                    [{n.ade}]
                  </span>
                  {n.title}
                </div>
                <div className="text-[#475569] text-xs leading-relaxed">{n.description}</div>
                <div className="text-[#94A3B8] text-[11px] mt-1">{n.timestamp}</div>
              </div>
              <button
                onClick={() => onDismiss(n.id)}
                className="text-gray-400 hover:text-gray-600 mt-0.5 flex-shrink-0"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
