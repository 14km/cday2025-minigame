import type { FC } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Alert, Card, Space, Typography } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { useAuthStore } from '@/store/authStore'
import { Loading } from './Loading'

const { Title, Text } = Typography

/**
 * Admin Route Guard
 * Checks if user is authenticated and has admin role
 * Note: In production, admin role should be stored in user_metadata or custom claims
 */
export const AdminGuard: FC = () => {
  const { user, initialized } = useAuthStore()

  // Wait for auth initialization
  if (!initialized) {
    return <Loading fullscreen tip="권한 확인 중..." />
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check if user is admin
  // TODO: Implement proper admin role check
  // For now, we'll check user metadata or email domain
  const isAdmin = user.user_metadata?.role === 'admin' || user.email?.endsWith('@admin.com')

  if (!isAdmin) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <Card style={{ maxWidth: 500, width: '100%' }}>
          <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
            <LockOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />
            <div>
              <Title level={3}>접근 권한 없음</Title>
              <Text type="secondary">Admin 권한이 필요한 페이지입니다.</Text>
            </div>
            <Alert
              message="관리자 권한 필요"
              description="이 페이지에 접근하려면 관리자 권한이 필요합니다. 권한이 필요한 경우 시스템 관리자에게 문의하세요."
              type="error"
              showIcon
            />
          </Space>
        </Card>
      </div>
    )
  }

  return <Outlet />
}
