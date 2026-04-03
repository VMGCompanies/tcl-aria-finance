import { type ReactNode, useState } from 'react'
import { cn } from '../../lib/utils'

interface Tab {
  id: string
  label: string
  badge?: number
}

interface Props {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (id: string) => void
  children?: (activeTab: string) => ReactNode
}

export function Tabs({ tabs, defaultTab, onChange, children }: Props) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id)

  const handleChange = (id: string) => {
    setActive(id)
    onChange?.(id)
  }

  return (
    <div>
      <div className="flex border-b border-[#E2E8F0] mb-4">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => handleChange(t.id)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              active === t.id
                ? 'border-[#1A2E4A] text-[#1A2E4A]'
                : 'border-transparent text-[#94A3B8] hover:text-[#475569] hover:border-[#CBD5E1]'
            )}
          >
            {t.label}
            {t.badge !== undefined && t.badge > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      {children?.(active)}
    </div>
  )
}
