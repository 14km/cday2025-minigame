import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/services/supabase'

export const useAuth = () => {
  const { user, session, isLoading, setUser, setSession, signIn, signUp, signOut, checkSession } =
    useAuthStore()

  useEffect(() => {
    // Check initial session
    checkSession()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setSession, setUser, checkSession])

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
  }
}
