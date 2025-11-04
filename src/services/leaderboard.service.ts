import { supabase } from './supabase'
import { handleEdgeFunctionResponse } from '@/utils/edgeFunction'
import type { LeaderboardResponse } from '@/types'

export const leaderboardService = {
  /**
   * Get current leaderboard (Edge Function)
   */
  async getCurrentLeaderboard(limit = 100, offset = 0): Promise<LeaderboardResponse> {
    const { data, error } = await supabase.functions.invoke('get-leaderboard', {
      body: { limit, offset },
    })

    return handleEdgeFunctionResponse<LeaderboardResponse>(data, error, 'Failed to get leaderboard')
  },

  /**
   * Get my rank (Edge Function)
   */
  async getMyRank(characterId: string) {
    const { data, error } = await supabase.functions.invoke('get-my-rank', {
      body: { character_id: characterId },
    })

    return handleEdgeFunctionResponse(data, error, 'Failed to get rank')
  },
}
