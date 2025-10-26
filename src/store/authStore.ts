import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'
import { authService } from '@/services/auth.service'
import type { SignInData, SignUpData } from '@/types'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  signIn: (data: SignInData) => Promise<void>
  signUp: (data: SignUpData) => Promise<void>
  signOut: () => Promise<void>
  checkSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),

  signIn: async (data) => {
    set({ isLoading: true })
    try {
      const authData = await authService.signIn(data)
      set({ user: authData.user, session: authData.session })
    } finally {
      set({ isLoading: false })
    }
  },

  signUp: async (data) => {
    set({ isLoading: true })
    try {
      const authData = await authService.signUp(data)
      set({ user: authData.user, session: authData.session })
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
