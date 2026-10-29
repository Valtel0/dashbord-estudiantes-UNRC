'use client'

import { useEffect, useRef } from 'react'
import { CircleCheck, Info, Lock, LockOpen, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSubject, isRequirementMet, statusLabels, type Subject } from '@/lib/subjects'

type CorrelativesPanelProps = {
  subject: Subject | null
  open: boolean
  onClose: () => void
}

export function CorrelativesPanel({ subject, open, onClose }: CorrelativesPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  const requirements = subject?.requires ?? []
  const missing = requirements.filter((r) => !isRequirementMet(r))
  const met = requirements.filter((r) => isRequirementMet(r))
  const progress = requirements.length ? Math.round((met.length / requirements.length) * 100) : 0

  return (
    <div className={cn('fixed inset-0 z-50', !open && 'pointer-events-none')} inert={!open}>
      <div
        className={cn(
          'absolute inset-0 bg-foreground/20 backdrop-blur-[2px] transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-card shadow-2xl transition-transform duration-300 ease-out sm:rounded-l-3xl',
          open ? 'translate-x-0' : 'translate-x-[110%]',
        )}
      >
        {subject && (
          <>
            <header className="flex items-start justify-between gap-4 border-b border-border p-6">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-locked">
                  <Lock className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {subject.code} · Año {subject.year}
                  </p>
                  <h2 id="panel-title" className="mt-0.5 text-pretty text-lg font-semibold leading-snug">
                    {subject.name}
                  </h2>
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                <X className="size-5" aria-hidden="true" />
                <span className="sr-only">Cerrar panel</span>
              </button>
            </header>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
              <div className="flex gap-3 rounded-2xl bg-accent p-4 text-sm text-accent-foreground">
                <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <p className="leading-relaxed">
                  Para inscribirte en esta materia necesitás cumplir{' '}
                  <strong className="font-semibold">
                    {missing.length} {missing.length === 1 ? 'correlativa más' : 'correlativas más'}
                  </strong>
                  .
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">Requisitos cumplidos</span>
                  <span className="tabular-nums text-muted-foreground">
                    {met.length}/{requirements.length}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-approved transition-all duration-700"
                    style={{ width: open ? `${progress}%` : '0%' }}
                  />
                </div>
              </div>

              <section aria-labelledby="missing-heading" className="flex flex-col gap-3">
                <h3 id="missing-heading" className="text-sm font-semibold">
                  Correlativas faltantes
                </h3>
                <ul className="flex flex-col gap-2">
                  {missing.map((req, i) => {
                    const s = getSubject(req.id)
                    if (!s) return null
                    return (
                      <li
                        key={req.id}
                        className={cn(
                          'flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-sm',
                          open ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0',
                        )}
                        style={{ transitionDelay: open ? `${150 + i * 70}ms` : '0ms' }}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{s.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Necesitás tenerla{' '}
                            <span className="font-medium text-foreground">
                              {req.need === 'approved' ? 'aprobada' : 'regularizada'}
                            </span>
                          </p>
                        </div>
                        <StatusPill status={s.status} />
                      </li>
                    )
                  })}
                </ul>
              </section>

              {met.length > 0 && (
                <section aria-labelledby="met-heading" className="flex flex-col gap-3">
                  <h3 id="met-heading" className="text-sm font-semibold">
                    Ya cumplidas
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {met.map((req) => {
                      const s = getSubject(req.id)
                      if (!s) return null
                      return (
                        <li key={req.id} className="flex items-center gap-3 rounded-2xl bg-approved/[0.07] p-3 text-sm">
                          <CircleCheck className="size-4 shrink-0 text-approved" aria-hidden="true" />
                          <span className="truncate">{s.name}</span>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )}
            </div>

            <footer className="border-t border-border p-6">
              <button
                type="button"
                onClick={onClose}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-px hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <LockOpen className="size-4" aria-hidden="true" />
                Entendido
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: Subject['status'] }) {
  const map = {
    approved: 'bg-approved/12 text-approved',
    regular: 'bg-regular/12 text-regular',
    'in-progress': 'bg-progress/20 text-progress-foreground',
    locked: 'bg-locked/12 text-locked',
  } as const
  return (
    <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium', map[status])}>
      {statusLabels[status]}
    </span>
  )
}
