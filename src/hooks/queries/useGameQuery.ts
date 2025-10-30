import { useQuery } from '@tanstack/react-query'
import { gameService } from '@/services/game.service'
import { queryKeys } from '@/lib/queryKeys'

export const useCurrentRound = () => {
  return useQuery({
    queryKey: queryKeys.round.current(),
    queryFn: () => gameService.getCurrentRound(),
    refetchInterval: 10000, // Refetch every 10 seconds for timer
  })
}
