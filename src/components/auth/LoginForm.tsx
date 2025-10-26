import type { FC } from 'react'
import { Form, Input, Button, Typography } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { SignInData } from '@/types'

const { Link } = Typography

export const LoginForm: FC = () => {
  const navigate = useNavigate()
  const { signIn, isLoading } = useAuth()
  const [form] = Form.useForm()

  const handleSubmit = async (values: SignInData) => {
    try {
      await signIn(values)
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical" size="large">
      <Form.Item
        name="email"
        label="이메일"
        rules={[
          { required: true, message: '이메일을 입력해주세요' },
          { type: 'email', message: '올바른 이메일 형식이 아닙니다' },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="your@email.com" />
      </Form.Item>

      <Form.Item
        name="password"
        label="비밀번호"
        rules={[{ required: true, message: '비밀번호를 입력해주세요' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          로그인
        </Button>
      </Form.Item>

      <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
        <Link onClick={() => navigate('/signup')}>회원가입하기</Link>
      </Form.Item>
    </Form>
  )
}
