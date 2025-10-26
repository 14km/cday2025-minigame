import type { FC } from 'react'
import { Card, Typography } from 'antd'
import { SignupForm } from '@/components/auth/SignupForm'

const { Title } = Typography

export const Signup: FC = () => {
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
          <Typography.Text type="secondary">회원가입하고 최강의 캐릭터 만들기</Typography.Text>
        </div>
        <SignupForm />
      </Card>
    </div>
  )
}
