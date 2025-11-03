import type { FC } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Loading } from './Loading'

export const AuthGuard: FC = () => {
  const user = useAuthStore((state) => state.user)
  const initialized = useAuthStore((state) => state.initialized)
  const isLoading = useAuthStore((state) => state.isLoading)

  // Wait for auth initialization to complete
  if (!initialized || isLoading) {
    console.log(user, initialized, isLoading)
    console.log('AuthGuard loading')
    return <Loading fullscreen tip="인증 확인 중..." />
  }

  // After initialization, redirect if no user
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
