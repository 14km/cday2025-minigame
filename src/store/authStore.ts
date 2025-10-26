import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'
import { authService } from '@/services/auth.service'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),

  signInWithGoogle: async () => {
    set({ isLoading: true })
    try {
      await authService.signInWithGoogle()
      // OAuth redirect will happen, so we don't set state here
    } finally {
      set({ isLoading: false })
    }
  },

  signOut: async () => {
    set({ isLoading: true })
    try {
      await authService.signOut()
      set({ user: null, session: null })
    } finally {
      set({ isLoading: false })
    }
  },

  checkSession: async () => {
    set({ isLoading: true })
    try {
      const session = await authService.getSession()
      if (session) {
        const user = await authService.getUser()
        set({ user, session })
      }
    } catch (error) {
      set({ user: null, session: null })
    } finally {
      set({ isLoading: false })
    }
  },
}))
