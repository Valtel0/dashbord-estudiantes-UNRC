'use client'

import { useCallback, useMemo, useState } from 'react'
import { CalendarPlus, CalendarCheck2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  daysBetween,
  eventTypeMeta,
  eventTypes,
  parseDateKey,
  sortEvents,
  toDateKey,
  useEvents,
  type StudyEvent,
} from '@/lib/events'
import { MonthGrid } from './month-grid'
import { EventItem } from './event-item'
import { EventFormDialog } from './event-form-dialog'

function relativeLabel(days: number) {
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Mañana'
  return `En ${days} días`
}

export function CalendarView() {
  const events = useEvents()
  const [todayKey] = useState(() => toDateKey(new Date()))
  const [selectedKey, setSelectedKey] = useState(todayKey)
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<StudyEvent | null>(null)

  const eventsByDay = useMemo(() => {
    const map = new Map<string, StudyEvent[]>()
    for (const e of [...events].sort(sortEvents)) {
      const list = map.get(e.date) ?? []
      list.push(e)
      map.set(e.date, list)
    }
    return map
  }, [events])

  const upcoming = useMemo(
    () =>
      events
        .filter((e) => !e.done && e.date >= todayKey && daysBetween(todayKey, e.date) <= 30)
        .sort(sortEvents)
        .slice(0, 6),
    [events, todayKey],
  )

  const selectedEvents = eventsByDay.get(selectedKey) ?? []
  const selectedLabel = parseDateKey(selectedKey).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const handleSelectDay = useCallback((key: string) => {
    setSelectedKey(key)
    const d = parseDateKey(key)
    setMonth((m) =>
      m.getMonth() === d.getMonth() && m.getFullYear() === d.getFullYear() ? m : new Date(d.getFullYear(), d.getMonth(), 1),
    )
  }, [])

  const openNew = useCallback(() => {
    setEditing(null)
    setFormOpen(true)
  }, [])
  const openEdit = useCallback((event: StudyEvent) => {
    setEditing(event)
    setFormOpen(true)
  }, [])
  const closeForm = useCallback(() => setFormOpen(false), [])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Referencias de tipos de evento">
          {eventTypes.map((t) => (
            <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={cn('size-2.5 rounded-full', eventTypeMeta[t].dot)} aria-hidden="true" />
              {eventTypeMeta[t].label}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-px hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Plus className="size-4" aria-hidden="true" />
          Nuevo evento
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <MonthGrid
          month={month}
          todayKey={todayKey}
          selectedKey={selectedKey}
          eventsByDay={eventsByDay}
          onSelectDay={handleSelectDay}
          onChangeMonth={(delta) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1))}
          onToday={() => handleSelectDay(todayKey)}
        />

        <aside className="flex flex-col gap-6">
          <section
            aria-labelledby="day-heading"
            className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {selectedKey === todayKey ? 'Hoy' : 'Día seleccionado'}
                </p>
                <h3 id="day-heading" className="mt-0.5 text-base font-semibold first-letter:uppercase">
                  {selectedLabel}
                </h3>
              </div>
              <button
                type="button"
                onClick={openNew}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                <CalendarPlus className="size-5" aria-hidden="true" />
                <span className="sr-only">Agregar evento a este día</span>
              </button>
            </div>

            {selectedEvents.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {selectedEvents.map((e) => (
                  <EventItem key={e.id} event={e} onEdit={openEdit} />
                ))}
              </ul>
            ) : (
              <button
                type="button"
                onClick={openNew}
                className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                <CalendarPlus className="size-5" aria-hidden="true" />
                Sin eventos. Tocá para agregar uno.
              </button>
            )}
          </section>

          <section
            aria-labelledby="upcoming-heading"
            className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm"
          >
            <h3 id="upcoming-heading" className="text-base font-semibold">
              Próximos 30 días
            </h3>
            {upcoming.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {upcoming.map((e) => (
                  <EventItem
                    key={e.id}
                    event={e}
                    onEdit={openEdit}
                    meta={`${relativeLabel(daysBetween(todayKey, e.date))} · ${parseDateKey(e.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}`}
                  />
                ))}
              </ul>
            ) : (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarCheck2 className="size-4" aria-hidden="true" />
                No tenés nada pendiente. ¡A descansar!
              </p>
            )}
          </section>
        </aside>
      </div>

      <EventFormDialog open={formOpen} defaultDate={selectedKey} editing={editing} onClose={closeForm} />
    </div>
  )
}
