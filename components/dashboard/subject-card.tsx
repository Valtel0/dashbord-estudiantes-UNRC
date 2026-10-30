'use client'

import { BookOpen, ChevronRight, CircleCheck, Clock, Lock, Unlock, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isRequirementMet, statusLabels, subjectActions, type Subject, type SubjectStatus } from '@/lib/subjects'

const statusStyles: Record<SubjectStatus, { card: string; bar: string; badge: string; icon: typeof Lock }> = {
  approved: {
    card: 'border-approved/25 bg-approved/[0.06] hover:border-approved/50 hover:shadow-approved/10',
    bar: 'bg-approved',
    badge: 'bg-approved/12 text-approved',
    icon: CircleCheck,
  },
  regular: {
    card: 'border-regular/25 bg-regular/[0.06] hover:border-regular/50 hover:shadow-regular/10',
    bar: 'bg-regular',
    badge: 'bg-regular/12 text-regular',
    icon: BookOpen,
  },
  'in-progress': {
    card: 'border-progress/40 bg-progress/[0.09] hover:border-progress/70 hover:shadow-progress/15',
    bar: 'bg-progress',
    badge: 'bg-progress/20 text-progress-foreground',
    icon: Clock,
  },
  available: {
    card: 'border-sky-500/30 bg-sky-500/[0.06] hover:border-sky-500/60 hover:shadow-sky-500/10',
    bar: 'bg-sky-500',
    badge: 'bg-sky-500/12 text-sky-600 dark:text-sky-400',
    icon: Unlock,
  },
  locked: {
    card: 'border-dashed border-border bg-muted/70 opacity-75 hover:opacity-100 hover:border-locked/50',
    bar: 'bg-locked/40',
    badge: 'bg-locked/12 text-locked',
    icon: Lock,
  },
}

type SubjectCardProps = {
  subject: Subject
  onSelectLocked: (subject: Subject) => void
}

export function SubjectCard({ subject, onSelectLocked }: SubjectCardProps) {
  const styles = statusStyles[subject.status] || statusStyles.locked
  const Icon = styles.icon
  const isLocked = subject.status === 'locked'
  const missing = subject.requires.filter((r) => !isRequirementMet(r)).length

  // Función para cambiar de estado cíclicamente o mediante selector
  const handleStatusChange = (newStatus: SubjectStatus) => {
    let grade = subject.grade
    if (newStatus === 'approved' && grade === undefined) {
      grade = 0 // Nota por defecto al marcar aprobada rápidamente
    }
    subjectActions.updateStatus(subject.id, newStatus, grade)
  }

  const content = (
    <>
      <span className={cn('absolute inset-y-4 left-0 w-1 rounded-r-full', styles.bar)} aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[11px] font-medium tracking-wide text-muted-foreground">{subject.code}</span>
        
        {/* Selector rápido de estado en la insignia */}
        <div className="flex items-center gap-1.5">
          <select
            value={subject.status}
            onChange={(e) => handleStatusChange(e.target.value as SubjectStatus)}
            onClick={(e) => e.stopPropagation()}
            className={cn('cursor-pointer rounded-full px-2 py-0.5 text-[11px] font-medium border-0 outline-none', styles.badge)}
          >
            <option value="available" className="bg-card text-foreground">Habilitada</option>
            <option value="approved" className="bg-card text-foreground">Aprobada</option>
            <option value="regular" className="bg-card text-foreground">Regular</option>
            <option value="in-progress" className="bg-card text-foreground">Cursando</option>
            {/* <option value="locked" className="bg-card text-foreground">Bloqueada</option> */}
          </select>

          {/* Botón para eliminar materia */}
          <button
            type="button"
            title="Eliminar materia"
            onClick={(e) => {
              e.stopPropagation()
              if (confirm(`¿Querés eliminar la materia "${subject.name}"?`)) {
                subjectActions.removeSubject(subject.id)
              }
            }}
            className="rounded-lg p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      <h3 className={cn('mt-3 text-pretty text-[15px] font-semibold leading-snug', isLocked && 'text-muted-foreground')}>
        {subject.name}
      </h3>

      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
        <span>
          {subject.semester === 'Anual' ? 'Anual' : `${subject.semester === '1C' ? '1er' : '2do'} cuatrimestre`} · {subject.hours} hs
        </span>

        {subject.status === 'approved' && (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <span className="font-medium text-muted-foreground">Nota:</span>
            <input
              type="number"
              min="1"
              max="10"
              value={subject.grade ?? ''}
              onChange={(e) => {
                const newGrade = e.target.value ? Number(e.target.value) : undefined
                subjectActions.updateStatus(subject.id, 'approved', newGrade)
              }}
              placeholder="S/N"
              className="w-12 rounded-md border bg-card px-1.5 py-0.5 text-center text-sm font-semibold text-foreground shadow-xs outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        )}

        {isLocked && (
          <span className="flex items-center gap-0.5 font-medium text-foreground/70 transition-transform group-hover:translate-x-0.5">
            Faltan {missing}
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </span>
        )}
      </div>
    </>
  )

  const base = cn(
    'group relative flex min-h-36 flex-col overflow-hidden rounded-2xl border p-4 pl-5 text-left shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg',
    styles.card,
  )

  if (isLocked) {
    return (
      <div className={base}>
        {content}
      </div>
    )
  }

  return <article className={base}>{content}</article>
}