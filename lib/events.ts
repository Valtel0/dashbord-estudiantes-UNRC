import { useSyncExternalStore } from 'react'

export type EventType = 'exam' | 'assignment' | 'final' | 'reminder'

export type StudyEvent = {
  id: string
  title: string
  type: EventType
  date: string
  time?: string
  subjectId?: string
  notes?: string
  done?: boolean
}

export type StudyEventInput = Omit<StudyEvent, 'id'>

export const eventTypes: EventType[] = ['exam', 'assignment', 'final', 'reminder']

export const eventTypeMeta: Record<EventType, { label: string; dot: string; chip: string; ring: string }> = {
  exam: { label: 'Parcial', dot: 'bg-destructive', chip: 'bg-destructive/12 text-destructive', ring: 'border-destructive' },
  assignment: { label: 'Entrega de TP', dot: 'bg-progress', chip: 'bg-progress/20 text-progress-foreground', ring: 'border-progress' },
  final: { label: 'Final', dot: 'bg-primary', chip: 'bg-primary/12 text-primary', ring: 'border-primary' },
  reminder: { label: 'Recordatorio', dot: 'bg-regular', chip: 'bg-regular/12 text-regular', ring: 'border-regular' },
}

export function toDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDateKey(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function daysBetween(fromKey: string, toKey: string) {
  const ms = parseDateKey(toKey).getTime() - parseDateKey(fromKey).getTime()
  return Math.round(ms / 86_400_000)
}

export function getMonthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7
  const start = addDays(first, -offset)
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

export function sortEvents(a: StudyEvent, b: StudyEvent) {
  if (a.date !== b.date) return a.date < b.date ? -1 : 1
  return (a.time ?? '99:99') < (b.time ?? '99:99') ? -1 : 1
}

const STORAGE_KEY = 'unidash:events:v1'
const EMPTY: StudyEvent[] = []
const listeners = new Set<() => void>()
let cache: StudyEvent[] | null = null

function createSampleEvents(): StudyEvent[] {
  const today = new Date()
  const at = (days: number) => toDateKey(addDays(today, days))
  return [
    { id: crypto.randomUUID(), title: 'Entrega TP 3: Casos de uso', type: 'assignment', date: at(2), time: '23:59', subjectId: 'ads' },
    { id: crypto.randomUUID(), title: 'Segundo parcial', type: 'exam', date: at(5), time: '18:00', subjectId: 'fis2', notes: 'Electrostática y circuitos. Llevar calculadora.' },
    { id: crypto.randomUUID(), title: 'Inscripción a mesas de final', type: 'reminder', date: at(9) },
    { id: crypto.randomUUID(), title: 'Parcial integrador', type: 'exam', date: at(12), time: '09:00', subjectId: 'pye' },
    { id: crypto.randomUUID(), title: 'Final de Física I', type: 'final', date: at(20), time: '14:00', subjectId: 'fis1' },
    { id: crypto.randomUUID(), title: 'Consulta con el JTP', type: 'reminder', date: at(-3), time: '17:00', subjectId: 'ads', done: true },
  ]
}

function persist(events: StudyEvent[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch {
    // Storage can be full or disabled (private mode); keep working in memory.
  }
}

function getSnapshot() {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      cache = Array.isArray(parsed) ? (parsed as StudyEvent[]) : []
    } else {
      cache = createSampleEvents()
      persist(cache)
    }
  } catch {
    cache = []
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

function update(updater: (events: StudyEvent[]) => StudyEvent[]) {
  cache = updater(getSnapshot())
  persist(cache)
  listeners.forEach((l) => l())
}

export function useEvents() {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY)
}

export const eventsActions = {
  add(input: StudyEventInput) {
    update((events) => [...events, { ...input, id: crypto.randomUUID() }])
  },
  edit(id: string, input: StudyEventInput) {
    update((events) => events.map((e) => (e.id === id ? { ...input, id } : e)))
  },
  toggleDone(id: string) {
    update((events) => events.map((e) => (e.id === id ? { ...e, done: !e.done } : e)))
  },
  remove(id: string) {
    update((events) => events.filter((e) => e.id !== id))
  },
}
