import type { FC } from 'react'
import { Button, Space, Divider } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'
import { useAuth } from '@/hooks/useAuth'

export const LoginForm: FC = () => {
  const { signInWithGoogle, isLoading } = useAuth()

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Google login error:', error)
    }
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Divider>간편 로그인</Divider>

      <Button
        type="primary"
        icon={<GoogleOutlined />}
        onClick={handleGoogleLogin}
        loading={isLoading}
        block
        size="large"
      >
        Google로 시작하기
      </Button>
    </Space>
  )
}
