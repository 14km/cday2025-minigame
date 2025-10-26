import { useState, useEffect, useCallback } from 'react'
import { leaderboardService } from '@/services/leaderboard.service'
import { realtimeService } from '@/services/realtime.service'
import type { LeaderboardEntry } from '@/types'

export const useLeaderboard = (limit = 100) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await leaderboardService.getCurrentLeaderboard(limit)
      setLeaderboard(data || [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchLeaderboard()

    // Subscribe to realtime updates
    const channel = realtimeService.subscribeToLeaderboard(() => {
      fetchLeaderboard()
    })

    return () => {
      realtimeService.unsubscribe(channel)
    }
  }, [fetchLeaderboard])

  return {
    leaderboard,
    isLoading,
    error,
    refetch: fetchLeaderboard,
  }
}
