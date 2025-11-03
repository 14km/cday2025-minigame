/**
 * Centralized React Query Keys
 *
 * This file contains all query keys used in the application.
 * Using factory functions ensures consistency and makes invalidation easier.
 *
 * Usage:
 * - In hooks: queryKey: queryKeys.character.byUser(userId)
 * - In invalidation: queryClient.invalidateQueries({ queryKey: queryKeys.character.all })
 */

export const queryKeys = {
  /**
   * Character-related queries
   */
  character: {
    all: ['character'] as const,
    byUser: (userId?: string) => ['character', userId] as const,
  },

  /**
   * Leaderboard-related queries
   */
  leaderboard: {
    all: ['leaderboard'] as const,
    list: (limit: number, offset: number) => ['leaderboard', limit, offset] as const,
  },

  /**
   * Rank-related queries
   */
  rank: {
    all: ['myRank'] as const,
    byCharacter: (characterId: string) => ['myRank', characterId] as const,
  },

  /**
   * Game round-related queries
   */
  round: {
    all: ['currentRound'] as const,
    current: () => ['currentRound'] as const,
  },

  /**
   * Prompt-related queries
   */
  prompts: {
    all: ['prompts'] as const,
    list: (limit: number, offset: number) => ['prompts', limit, offset] as const,
  },

  /**
   * Admin-related queries
   */
  admin: {
    all: ['admin'] as const,
    rounds: ['admin', 'rounds'] as const,
    prompts: (filters?: unknown) => ['admin', 'prompts', filters] as const,
    users: (filters?: unknown) => ['admin', 'users', filters] as const,
    user: (userId: string) => ['admin', 'user', userId] as const,
    stats: ['admin', 'stats'] as const,
    statsRounds: (roundId?: string) => ['admin', 'stats', 'rounds', roundId] as const,
    statsUsers: (userId?: string) => ['admin', 'stats', 'users', userId] as const,
    auditLog: (filters?: unknown) => ['admin', 'audit', filters] as const,
  },
} as const
