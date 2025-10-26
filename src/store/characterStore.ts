import { create } from 'zustand'
import { characterService } from '@/services/character.service'
import type { Character } from '@/types'

interface CharacterState {
  character: Character | null
  isLoading: boolean
  error: string | null
  setCharacter: (character: Character | null) => void
  fetchCharacter: (userId: string) => Promise<void>
  createCharacter: (userId: string, name: string) => Promise<void>
  updateCharacterName: (characterId: string, name: string) => Promise<void>
  clearError: () => void
}

export const useCharacterStore = create<CharacterState>((set) => ({
  character: null,
  isLoading: false,
  error: null,

  setCharacter: (character) => set({ character }),

  fetchCharacter: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      const character = await characterService.getMyCharacter(userId)
      set({ character })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  createCharacter: async (userId, name) => {
    set({ isLoading: true, error: null })
    try {
      const character = await characterService.createCharacter(userId, name)
      set({ character })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  updateCharacterName: async (characterId, name) => {
    set({ isLoading: true, error: null })
    try {
      const character = await characterService.updateCharacterName(characterId, name)
      set({ character })
    } catch (error) {
      set({ error: (error as Error).message })
    } finally {
      set({ isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
}))
