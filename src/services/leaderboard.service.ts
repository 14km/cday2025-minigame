import { supabase } from './supabase'

export const leaderboardService = {
  /**
   * Get current leaderboard (Direct DB Access)
   */
  async getCurrentLeaderboard(limit = 100) {
    const { data, error } = await supabase
      .from('characters')
      .select(
        `
        id,
        name,
        current_prompt,
        total_score,
        strength,
        charm,
        creativity,
        profiles:user_id (
          username,
          display_name,
          avatar_url
        )
      `
      )
      .eq('is_active', true)
      .order('total_score', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data?.map((char: any, index) => ({
      rank: index + 1,
      character_id: char.id,
      character_name: char.name,
      username: char.profiles?.username || '',
      display_name: char.profiles?.display_name || null,
      avatar_url: char.profiles?.avatar_url || null,
      total_score: char.total_score,
      strength: char.strength,
      charm: char.charm,
      creativity: char.creativity,
      current_prompt: char.current_prompt,
    }))
  },

  /**
   * Get past round leaderboard
   */
  async getPastLeaderboard(roundNumber: number, limit = 100) {
    const { data, error } = await supabase
      .from('leaderboard_snapshots')
      .select(
        `
        id,
        rank,
        total_score,
        strength,
        charm,
        creativity,
        character_id,
        profiles:user_id (
          username,
          display_name,
          avatar_url
        )
      `
      )
      .eq('round_number', roundNumber)
      .order('rank')
      .limit(limit)

    if (error) throw error
    return data
  },

  /**
   * Get my rank (Edge Function)
   */
  async getMyRank(characterId: string) {
    const { data, error } = await supabase.functions.invoke('get-my-rank', {
      body: {
        character_id: characterId,
      },
    })

    if (error) throw error
    return data
  },
}
