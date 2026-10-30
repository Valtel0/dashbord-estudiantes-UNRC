'use client'

import { useSyncExternalStore } from 'react'

export type SubjectStatus = 'approved' | 'regular' | 'in-progress' | 'available' | 'locked'

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
  requires: Requirement[]       // Correlativas para CURSAR
  requiresToExam?: Requirement[] // Correlativas para RENDIR FINAL
}

export const statusLabels: Record<SubjectStatus, string> = {
  approved: 'Aprobada',
  regular: 'Regular',
  'in-progress': 'Cursando',
  available: 'Habilitada',
  locked: 'Bloqueada',
}

// Plan 2024 - Licenciatura en Ciencias de la Computación (UNRC)
// const baseSubjects: Subject[] = [
//   // ==================== AÑO 1 ====================
//   { id: '3375', code: '3375', name: 'Introducción a los Algoritmos', year: 1, semester: '1C', hours: 112, status: 'approved', grade: 8, requires: [], requiresToExam: [] },
//   { id: '3376', code: '3376', name: 'Introducción a la Matemática', year: 1, semester: '1C', hours: 112, status: 'approved', grade: 8, requires: [], requiresToExam: [] },
//   { id: '3377', code: '3377', name: 'Lógica y Resolución de Problemas', year: 1, semester: '1C', hours: 112, status: 'approved', grade: 9, requires: [], requiresToExam: [] },
//   { id: '3378', code: '3378', name: 'Algoritmos y Estructuras de Datos I', year: 1, semester: '2C', hours: 112, status: 'approved', grade: 8, requires: [{ id: '3375', need: 'regular' }], requiresToExam: [{ id: '3375', need: 'approved' }] },
//   { id: '3379', code: '3379', name: 'Matemática Discreta', year: 1, semester: '2C', hours: 140, status: 'approved', grade: 7, requires: [{ id: '3376', need: 'regular' }], requiresToExam: [{ id: '3376', need: 'approved' }] },

//   // ==================== AÑO 2 ====================
//   { id: '3380', code: '3380', name: 'Algoritmos y Estructuras de Datos II', year: 2, semester: '1C', hours: 112, status: 'regular', requires: [{ id: '3375', need: 'approved' }, { id: '3377', need: 'regular' }, { id: '3378', need: 'regular' }, { id: '3379', need: 'regular' }], requiresToExam: [{ id: '3375', need: 'approved' }, { id: '3378', need: 'approved' }, { id: '3379', need: 'approved' }] },
//   { id: '3381', code: '3381', name: 'Organización de Computadoras', year: 2, semester: '1C', hours: 112, status: 'regular', requires: [{ id: '3375', need: 'regular' }, { id: '3376', need: 'regular' }], requiresToExam: [{ id: '3375', need: 'approved' }, { id: '3376', need: 'approved' }, { id: '3377', need: 'approved' }] },
//   { id: '3382', code: '3382', name: 'Computación y Sociedad', year: 2, semester: '1C', hours: 56, status: 'approved', grade: 9, requires: [{ id: '3375', need: 'regular' }], requiresToExam: [{ id: '3375', need: 'approved' }] },
//   { id: '3402', code: '3402', name: 'Inglés I', year: 2, semester: '1C', hours: 56, status: 'approved', grade: 8, requires: [], requiresToExam: [] },
//   { id: '3383', code: '3383', name: 'Análisis y Diseño de Algoritmos I', year: 2, semester: '2C', hours: 112, status: 'in-progress', requires: [{ id: '3378', need: 'approved' }, { id: '3380', need: 'regular' }], requiresToExam: [{ id: '3378', need: 'approved' }, { id: '3380', need: 'approved' }] },
//   { id: '3384', code: '3384', name: 'Bases de Datos', year: 2, semester: '2C', hours: 112, status: 'in-progress', requires: [{ id: '3375', need: 'approved' }, { id: '3378', need: 'regular' }], requiresToExam: [{ id: '3375', need: 'approved' }, { id: '3378', need: 'approved' }] },
//   { id: '3385', code: '3385', name: 'Ingeniería de Software I', year: 2, semester: '2C', hours: 112, status: 'in-progress', requires: [{ id: '3375', need: 'approved' }, { id: '3378', need: 'regular' }], requiresToExam: [{ id: '3375', need: 'approved' }, { id: '3378', need: 'approved' }] },
//   { id: '3403', code: '3403', name: 'Inglés II', year: 2, semester: '2C', hours: 56, status: 'available', requires: [{ id: '3402', need: 'regular' }], requiresToExam: [{ id: '3402', need: 'approved' }] },

//   // ==================== AÑO 3 ====================
//   { id: '3386', code: '3386', name: 'Paradigmas y Lenguajes de Programación', year: 3, semester: '1C', hours: 112, status: 'available', requires: [{ id: '3375', need: 'approved' }, { id: '3378', need: 'regular' }, { id: '3381', need: 'regular' }], requiresToExam: [{ id: '3375', need: 'approved' }, { id: '3378', need: 'approved' }, { id: '3381', need: 'approved' }] },
//   { id: '3387', code: '3387', name: 'Ingeniería de Software II', year: 3, semester: '1C', hours: 112, status: 'locked', requires: [{ id: '3378', need: 'approved' }, { id: '3382', need: 'approved' }, { id: '3385', need: 'regular' }], requiresToExam: [{ id: '3380', need: 'approved' }, { id: '3382', need: 'approved' }, { id: '3385', need: 'approved' }] },
//   { id: '3388', code: '3388', name: 'Sistemas Operativos y Redes', year: 3, semester: '1C', hours: 112, status: 'available', requires: [{ id: '3375', need: 'approved' }, { id: '3378', need: 'regular' }, { id: '3381', need: 'regular' }], requiresToExam: [{ id: '3375', need: 'approved' }, { id: '3378', need: 'approved' }, { id: '3381', need: 'approved' }] },
//   { id: '3389', code: '3389', name: 'Seminario de Redacción Informativa', year: 3, semester: '1C', hours: 56, status: 'available', requires: [{ id: '3382', need: 'regular' }], requiresToExam: [{ id: '3382', need: 'approved' }] },
//   { id: '3390', code: '3390', name: 'Sistemas Distribuidos', year: 3, semester: '2C', hours: 112, status: 'locked', requires: [{ id: '3380', need: 'regular' }, { id: '3384', need: 'approved' }, { id: '3388', need: 'regular' }], requiresToExam: [{ id: '3380', need: 'approved' }, { id: '3384', need: 'approved' }, { id: '3388', need: 'approved' }] },
//   { id: '3391', code: '3391', name: 'Lógica para Ciencias de la Computación', year: 3, semester: '2C', hours: 112, status: 'locked', requires: [{ id: '3380', need: 'approved' }, { id: '3383', need: 'regular' }], requiresToExam: [{ id: '3380', need: 'approved' }, { id: '3383', need: 'approved' }] },
//   { id: '3392', code: '3392', name: 'Análisis Matemático', year: 3, semester: '2C', hours: 112, status: 'available', requires: [{ id: '3378', need: 'regular' }, { id: '3379', need: 'approved' }], requiresToExam: [{ id: '3378', need: 'approved' }, { id: '3379', need: 'approved' }] },

//   // ==================== AÑO 4 ====================
//   { id: '3393', code: '3393', name: 'Metodología de la Investigación', year: 4, semester: '1C', hours: 56, status: 'locked', requires: [{ id: '3385', need: 'approved' }], requiresToExam: [{ id: '3385', need: 'approved' }] },
//   { id: '3394', code: '3394', name: 'Probabilidad y Estadística', year: 4, semester: '1C', hours: 112, status: 'locked', requires: [{ id: '3392', need: 'regular' }], requiresToExam: [{ id: '3392', need: 'approved' }] },
//   { id: '3395', code: '3395', name: 'Análisis y Diseño de Algoritmos II', year: 4, semester: '1C', hours: 112, status: 'locked', requires: [{ id: '3383', need: 'approved' }, { id: '3390', need: 'regular' }], requiresToExam: [{ id: '3383', need: 'approved' }, { id: '3390', need: 'approved' }] },
//   { id: '3396', code: '3396', name: 'Teoría de la Computación I', year: 4, semester: '2C', hours: 112, status: 'locked', requires: [{ id: '3391', need: 'approved' }], requiresToExam: [{ id: '3391', need: 'approved' }] },
//   { id: '3397', code: '3397', name: 'Simulación y Métodos Numéricos', year: 4, semester: '2C', hours: 112, status: 'locked', requires: [{ id: '3394', need: 'regular' }], requiresToExam: [{ id: '3392', need: 'approved' }, { id: '3394', need: 'approved' }] },
//   { id: '3398', code: '3398', name: 'Inteligencia Artificial', year: 4, semester: '2C', hours: 112, status: 'locked', requires: [{ id: '3380', need: 'approved' }, { id: '3395', need: 'regular' }], requiresToExam: [{ id: '3380', need: 'approved' }, { id: '3395', need: 'approved' }] },

//   // ==================== AÑO 5 ====================
//   { id: '3399', code: '3399', name: 'Teoría de la Computación II', year: 5, semester: '1C', hours: 112, status: 'locked', requires: [{ id: '3391', need: 'approved' }, { id: '3396', need: 'regular' }], requiresToExam: [{ id: '3391', need: 'approved' }, { id: '3396', need: 'approved' }] },
//   { id: '3400', code: '3400', name: 'Compiladores e Intérpretes', year: 5, semester: '1C', hours: 112, status: 'locked', requires: [{ id: '3386', need: 'approved' }, { id: '3396', need: 'regular' }], requiresToExam: [{ id: '3386', need: 'approved' }, { id: '3396', need: 'approved' }] },
//   { id: '3401', code: '3401', name: 'Trabajo Final', year: 5, semester: '2C', hours: 224, status: 'locked', requires: [{ id: '3387', need: 'approved' }, { id: '3390', need: 'approved' }], requiresToExam: [{ id: '3387', need: 'approved' }, { id: '3390', need: 'approved' }] },
// ]

// Motor que recalcula automáticamente qué materias están bloqueadas o disponibles
function recalculateLocks(list: Subject[]): Subject[] {
  const byId = new Map(list.map((s) => [s.id, s]))

  const meetsReq = (req: Requirement) => {
    const target = byId.get(req.id)
    if (!target) return false
    if (req.need === 'approved') return target.status === 'approved'
    return target.status === 'approved' || target.status === 'regular'
  }

  return list.map((s) => {
    const canTake = s.requires.every(meetsReq)
    // Si no cumple las correlativas, se bloquea sí o sí
    if (!canTake) {
      return { ...s, status: 'locked' }
    }
    // Si las cumple y estaba bloqueada, pasa a estar disponible ('available')
    if (s.status === 'locked') {
      return { ...s, status: 'available' }
    }
    return s
  })
}

const initialSubjects: Subject[] = []
// recalculateLocks(baseSubjects)
export const subjects: Subject[] = initialSubjects

// Cambiamos a v2 para que borre las materias viejas de Ingeniería en Sistemas de tu navegador
const STORAGE_KEY = 'unidash:subjects:custom:v1'
const EMPTY: Subject[] = []
const listeners = new Set<() => void>()
let cache: Subject[] | null = null

function persist(subjectsList: Subject[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(subjectsList))
  } catch {}
}

function getSnapshot(): Subject[] {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      cache = Array.isArray(parsed) ? recalculateLocks(parsed as Subject[]) : initialSubjects
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
  cache = recalculateLocks(updater(getSnapshot()))
  persist(cache)
  listeners.forEach((l) => l())
}

export function useSubjects() {
  return useSyncExternalStore(subscribe, getSnapshot, () => initialSubjects)
}

export function getSubject(id: string) {
  const list = typeof window !== 'undefined' ? getSnapshot() : initialSubjects
  return list.find((s) => s.id === id)
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
  const grades = approved.map((s) => s.grade ?? 0).filter((g) => g > 0)
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
  // Función para agregar una materia nueva al plan personalizado
  addSubject(newSubject: Subject) {
    update((currentSubjects) => recalculateLocks([...currentSubjects, newSubject]))
  },
  removeSubject(id: string) {
    update((currentSubjects) => recalculateLocks(currentSubjects.filter((s) => s.id !== id)))
  },
  resetToDefault() {
    cache = []
    persist([])
    listeners.forEach((l) => l())
  }
}