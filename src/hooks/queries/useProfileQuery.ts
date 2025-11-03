import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '@/services/profile.service'

/**
 * Get current user's profile from DB
 */
export const useMyProfile = () => {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => profileService.getMyProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes - profile doesn't change often
    retry: 1,
  })
}

/**
 * Update user profile mutation
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: { displayName?: string; avatarUrl?: string }) =>
      profileService.updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] })
    },
  })
}
