import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'

export const useRoundTimer = () => {
  const { currentRound, timeRemaining, updateTimeRemaining } = useGameStore()

  useEffect(() => {
    if (!currentRound) return

    // Update immediately
    updateTimeRemaining()

    // Update every second
    const interval = setInterval(() => {
      updateTimeRemaining()
    }, 1000)

    return () => clearInterval(interval)
  }, [currentRound, updateTimeRemaining])

  return {
    currentRound,
    timeRemaining,
    isRoundActive: !!currentRound && currentRound.is_active,
  }
}
