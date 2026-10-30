'use client'

import { useState } from 'react'
import { subjectActions, useSubjects } from '@/lib/subjects'
import { Plus, X } from 'lucide-react'

export function AddSubjectModal() {
  const [status, setStatus] = useState<'approved' | 'regular' | 'in-progress' | 'available' | 'locked'>('available')
  const [grade, setGrade] = useState<number | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(false)
  const subjects = useSubjects()
  
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [year, setYear] = useState(1)
  const [semester, setSemester] = useState<'1C' | '2C' | 'Anual'>('1C')
  const [hours, setHours] = useState(96)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const newSub = {
      id: crypto.randomUUID(),
      code: code || `MAT-${Math.floor(Math.random() * 900 + 100)}`,
      name,
      year: Number(year),
      semester,
      hours: Number(hours),
      status,
      grade: status === 'approved' ? grade : undefined,
      requires: [],
    }

    subjectActions.addSubject(newSub)
    setName('')
    setCode('')
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
      >
        <Plus className="size-4" />
        Agregar Materia al Plan
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Agregar nueva materia</h2>
              <button onClick={() => setIsOpen(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Nombre de la materia</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Análisis Matemático I"
                  required
                  className="mt-1 w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Condición actual</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="available">Habilitada / Pendiente</option>
                  <option value="approved">Aprobada</option>
                  <option value="regular">Regular</option>
                  <option value="in-progress">Cursando</option>
                </select>
              </div>

              {status === 'approved' && (
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Nota obtenida</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={grade || ''}
                    onChange={(e) => setGrade(Number(e.target.value))}
                    placeholder="Ej: 8"
                    className="mt-1 w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Código (Opcional)</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ej: MAT-101"
                    className="mt-1 w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Año de la carrera</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    {[1, 2, 3, 4, 5].map((y) => (
                      <option key={y} value={y}>{y}° Año</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Cursado</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value as any)}
                    className="mt-1 w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="1C">1er Cuatrimestre</option>
                    <option value="2C">2do Cuatrimestre</option>
                    <option value="Anual">Anual</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Carga horaria (hs)</label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border bg-background px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Guardar Materia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}