import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'
import { authService } from '@/services/auth.service'
import { profileService } from '@/services/profile.service'
import { supabase } from '@/services/supabase'
import type { Profile } from '@/types/profile.types'

interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  initialized: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  session: null,
  isLoading: false,
  initialized: false,

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
      set({ user: null, profile: null, session: null })
    } finally {
      set({ isLoading: false })
    }
  },

  refreshProfile: async () => {
    try {
      const profile = await profileService.getMyProfile()
      set({ profile })
    } catch (error) {
      console.error('Failed to refresh profile:', error)
      throw error
    }
  },
}))

/**
 * Initialize auth - call this once from App.tsx
 */
export async function initializeAuth() {
  console.log('Initializing auth...')

  try {
    console.log('Getting session...')

    // Use Supabase directly to avoid any issues
    const { data, error } = await supabase.auth.getSession()
    console.log('Session response:', { hasData: !!data, hasError: !!error })

    if (error) {
      console.error('getSession error:', error)
      useAuthStore.setState({ initialized: true })
      return
    }

    const session = data.session
    console.log('Session:', session ? `Found for ${session.user.email}` : 'None')

    if (session) {
      console.log('Loading user and profile...')

      // Set session immediately
      useAuthStore.setState({ session, user: session.user })

      // Fetch profile from DB (non-blocking)
      try {
        console.log('Fetching profile...')
        const profile = await profileService.getMyProfile()
        useAuthStore.setState({ profile, initialized: true })
        console.log('✅ Auth initialized - User:', session.user.email, 'Role:', profile.role)
      } catch (profileError) {
        console.error('Failed to fetch profile:', profileError)
        useAuthStore.setState({ initialized: true })
        console.log('✅ Auth initialized (without profile)')
      }
    } else {
      console.log('No session - setting initialized')
      useAuthStore.setState({ initialized: true })
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        if (session) {
          // Update session and user immediately
          useAuthStore.setState({ session, user: session.user })

          // Fetch profile asynchronously (don't block auth)
          try {
            const profile = await profileService.getMyProfile()
            useAuthStore.setState({ profile })
            console.log('Profile refreshed:', profile.email, 'Role:', profile.role)
          } catch (profileError) {
            console.error('Failed to fetch profile on auth change:', profileError)
            // Profile fetch failed, but user is still authenticated
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out')
        useAuthStore.setState({ session: null, user: null, profile: null })
      }
    })
  } catch (error) {
    console.error('Auth init error:', error)
    useAuthStore.setState({ initialized: true })
  }
}
