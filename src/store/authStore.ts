import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'
import { authService } from '@/services/auth.service'
import { supabase } from '@/services/supabase'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  initialize: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: false,
  initialized: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),

  initialize: async () => {
    // This is now a no-op, initialization happens at module level
  },

  signInWithGoogle: async () => {
    set({ isLoading: true })
    try {
      await authService.signInWithGoogle()
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
}))

// Initialize auth at module level (runs once when module is imported)
;(async () => {
  try {
    const session = await authService.getSession()
    if (session) {
      const user = await authService.getUser()
      useAuthStore.setState({ user, session, initialized: true })
    } else {
      useAuthStore.setState({ initialized: true })
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        if (session) {
          useAuthStore.setState({ session, user: session.user })
        }
      } else if (event === 'SIGNED_OUT') {
        useAuthStore.setState({ session: null, user: null })
      }
    })
  } catch (error) {
    console.error('Auth init error:', error)
    useAuthStore.setState({ initialized: true })
  }
})()
