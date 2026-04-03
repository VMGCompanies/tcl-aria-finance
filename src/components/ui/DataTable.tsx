import { type ReactNode, useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface Column<T> {
  key: string
  header: string
  accessor?: (row: T) => ReactNode
  sortable?: boolean
  className?: string
  headerClassName?: string
  width?: string
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  onRowClick?: (row: T) => void
  isLoading?: boolean
  emptyMessage?: string
  rowClassName?: (row: T) => string
  pageSize?: number
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading,
  emptyMessage = 'No records found',
  rowClassName,
  pageSize = 15,
  className,
}: Props<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(0)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const pageData = data.slice(page * pageSize, (page + 1) * pageSize)
  const totalPages = Math.ceil(data.length / pageSize)

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F7F8FA] border-b border-[#E2E8F0]">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={cn(
                    'px-3 py-2.5 text-left text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider whitespace-nowrap',
                    col.sortable && 'cursor-pointer hover:text-[#475569] select-none',
                    col.headerClassName
                  )}
                  style={col.width ? { width: col.width } : undefined}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {col.sortable &&
                      (sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )
                      ) : (
                        <ChevronsUpDown size={12} className="opacity-40" />
                      ))}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {columns.map(col => (
                    <td key={col.key} className="px-3 py-3">
                      <div
                        className="h-4 bg-gray-100 rounded animate-pulse"
                        style={{ width: `${60 + Math.random() * 40}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : pageData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-[#94A3B8] text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageData.map(row => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'hover:bg-[#F8FAFC] transition-colors',
                    onRowClick && 'cursor-pointer',
                    rowClassName?.(row)
                  )}
                >
                  {columns.map(col => (
                    <td key={col.key} className={cn('px-3 py-2.5 text-[#0F172A]', col.className)}>
                      {col.accessor ? col.accessor(row) : (row as Record<string, unknown>)[col.key] as ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1 pt-3 text-sm text-[#475569]">
          <span>
            {data.length} records — Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 rounded border border-[#E2E8F0] hover:bg-gray-50 disabled:opacity-40 text-xs"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 rounded border border-[#E2E8F0] hover:bg-gray-50 disabled:opacity-40 text-xs"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
