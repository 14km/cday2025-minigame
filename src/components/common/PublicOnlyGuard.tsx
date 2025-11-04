import type { FC } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuthStore } from '@/store/authStore'

/**
 * PublicOnlyGuard - Redirects authenticated users to dashboard
 * Used for routes that should only be accessible to non-authenticated users (Landing, Login)
 */
export const PublicOnlyGuard: FC = () => {
  const user = useAuthStore((state) => state.user)
  const initialized = useAuthStore((state) => state.initialized)

  // Wait for auth to initialize
  if (!initialized) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size="large" tip="인증 확인 중..." />
      </div>
    )
  }

  // Redirect to dashboard if user is logged in
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  // Render the public route
  return <Outlet />
}
