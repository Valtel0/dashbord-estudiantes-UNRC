import type { Subject } from '@/lib/subjects'
import { SubjectCard } from './subject-card'

type YearSectionProps = {
  year: number
  subjects: Subject[]
  totalInYear: number
  approvedInYear: number
  onSelectLocked: (subject: Subject) => void
}

export function YearSection({ year, subjects, totalInYear, approvedInYear, onSelectLocked }: YearSectionProps) {
  const percent = Math.round((approvedInYear / totalInYear) * 100)

  return (
    <section aria-labelledby={`year-${year}`} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-card text-sm font-semibold shadow-sm ring-1 ring-border">
            {year}
          </span>
          <div>
            <h2 id={`year-${year}`} className="text-lg font-semibold tracking-tight">
              Año {year}
            </h2>
            <p className="text-xs text-muted-foreground">
              {approvedInYear} de {totalInYear} materias aprobadas
            </p>
          </div>
        </div>
        <div className="flex w-40 items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${percent}%` }} />
          </div>
          <span className="w-9 text-right text-xs font-medium tabular-nums text-muted-foreground">{percent}%</span>
        </div>
      </div>

      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} onSelectLocked={onSelectLocked} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No hay materias con este estado en el Año {year}.
        </p>
      )}
    </section>
  )
}
