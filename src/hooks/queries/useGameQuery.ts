import { useQuery } from '@tanstack/react-query'
import { gameService } from '@/services/game.service'
import { queryKeys } from '@/lib/queryKeys'

/**
 * Get current active round and next scheduled round
 * Cached and refetches every 10 seconds for timer
 * Returns { current_round: {...} | null, next_round: {...} | null }
 */
export const useCurrentRound = () => {
  return useQuery({
    queryKey: queryKeys.round.current(),
    queryFn: () => gameService.getCurrentRound(),
    staleTime: 1000 * 10, // 10 seconds
    refetchInterval: 1000 * 10, // Refetch every 10 seconds for timer
    retry: 1, // Retry once on actual errors
    select: (data) => ({
      currentRound: data?.current_round || null,
      nextRound: data?.next_round || null,
    }),
  })
}
