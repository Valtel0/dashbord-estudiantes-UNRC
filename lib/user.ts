'use client'

import { useSyncExternalStore } from 'react'

export type UserProfile = {
  name: string
  career: string
  studentId: string
  isSetUp: boolean
}

const STORAGE_KEY = 'unidash:user:v2'
const defaultUser: UserProfile = {
  name: '',
  career: '',
  studentId: '',
  isSetUp: false,
}

let cache: UserProfile | null = null
const listeners = new Set<() => void>()

function persist(user: UserProfile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } catch {}
}

function getSnapshot(): UserProfile {
  if (cache !== null) return cache
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      cache = JSON.parse(raw) as UserProfile
    } else {
      cache = defaultUser
    }
  } catch {
    cache = defaultUser
  }
  return cache ?? defaultUser
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

export function useUser() {
  return useSyncExternalStore(subscribe, getSnapshot, () => defaultUser)
}

export const userActions = {
  saveProfile(profile: Omit<UserProfile, 'isSetUp'>) {
    cache = { ...profile, isSetUp: true }
    persist(cache)
    listeners.forEach((l) => l())
  },
  logout() {
    cache = defaultUser
    persist(defaultUser)
    listeners.forEach((l) => l())
  },
}