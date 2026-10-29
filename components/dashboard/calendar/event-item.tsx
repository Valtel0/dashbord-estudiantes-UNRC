'use client'

import { Check, Clock, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSubject } from '@/lib/subjects'
import { eventTypeMeta, eventsActions, type StudyEvent } from '@/lib/events'

type EventItemProps = {
  event: StudyEvent
  onEdit: (event: StudyEvent) => void
  meta?: string
}

export function EventItem({ event, onEdit, meta }: EventItemProps) {
  const type = eventTypeMeta[event.type]
  const subject = event.subjectId ? getSubject(event.subjectId) : undefined

  return (
    <li
      className={cn(
        'group flex items-start gap-3 rounded-2xl border border-border bg-background p-3 transition-all duration-200 hover:-translate-y-px hover:shadow-sm',
        event.done && 'opacity-60',
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={!!event.done}
        onClick={() => eventsActions.toggleDone(event.id)}
        className={cn(
          'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
          event.done ? 'border-approved bg-approved text-primary-foreground' : type.ring,
        )}
      >
        {event.done && <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />}
        <span className="sr-only">{event.done ? 'Marcar como pendiente' : 'Marcar como hecho'}</span>
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', type.chip)}>{type.label}</span>
          {meta && <span className="text-[11px] font-medium text-muted-foreground">{meta}</span>}
        </div>
        <p className={cn('mt-1 text-pretty text-sm font-medium leading-snug', event.done && 'line-through')}>
          {event.title}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
          {event.time && (
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Clock className="size-3" aria-hidden="true" />
              {event.time}
            </span>
          )}
          {subject && <span className="truncate">{subject.name}</span>}
        </p>
        {event.notes && <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{event.notes}</p>}
      </div>

      <div className="flex shrink-0 gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(event)}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Pencil className="size-3.5" aria-hidden="true" />
          <span className="sr-only">Editar {event.title}</span>
        </button>
        <button
          type="button"
          onClick={() => eventsActions.remove(event.id)}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          <span className="sr-only">Eliminar {event.title}</span>
        </button>
      </div>
    </li>
  )
}
