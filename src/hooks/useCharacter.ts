import { useEffect, useRef } from 'react'
import { useCharacterStore } from '@/store/characterStore'
import { useAuthStore } from '@/store/authStore'

export const useCharacter = () => {
  const user = useAuthStore((state) => state.user)
  const character = useCharacterStore((state) => state.character)
  const isLoading = useCharacterStore((state) => state.isLoading)
  const error = useCharacterStore((state) => state.error)
  const fetchCharacter = useCharacterStore((state) => state.fetchCharacter)
  const createCharacter = useCharacterStore((state) => state.createCharacter)
  const updateCharacterName = useCharacterStore((state) => state.updateCharacterName)

  const fetchedUserId = useRef<string | null>(null)

  useEffect(() => {
    if (user?.id && fetchedUserId.current !== user.id) {
      fetchedUserId.current = user.id
      fetchCharacter()
    }
    // fetchCharacter is stable from Zustand, safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  return {
    character,
    isLoading,
    error,
    createCharacter,
    updateCharacterName,
  }
}
