import type { FC } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Loading } from './Loading'

export const AuthGuard: FC = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Loading fullscreen tip="로그인 확인 중..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
