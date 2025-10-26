import type { Session, User } from '@supabase/supabase-js'

export interface UserMetadata {
  display_name: string
  avatar_url?: string
  email: string
}

export interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
}

// Google OAuth only - no email/password signup
export interface Profile {
  id: string
  display_name: string
  avatar_url: string | null
  email: string
  created_at: string
  updated_at: string
}
