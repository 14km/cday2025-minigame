import { useQuery } from '@tanstack/react-query'
import { gameService } from '@/services/game.service'
import { queryKeys } from '@/lib/queryKeys'

/**
 * Get current active round
 * Cached and refetches every 10 seconds for timer
 */
export const useCurrentRound = () => {
  return useQuery({
    queryKey: queryKeys.round.current(),
    queryFn: () => gameService.getCurrentRound(),
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: 1000 * 10, // Refetch every 10 seconds for timer
    retry: false, // Don't retry if no active round (expected 404)
  })
}
