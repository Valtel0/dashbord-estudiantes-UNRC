'use client'

import { useUser, userActions } from '@/lib/user'
import { StudentSidebar } from '@/components/dashboard/student-sidebar'
import { SubjectsBoard } from '@/components/dashboard/subjects-board'
import { useState } from 'react'

export default function Page() {
  const user = useUser()
  const [name, setName] = useState('')
  const [career, setCareer] = useState('')
  const [studentId, setStudentId] = useState('')

  if (!user.isSetUp) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg">
          <h1 className="text-2xl font-bold tracking-tight">¡Bienvenido a UniDash!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Configura tus datos para personalizar tu panel y comenzar a gestionar tu carrera.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!name.trim() || !career.trim()) return
              userActions.saveProfile({
                name,
                career,
                studentId: studentId || 'S/N',
              })
            }}
            className="mt-6 flex flex-col gap-4"
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground">Tu Nombre y Apellido</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Lucía Fernández"
                required
                className="mt-1 w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Carrera</label>
              <input
                type="text"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                placeholder="Ej: Lic. en Cs. de la Computación"
                required
                className="mt-1 w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground">Legajo / ID (Opcional)</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Ej: 178.402"
                className="mt-1 w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              className="mt-2 rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
            >
              Ingresar al Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background lg:flex-row">
      <StudentSidebar />
      <SubjectsBoard />
    </div>
  )
}