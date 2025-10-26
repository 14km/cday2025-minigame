import type { FC } from 'react'
import { Layout, Button, Space, Typography } from 'antd'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const { Header: AntHeader } = Layout
const { Title } = Typography

export const Header: FC = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <AntHeader
      style={{
        background: '#001529',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Title level={4} style={{ color: 'white', margin: 0 }}>
        Character Battle
      </Title>

      {user && (
        <Space>
          <Button
            type="text"
            icon={<UserOutlined />}
            onClick={() => navigate('/profile')}
            style={{ color: 'white' }}
          >
            {user.email}
          </Button>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ color: 'white' }}
          >
            로그아웃
          </Button>
        </Space>
      )}
    </AntHeader>
  )
}
