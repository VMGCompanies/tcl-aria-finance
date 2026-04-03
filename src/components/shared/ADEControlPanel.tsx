import { useState } from 'react'
import { Play, Pause, AlertTriangle } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

interface Stat {
  label: string
  value: string | number
}

interface Props {
  adeName: 'ARIA-AR' | 'ARIA-AP'
  running: boolean
  onPause: () => void
  onResume: () => void
  stats: Stat[]
  lastAction?: string
  nextAction?: string
}

export function ADEControlPanel({
  adeName,
  running,
  onPause,
  onResume,
  stats,
  lastAction,
  nextAction,
}: Props) {
  const [showPauseModal, setShowPauseModal] = useState(false)

  return (
    <>
      <div
        className={cn(
          'bg-white rounded-lg border shadow-card p-4',
          running ? 'border-green-200' : 'border-yellow-200'
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold',
                running ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
              )}
            >
              <span
                className={cn(
                  'w-2 h-2 rounded-full',
                  running ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                )}
              />
              {adeName} — {running ? 'RUNNING' : 'PAUSED'}
            </div>
          </div>
          <div className="flex gap-2">
            {running ? (
              <Button
                variant="secondary"
                size="sm"
                icon={<Pause size={13} />}
                onClick={() => setShowPauseModal(true)}
              >
                Pause {adeName}
              </Button>
            ) : (
              <Button
                variant="success"
                size="sm"
                icon={<Play size={13} />}
                onClick={onResume}
              >
                Resume {adeName}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {stats.map(s => (
            <div key={s.label} className="bg-[#F7F8FA] rounded-lg p-2.5">
              <div className="text-[11px] text-[#94A3B8] uppercase tracking-wider mb-0.5">
                {s.label}
              </div>
              <div className="text-lg font-bold text-[#0F172A]">{s.value}</div>
            </div>
          ))}
        </div>

        {(lastAction || nextAction) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#475569] border-t border-[#F1F5F9] pt-3">
            {lastAction && (
              <div>
                <span className="font-medium text-[#94A3B8]">Last action: </span>
                {lastAction}
              </div>
            )}
            {nextAction && (
              <div>
                <span className="font-medium text-[#94A3B8]">Next scheduled: </span>
                {nextAction}
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        open={showPauseModal}
        onClose={() => setShowPauseModal(false)}
        title={`Pause ${adeName}?`}
        size="sm"
        footer={
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={() => {
                onPause()
                setShowPauseModal(false)
              }}
            >
              Confirm Pause
            </Button>
            <Button variant="secondary" onClick={() => setShowPauseModal(false)}>
              Cancel
            </Button>
          </div>
        }
      >
        <div className="flex gap-3">
          <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-[#475569]">
            Pausing {adeName} will halt all automated invoice delivery, collection sequences, and
            payment processing. All queued actions will hold until resumed. Continue?
          </p>
        </div>
      </Modal>
    </>
  )
}
