import { create } from 'zustand'
import { gameService } from '@/services/game.service'
import { promptService } from '@/services/prompt.service'
import type { GameRound } from '@/types'

interface GameState {
  currentRound: GameRound | null
  timeRemaining: string
  hasSubmittedThisRound: boolean
  isLoading: boolean
  error: string | null
  setCurrentRound: (round: GameRound | null) => void
  fetchCurrentRound: () => Promise<void>
  checkSubmissionStatus: (characterId: string) => Promise<void>
  updateTimeRemaining: () => void
  clearError: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  currentRound: null,
  timeRemaining: '00:00:00',
  hasSubmittedThisRound: false,
  isLoading: false,
  error: null,

  setCurrentRound: (round) => set({ currentRound: round }),

  fetchCurrentRound: async () => {
    set({ isLoading: true, error: null })
    try {
      const round = await gameService.getCurrentRound()
      set({ currentRound: round })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  checkSubmissionStatus: async (characterId) => {
    const { currentRound } = get()
    if (!currentRound) return

    try {
      const hasSubmitted = await promptService.hasSubmittedInRound(
        characterId,
        currentRound.round_number
      )
      set({ hasSubmittedThisRound: hasSubmitted })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  updateTimeRemaining: () => {
    const { currentRound } = get()
    if (!currentRound) {
      set({ timeRemaining: '00:00:00' })
      return
    }

    const remaining = gameService.calculateTimeRemaining(currentRound.end_time)
    set({ timeRemaining: remaining })
  },

  clearError: () => set({ error: null }),
}))
