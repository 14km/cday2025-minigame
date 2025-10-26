import type { FC } from 'react'
import { Form, Input, Button, Typography } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { SignUpData } from '@/types'

const { Link } = Typography

export const SignupForm: FC = () => {
  const navigate = useNavigate()
  const { signUp, isLoading } = useAuth()
  const [form] = Form.useForm()

  const handleSubmit = async (values: SignUpData & { passwordConfirm: string }) => {
    try {
      const { passwordConfirm, ...signUpData } = values
      await signUp(signUpData)
      navigate('/dashboard')
    } catch (error) {
      console.error('Signup error:', error)
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
        <Input prefix={<MailOutlined />} placeholder="your@email.com" />
      </Form.Item>

      <Form.Item
        name="username"
        label="사용자명"
        rules={[
          { required: true, message: '사용자명을 입력해주세요' },
          { min: 3, max: 20, message: '3-20자 사이로 입력해주세요' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: '영문, 숫자, _ 만 사용 가능합니다' },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="username" />
      </Form.Item>

      <Form.Item name="display_name" label="닉네임 (선택)">
        <Input placeholder="표시될 이름" />
      </Form.Item>

      <Form.Item
        name="password"
        label="비밀번호"
        rules={[
          { required: true, message: '비밀번호를 입력해주세요' },
          { min: 6, message: '최소 6자 이상 입력해주세요' },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="비밀번호 (최소 6자)" />
      </Form.Item>

      <Form.Item
        name="passwordConfirm"
        label="비밀번호 확인"
        dependencies={['password']}
        rules={[
          { required: true, message: '비밀번호를 다시 입력해주세요' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('비밀번호가 일치하지 않습니다'))
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="비밀번호 확인" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          회원가입
        </Button>
      </Form.Item>

      <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
        <Link onClick={() => navigate('/login')}>이미 계정이 있나요? 로그인</Link>
      </Form.Item>
    </Form>
  )
}
