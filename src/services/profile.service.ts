import { supabase } from './supabase'
import type { Profile } from '@/types/profile.types'

export const profileService = {
  /**
   * Get current user's profile from DB
   */
  async getMyProfile(): Promise<Profile> {
    const { data, error } = await supabase.functions.invoke('get-my-profile')

    if (error) throw error
    if (!data?.success) throw new Error(data?.error || 'Failed to fetch profile')

    return data.data.profile
  },

  /**
   * Update user profile (display name, avatar)
   */
  async updateProfile(updates: { displayName?: string; avatarUrl?: string }) {
    const { data, error } = await supabase.functions.invoke('update-profile', {
      body: {
        display_name: updates.displayName,
        avatar_url: updates.avatarUrl,
      },
    })

    if (error) throw error
    if (!data?.success) throw new Error(data?.error || 'Failed to update profile')

    return data.data
  },
}
