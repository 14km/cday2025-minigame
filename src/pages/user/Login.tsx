import type { FC } from 'react'
import { Card, Typography } from 'antd'
import { LoginForm } from '@/components/auth/LoginForm'

const { Title } = Typography

export const Login: FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2}>Character Battle</Title>
          <Typography.Text type="secondary">Google 계정으로 간편하게 시작하세요</Typography.Text>
        </div>
        <LoginForm />
      </Card>
    </div>
  )
}
