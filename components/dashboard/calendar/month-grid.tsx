'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { eventTypeMeta, getMonthMatrix, toDateKey, type StudyEvent } from '@/lib/events'

const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

type MonthGridProps = {
  month: Date
  todayKey: string
  selectedKey: string
  eventsByDay: Map<string, StudyEvent[]>
  onSelectDay: (key: string) => void
  onChangeMonth: (delta: number) => void
  onToday: () => void
}

export function MonthGrid({
  month,
  todayKey,
  selectedKey,
  eventsByDay,
  onSelectDay,
  onChangeMonth,
  onToday,
}: MonthGridProps) {
  const days = getMonthMatrix(month.getFullYear(), month.getMonth())
  const monthLabel = month.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })

  return (
    <section
      aria-label="Calendario mensual"
      className="flex flex-col rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight first-letter:uppercase" aria-live="polite">
          {monthLabel}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToday}
            className="mr-1 rounded-full border border-border px-3 py-1.5 text-sm font-medium transition-all hover:-translate-y-px hover:shadow-sm focus-visible:outline-2 focus-visible:outline-ring"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => onChangeMonth(-1)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
            <span className="sr-only">Mes anterior</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeMonth(1)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
            <span className="sr-only">Mes siguiente</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 pb-2" aria-hidden="true">
        {weekdays.map((d) => (
          <span key={d} className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const key = toDateKey(day)
          const inMonth = day.getMonth() === month.getMonth()
          const isToday = key === todayKey
          const isSelected = key === selectedKey
          const dayEvents = eventsByDay.get(key) ?? []
          const pending = dayEvents.filter((e) => !e.done)
          const label = day.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectDay(key)}
              aria-pressed={isSelected}
              aria-label={`${label}${dayEvents.length ? `, ${dayEvents.length} ${dayEvents.length === 1 ? 'evento' : 'eventos'}` : ''}`}
              className={cn(
                'group flex min-h-16 flex-col items-stretch gap-1 rounded-xl border p-1.5 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring sm:min-h-24 sm:p-2',
                isSelected
                  ? 'border-primary/40 bg-accent shadow-sm'
                  : 'border-transparent hover:-translate-y-px hover:border-border hover:bg-secondary/60 hover:shadow-sm',
                !inMonth && 'opacity-40',
              )}
            >
              <span
                className={cn(
                  'flex size-7 items-center justify-center self-start rounded-full text-sm tabular-nums',
                  isToday ? 'bg-primary font-semibold text-primary-foreground' : 'font-medium',
                )}
              >
                {day.getDate()}
              </span>

              <span className="flex gap-1 sm:hidden">
                {pending.slice(0, 3).map((e) => (
                  <span key={e.id} className={cn('size-1.5 rounded-full', eventTypeMeta[e.type].dot)} />
                ))}
              </span>

              <span className="hidden flex-col gap-1 sm:flex">
                {dayEvents.slice(0, 2).map((e) => (
                  <span
                    key={e.id}
                    className={cn(
                      'truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium',
                      eventTypeMeta[e.type].chip,
                      e.done && 'line-through opacity-50',
                    )}
                  >
                    {e.title}
                  </span>
                ))}
                {dayEvents.length > 2 && (
                  <span className="px-1.5 text-[11px] text-muted-foreground">+{dayEvents.length - 2} más</span>
                )}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
