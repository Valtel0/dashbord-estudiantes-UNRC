'use client'

import { useEffect, useRef, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { subjects } from '@/lib/subjects'
import { eventTypeMeta, eventTypes, eventsActions, type EventType, type StudyEvent } from '@/lib/events'

type EventFormDialogProps = {
  open: boolean
  defaultDate: string
  editing: StudyEvent | null
  onClose: () => void
}

const selectableSubjects = subjects.filter((s) => s.status !== 'locked')

const fieldClass =
  'w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30'

export function EventFormDialog({ open, defaultDate, editing, onClose }: EventFormDialogProps) {
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    titleRef.current?.focus()
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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const title = String(data.get('title') ?? '').trim().slice(0, 120)
    const date = String(data.get('date') ?? '')
    if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return

    const rawType = String(data.get('type'))
    const type: EventType = eventTypes.includes(rawType as EventType) ? (rawType as EventType) : 'reminder'
    const time = String(data.get('time') ?? '')
    const subjectId = String(data.get('subjectId') ?? '')
    const notes = String(data.get('notes') ?? '').trim().slice(0, 500)

    const input = {
      title,
      type,
      date,
      time: /^\d{2}:\d{2}$/.test(time) ? time : undefined,
      subjectId: selectableSubjects.some((s) => s.id === subjectId) ? subjectId : undefined,
      notes: notes || undefined,
      done: editing?.done,
    }

    if (editing) eventsActions.edit(editing.id, input)
    else eventsActions.add(input)
    onClose()
  }

  return (
    <div className={cn('fixed inset-0 z-50', !open && 'pointer-events-none')} inert={!open}>
      <div
        className={cn(
          'absolute inset-0 bg-foreground/20 backdrop-blur-[2px] transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />

      <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-0 sm:items-center sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-form-title"
          className={cn(
            'pointer-events-auto flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-3xl bg-card shadow-2xl transition-all duration-300 ease-out sm:rounded-3xl',
            open ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-8 opacity-0 sm:scale-95',
          )}
        >
          {open && (
            <form
              key={editing?.id ?? `new-${defaultDate}`}
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
                <h2 id="event-form-title" className="text-lg font-semibold">
                  {editing ? 'Editar evento' : 'Nuevo evento'}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <X className="size-5" aria-hidden="true" />
                  <span className="sr-only">Cerrar</span>
                </button>
              </header>

              <div className="flex flex-col gap-5 overflow-y-auto px-6 py-5">
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-sm font-medium">Tipo</legend>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {eventTypes.map((t) => (
                      <label key={t} className="cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value={t}
                          defaultChecked={(editing?.type ?? 'exam') === t}
                          className="peer sr-only"
                        />
                        <span className="flex items-center justify-center gap-1.5 rounded-xl border border-border px-2 py-2 text-xs font-medium transition-all hover:-translate-y-px hover:shadow-sm peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring">
                          <span className={cn('size-2 rounded-full', eventTypeMeta[t].dot)} aria-hidden="true" />
                          {eventTypeMeta[t].label}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="flex flex-col gap-2">
                  <label htmlFor="event-title" className="text-sm font-medium">
                    Título
                  </label>
                  <input
                    ref={titleRef}
                    id="event-title"
                    name="title"
                    required
                    maxLength={120}
                    defaultValue={editing?.title}
                    placeholder="Ej: Primer parcial, Entrega TP 2..."
                    className={fieldClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="event-subject" className="text-sm font-medium">
                    Materia <span className="font-normal text-muted-foreground">(opcional)</span>
                  </label>
                  <select
                    id="event-subject"
                    name="subjectId"
                    defaultValue={editing?.subjectId ?? ''}
                    className={fieldClass}
                  >
                    <option value="">Sin materia</option>
                    {selectableSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="event-date" className="text-sm font-medium">
                      Fecha
                    </label>
                    <input
                      id="event-date"
                      name="date"
                      type="date"
                      required
                      defaultValue={editing?.date ?? defaultDate}
                      className={fieldClass}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="event-time" className="text-sm font-medium">
                      Hora <span className="font-normal text-muted-foreground">(opcional)</span>
                    </label>
                    <input
                      id="event-time"
                      name="time"
                      type="time"
                      defaultValue={editing?.time}
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="event-notes" className="text-sm font-medium">
                    Notas <span className="font-normal text-muted-foreground">(opcional)</span>
                  </label>
                  <textarea
                    id="event-notes"
                    name="notes"
                    rows={3}
                    maxLength={500}
                    defaultValue={editing?.notes}
                    placeholder="Temas, aula, materiales..."
                    className={cn(fieldClass, 'resize-none')}
                  />
                </div>
              </div>

              <footer className="flex gap-3 border-t border-border px-6 py-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-all hover:-translate-y-px hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-px hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {editing ? 'Guardar cambios' : 'Agregar evento'}
                </button>
              </footer>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
