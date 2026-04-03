import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface Props {
  title: string
  subtitle?: string
  breadcrumb?: BreadcrumbItem[]
  actions?: ReactNode
  badge?: ReactNode
}

export function PageHeader({ title, subtitle, breadcrumb, actions, badge }: Props) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {breadcrumb && (
          <div className="flex items-center gap-1 text-xs text-[#94A3B8] mb-1">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={11} />}
                {b.to ? (
                  <Link to={b.to} className="hover:text-[#475569]">
                    {b.label}
                  </Link>
                ) : (
                  <span>{b.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[#0F172A]">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="text-sm text-[#475569] mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
      )}
    </div>
  )
}
