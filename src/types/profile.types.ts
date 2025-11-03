/**
 * User role type
 */
export type UserRole = 'user' | 'admin'

/**
 * User profile from profiles table
 */
export interface Profile {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
  role: UserRole
  createdAt: string
  updatedAt: string
}
