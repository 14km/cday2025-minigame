import { useState } from 'react'
import { promptService } from '@/services/prompt.service'
import { useGameStore } from '@/store/gameStore'
import { useCharacterStore } from '@/store/characterStore'

export const usePromptSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { hasSubmittedThisRound, checkSubmissionStatus } = useGameStore()
  const { character, fetchCharacter } = useCharacterStore()

  const submitPrompt = async (prompt: string) => {
    if (!character?.id) {
      setError('캐릭터가 없습니다')
      return false
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await promptService.submitPrompt(character.id, prompt)

      // Refresh character data
      if (character.user_id) {
        await fetchCharacter(character.user_id)
      }

      // Update submission status
      await checkSubmissionStatus(character.id)

      return true
    } catch (err) {
      setError((err as Error).message)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitPrompt,
    isSubmitting,
    error,
    hasSubmittedThisRound,
    canSubmit: !hasSubmittedThisRound && !isSubmitting,
  }
}
