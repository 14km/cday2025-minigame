import type { FC, ReactNode } from 'react'
import { Layout } from 'antd'
import { BottomNavigation } from './BottomNavigation'
import { Header } from './Header'

const { Content } = Layout

interface MainLayoutProps {
  children: ReactNode
  showHeader?: boolean
  showBottomNav?: boolean
}

export const MainLayout: FC<MainLayoutProps> = ({
  children,
  showHeader = true,
  showBottomNav = true,
}) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {showHeader && <Header />}

      <Content
        style={{
          padding: '16px',
          paddingBottom: showBottomNav ? '80px' : '16px',
        }}
      >
        {children}
      </Content>

      {showBottomNav && <BottomNavigation />}
    </Layout>
  )
}
