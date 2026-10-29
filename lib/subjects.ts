'use client'

import { useSyncExternalStore } from 'react'

export type SubjectStatus = 'approved' | 'regular' | 'in-progress' | 'locked'

export type Requirement = {
  id: string
  need: 'approved' | 'regular'
}

export type Subject = {
  id: string
  code: string
  name: string
  year: number
  semester: '1C' | '2C' | 'Anual'
  hours: number
  status: SubjectStatus
  grade?: number
  requires: Requirement[]
}

export const statusLabels: Record<SubjectStatus, string> = {
  approved: 'Aprobada',
  regular: 'Regular',
  'in-progress': 'Cursando',
  locked: 'Bloqueada',
}

const initialSubjects: Subject[] = [
  { id: 'am1', code: 'MAT-101', name: 'Análisis Matemático I', year: 1, semester: 'Anual', hours: 5, status: 'approved', grade: 8, requires: [] },
  { id: 'alg', code: 'MAT-102', name: 'Álgebra y Geometría Analítica', year: 1, semester: 'Anual', hours: 5, status: 'approved', grade: 9, requires: [] },
  { id: 'syo', code: 'SIS-101', name: 'Sistemas y Organizaciones', year: 1, semester: '1C', hours: 3, status: 'approved', grade: 7, requires: [] },
  { id: 'aed', code: 'PRO-101', name: 'Algoritmos y Estructuras de Datos', year: 1, semester: 'Anual', hours: 5, status: 'approved', grade: 8, requires: [] },
  { id: 'md', code: 'MAT-103', name: 'Matemática Discreta', year: 1, semester: '2C', hours: 3, status: 'approved', grade: 9, requires: [] },
  { id: 'fis1', code: 'FIS-101', name: 'Física I', year: 1, semester: 'Anual', hours: 5, status: 'regular', requires: [] },
  { id: 'ing1', code: 'IDI-101', name: 'Inglés I', year: 1, semester: '1C', hours: 2, status: 'approved', grade: 10, requires: [] },

  { id: 'am2', code: 'MAT-201', name: 'Análisis Matemático II', year: 2, semester: 'Anual', hours: 5, status: 'approved', grade: 7, requires: [{ id: 'am1', need: 'approved' }, { id: 'alg', need: 'approved' }] },
  { id: 'pdp', code: 'PRO-201', name: 'Paradigmas de Programación', year: 2, semester: '1C', hours: 4, status: 'approved', grade: 8, requires: [{ id: 'aed', need: 'approved' }, { id: 'md', need: 'approved' }] },
  { id: 'ssl', code: 'PRO-202', name: 'Sintaxis y Semántica de los Lenguajes', year: 2, semester: '2C', hours: 4, status: 'approved', grade: 9, requires: [{ id: 'aed', need: 'approved' }, { id: 'md', need: 'approved' }] },
  { id: 'fis2', code: 'FIS-201', name: 'Física II', year: 2, semester: 'Anual', hours: 5, status: 'in-progress', requires: [{ id: 'fis1', need: 'regular' }, { id: 'am1', need: 'approved' }] },
  { id: 'pye', code: 'MAT-202', name: 'Probabilidad y Estadística', year: 2, semester: '2C', hours: 3, status: 'in-progress', requires: [{ id: 'am1', need: 'approved' }, { id: 'alg', need: 'approved' }] },
  { id: 'arq', code: 'SIS-201', name: 'Arquitectura de Computadoras', year: 2, semester: '1C', hours: 4, status: 'regular', requires: [{ id: 'syo', need: 'approved' }] },
  { id: 'ads', code: 'SIS-202', name: 'Análisis de Sistemas', year: 2, semester: 'Anual', hours: 5, status: 'in-progress', requires: [{ id: 'syo', need: 'approved' }, { id: 'aed', need: 'approved' }] },

  { id: 'dds', code: 'SIS-301', name: 'Diseño de Sistemas', year: 3, semester: 'Anual', hours: 5, status: 'locked', requires: [{ id: 'ads', need: 'approved' }, { id: 'pdp', need: 'approved' }] },
  { id: 'so', code: 'SIS-302', name: 'Sistemas Operativos', year: 3, semester: '1C', hours: 4, status: 'locked', requires: [{ id: 'arq', need: 'approved' }, { id: 'aed', need: 'approved' }] },
  { id: 'gdd', code: 'PRO-301', name: 'Gestión de Datos', year: 3, semester: '2C', hours: 4, status: 'locked', requires: [{ id: 'ads', need: 'regular' }, { id: 'ssl', need: 'approved' }, { id: 'pdp', need: 'approved' }] },
  { id: 'com', code: 'SIS-303', name: 'Comunicaciones', year: 3, semester: '2C', hours: 4, status: 'locked', requires: [{ id: 'fis2', need: 'approved' }, { id: 'arq', need: 'regular' }] },
  { id: 'msup', code: 'MAT-301', name: 'Matemática Superior', year: 3, semester: '1C', hours: 3, status: 'locked', requires: [{ id: 'am2', need: 'approved' }, { id: 'pye', need: 'approved' }] },
  { id: 'eco', code: 'ECO-301', name: 'Economía', year: 3, semester: '2C', hours: 3, status: 'locked', requires: [{ id: 'ads', need: 'approved' }, { id: 'pye', need: 'regular' }] },
]

// Exportamos 'subjects' para mantener compatibilidad con todos los componentes de v0
export const subjects: Subject[] = initialSubjects

const STORAGE_KEY = 'unidash:subjects:v1'
const EMPTY: Subject[] = []
const listeners = new Set<() => void>()
let cache: Subject[] | null = null

function persist(subjectsList: Subject[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(subjectsList))
  } catch {
    // Si el almacenamiento falla o está desactivado
  }
}

function getSnapshot(): Subject[] {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      cache = Array.isArray(parsed) ? (parsed as Subject[]) : initialSubjects
    } else {
      cache = initialSubjects
      persist(cache)
    }
  } catch {
    cache = initialSubjects
  }
  return cache
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return
    cache = null
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function update(updater: (subjectsList: Subject[]) => Subject[]) {
  cache = updater(getSnapshot())
  persist(cache)
  listeners.forEach((l) => l())
}

export function useSubjects() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY)
}

export function getSubject(id: string) {
  return getSnapshot().find((s) => s.id === id)
}

export function isRequirementMet(req: Requirement) {
  const subject = getSubject(req.id)
  if (!subject) return false
  if (req.need === 'approved') return subject.status === 'approved'
  return subject.status === 'approved' || subject.status === 'regular'
}

export function getStats() {
  const currentSubjects = typeof window !== 'undefined' ? getSnapshot() : initialSubjects
  const total = currentSubjects.length
  const approved = currentSubjects.filter((s) => s.status === 'approved')
  const grades = approved.map((s) => s.grade ?? 0)
  const average = grades.length ? grades.reduce((a, b) => a + b, 0) / grades.length : 0
  return {
    total,
    approved: approved.length,
    regular: currentSubjects.filter((s) => s.status === 'regular').length,
    inProgress: currentSubjects.filter((s) => s.status === 'in-progress').length,
    locked: currentSubjects.filter((s) => s.status === 'locked').length,
    average,
    bestGrade: grades.length ? Math.max(...grades) : 0,
    percent: total ? Math.round((approved.length / total) * 100) : 0,
  }
}

export const subjectActions = {
  updateStatus(id: string, status: SubjectStatus, grade?: number) {
    update((currentSubjects) =>
      currentSubjects.map((s) => (s.id === id ? { ...s, status, grade: grade ?? s.grade } : s))
    )
  },
}