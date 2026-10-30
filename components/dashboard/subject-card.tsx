import { BookOpen, ChevronRight, CircleCheck, Clock, Lock, Unlock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isRequirementMet, statusLabels, type Subject, type SubjectStatus } from '@/lib/subjects'

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

  const content = (
    <>
      <span className={cn('absolute inset-y-4 left-0 w-1 rounded-r-full', styles.bar)} aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[11px] font-medium tracking-wide text-muted-foreground">{subject.code}</span>
        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium', styles.badge)}>
          <Icon className="size-3" aria-hidden="true" />
          {statusLabels[subject.status]}
        </span>
      </div>

      <h3 className={cn('mt-3 text-pretty text-[15px] font-semibold leading-snug', isLocked && 'text-muted-foreground')}>
        {subject.name}
      </h3>

      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
        <span>
          {subject.semester === 'Anual' ? 'Anual' : `${subject.semester === '1C' ? '1er' : '2do'} cuatrimestre`} · {subject.hours} hs
        </span>
        {subject.status === 'approved' && subject.grade !== undefined && (
          <span className="rounded-md bg-card px-2 py-0.5 text-sm font-semibold text-foreground shadow-xs">
            {subject.grade}
          </span>
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
      <button
        type="button"
        onClick={() => onSelectLocked(subject)}
        className={cn(base, 'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring')}
        aria-label={`${subject.name}: bloqueada. Ver correlativas faltantes`}
      >
        {content}
      </button>
    )
  }

  return <article className={base}>{content}</article>
}