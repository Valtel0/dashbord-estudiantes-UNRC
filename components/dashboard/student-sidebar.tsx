'use client'
import { useUser } from '@/lib/user'
import { Award, BookOpen, CircleCheck, Clock, GraduationCap, Lock, TrendingUp } from 'lucide-react'
import { getStats } from '@/lib/subjects'
import { ProgressRing } from './progress-ring'

export function StudentSidebar() {
  const stats = getStats()
  const user = useUser()

  const breakdown = [
    { label: 'Aprobadas', value: stats.approved, icon: CircleCheck, className: 'bg-approved/12 text-approved' },
    { label: 'Regulares', value: stats.regular, icon: BookOpen, className: 'bg-regular/12 text-regular' },
    { label: 'Cursando', value: stats.inProgress, icon: Clock, className: 'bg-progress/18 text-progress-foreground' },
    { label: 'Bloqueadas', value: stats.locked, icon: Lock, className: 'bg-muted text-locked' },
  ]

  return (
    <aside className="flex flex-col gap-6 border-b border-sidebar-border bg-sidebar p-6 lg:sticky lg:top-0 lg:h-dvh lg:w-80 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <GraduationCap className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">Campus</p>
          <p className="text-xs text-muted-foreground">{user.career}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-secondary p-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          LM
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">Legajo, {user.studentId}</p>
        </div>
      </div>

      <section aria-labelledby="progress-heading" className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 id="progress-heading" className="self-start text-sm font-medium text-muted-foreground">
          Progreso de la carrera
        </h2>
        <ProgressRing percent={stats.percent} />
        <p className="text-center text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{stats.approved}</span> de {stats.total} materias aprobadas
        </p>
      </section>

      <section aria-label="Estadísticas" className="grid grid-cols-2 gap-3">
        <div className="col-span-2 flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Promedio general</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{stats.average.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-approved/12 px-2.5 py-1 text-xs font-medium text-approved">
            <TrendingUp className="size-3.5" aria-hidden="true" />
            +0.4
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Award className="size-4 text-primary" aria-hidden="true" />
          <p className="mt-2 text-xl font-semibold">{stats.bestGrade}</p>
          <p className="text-xs text-muted-foreground">Mejor nota</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Clock className="size-4 text-primary" aria-hidden="true" />
          <p className="mt-2 text-xl font-semibold">{stats.inProgress}</p>
          <p className="text-xs text-muted-foreground">En curso</p>
        </div>
      </section>

      <section aria-labelledby="breakdown-heading" className="flex flex-col gap-2">
        <h2 id="breakdown-heading" className="text-sm font-medium text-muted-foreground">
          Estado de materias
        </h2>
        <ul className="flex flex-col gap-1">
          {breakdown.map(({ label, value, icon: Icon, className }) => (
            <li key={label} className="flex items-center justify-between rounded-xl px-2 py-1.5 transition-colors hover:bg-secondary">
              <span className="flex items-center gap-2.5 text-sm">
                <span className={`flex size-7 items-center justify-center rounded-lg ${className}`}>
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                {label}
              </span>
              <span className="text-sm font-semibold tabular-nums">{value}</span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
