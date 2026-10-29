'use client'

import { useCallback, useState } from 'react'
import { CalendarDays, CalendarRange, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import { statusLabels, subjects, type Subject, type SubjectStatus } from '@/lib/subjects'
import { YearSection } from './year-section'
import { CorrelativesPanel } from './correlatives-panel'
import { CalendarView } from './calendar/calendar-view'

type Filter = 'all' | SubjectStatus
type View = 'plan' | 'calendar'

const views = [
  { value: 'plan', label: 'Plan de estudios', icon: LayoutGrid },
  { value: 'calendar', label: 'Calendario', icon: CalendarRange },
] as const satisfies readonly { value: View; label: string; icon: typeof LayoutGrid }[]

const filters: { value: Filter; dot?: string }[] = [
  { value: 'all' },
  { value: 'approved', dot: 'bg-approved' },
  { value: 'regular', dot: 'bg-regular' },
  { value: 'in-progress', dot: 'bg-progress' },
  { value: 'locked', dot: 'bg-locked' },
]

const years = Array.from(new Set(subjects.map((s) => s.year))).sort()

export function SubjectsBoard() {
  const [view, setView] = useState<View>('plan')
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Subject | null>(null)
  const [open, setOpen] = useState(false)

  const handleSelect = useCallback((subject: Subject) => {
    setSelected(subject)
    setOpen(true)
  }, [])
  const handleClose = useCallback(() => setOpen(false), [])

  return (
    <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
      <header className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="size-4" aria-hidden="true" />
              Ciclo lectivo 2026 · 2do cuatrimestre
            </p>
            <h1 className="mt-1 text-balance text-3xl font-semibold tracking-tight">Hola, Lucía</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {view === 'plan'
                ? 'Este es tu plan de estudios. Tocá una materia bloqueada para ver qué te falta.'
                : 'Organizá tus parciales, entregas de TP y recordatorios.'}
            </p>
          </div>

          <div role="tablist" aria-label="Vista" className="flex rounded-2xl border border-border bg-card p-1 shadow-sm">
            {views.map(({ value, label, icon: Icon }) => {
              const active = view === value
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setView(value)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {view === 'plan' && (
        <div role="group" aria-label="Filtrar materias por estado" className="flex flex-wrap gap-2">
          {filters.map(({ value, dot }) => {
            const active = filter === value
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(value)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                  active
                    ? 'border-foreground bg-foreground text-background shadow-sm'
                    : 'border-border bg-card text-foreground hover:-translate-y-px hover:shadow-sm',
                )}
              >
                {dot && <span className={cn('size-2 rounded-full', dot)} aria-hidden="true" />}
                {value === 'all' ? 'Todas' : statusLabels[value]}
              </button>
            )
          })}
        </div>
        )}
      </header>

      {view === 'calendar' ? (
        <div className="mt-8">
          <CalendarView />
        </div>
      ) : (
      <div className="mt-10 flex flex-col gap-12">
        {years.map((year) => {
          const inYear = subjects.filter((s) => s.year === year)
          const visible = filter === 'all' ? inYear : inYear.filter((s) => s.status === filter)
          return (
            <YearSection
              key={year}
              year={year}
              subjects={visible}
              totalInYear={inYear.length}
              approvedInYear={inYear.filter((s) => s.status === 'approved').length}
              onSelectLocked={handleSelect}
            />
          )
        })}
      </div>
      )}

      <CorrelativesPanel subject={selected} open={open} onClose={handleClose} />
    </main>
  )
}
