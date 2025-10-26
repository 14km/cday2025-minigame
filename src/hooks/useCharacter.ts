import { useEffect } from 'react'
import { useCharacterStore } from '@/store/characterStore'
import { useAuth } from './useAuth'

export const useCharacter = () => {
  const { user } = useAuth()
  const { character, isLoading, error, fetchCharacter, createCharacter, updateCharacterName } =
    useCharacterStore()

  useEffect(() => {
    if (user?.id) {
      fetchCharacter(user.id)
    }
  }, [user?.id, fetchCharacter])

  return {
    character,
    isLoading,
    error,
    createCharacter: (name: string) => {
      if (!user?.id) throw new Error('User not authenticated')
      return createCharacter(user.id, name)
    },
    updateCharacterName,
  }
}
