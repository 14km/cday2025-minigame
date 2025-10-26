# Frontend Design

## Overview
Vite.js + React + TypeScript 기반 모바일 우선 웹 애플리케이션

## Tech Stack
- **Framework**: Vite + React 18 + TypeScript
- **State Management**: Zustand
- **Styling**: Ant Design + styled-components (최소한만)
- **Router**: React Router v6
- **HTTP Client**: Supabase JS Client
- **Form**: Ant Design Form + Zod
- **UI Components**: Ant Design (모든 페이지에서 사용)
- **Real-time**: Supabase Realtime

---

## Dependencies

```bash
# Core
yarn add react react-dom react-router-dom zustand @supabase/supabase-js

# UI - Ant Design만 사용
yarn add antd @ant-design/icons

# Styling - 필요시에만 styled-components 사용
yarn add styled-components
yarn add -D @types/styled-components

# Form & Validation
yarn add zod

# Utils
yarn add dayjs

# Dev dependencies
yarn add -D @types/node @biomejs/biome
```

---

## Styling Architecture

### 원칙
1. **Ant Design 기본 컴포넌트 우선 사용**
2. **`style` prop으로 간단한 스타일 적용**
3. **styled-components는 정말 복잡한 경우에만 사용**

### Theme Configuration

#### Ant Design Theme
```typescript
// src/config/antd.config.ts
import type { ThemeConfig } from 'antd'

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    borderRadius: 8,
    fontSize: 14,
  },
}
```

#### styled-components Theme (간소화)
```typescript
// src/styles/theme.ts
export const appTheme = {
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    desktop: '992px',
    wide: '1200px',
  },
}
```

#### Global Styles
```typescript
// src/styles/globalStyles.ts
import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`
```

---

## Component Pattern

### Good Example (Ant Design 기본 사용)
```typescript
import { Card, Space, Typography, Button } from 'antd'

export const MyComponent = () => {
  return (
    <Card title="제목" style={{ marginBottom: 16 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Typography.Text>내용</Typography.Text>
        <Button type="primary" block>제출하기</Button>
      </Space>
    </Card>
  )
}
```

### Bad Example (불필요한 styled-components)
```typescript
// ❌ 이렇게 하지 마세요
const StyledCard = styled(Card)`
  margin-bottom: 16px;
`

// ✅ 대신 이렇게 하세요
<Card style={{ marginBottom: 16 }}>
```

---

## Mobile-First Design

### Breakpoints (Ant Design Grid System)
- **xs**: 0-576px (모바일)
- **sm**: 576-768px (모바일 가로)
- **md**: 768-992px (태블릿)
- **lg**: 992-1200px (데스크톱)
- **xl**: 1200px+ (대형 데스크톱)

### Responsive Grid Example
```typescript
import { Row, Col, Card } from 'antd'

<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={8} lg={6}>
    <Card>카드 내용</Card>
  </Col>
</Row>
```

### Responsive Table
```typescript
import { Table } from 'antd'

const columns = [
  { title: '이름', dataIndex: 'name' },
  { title: '이메일', dataIndex: 'email', responsive: ['md'] },
  { title: '전화번호', dataIndex: 'phone', responsive: ['lg'] },
]

<Table
  columns={columns}
  dataSource={data}
  scroll={{ x: 600 }}
  pagination={{ simple: window.innerWidth < 768 }}
/>
```

---

## Project Structure

```
src/
├── main.tsx
├── App.tsx
├── assets/
├── components/
│   ├── common/
│   ├── layout/
│   ├── user/
│   └── admin/
├── pages/
│   ├── user/
│   └── admin/
├── hooks/
├── store/
├── services/
│   └── supabase.ts
├── types/
├── utils/
├── config/
│   └── antd.config.ts
└── styles/
    ├── theme.ts
    └── globalStyles.ts
```

---

## User Pages (모바일 우선)

### 1. Landing (`/`)
- Hero Section
- How It Works
- Features
- CTA 버튼

### 2. Auth (`/login`, `/signup`)
- Ant Design Form 사용
- Zod 유효성 검증

### 3. Dashboard (`/dashboard`)
- Bottom Navigation (모바일)
- 라운드 정보
- 내 캐릭터 카드
- 프롬프트 입력
- TOP 10 리더보드

### 4. Leaderboard (`/leaderboard`)
- 실시간 순위 (Supabase Realtime)
- 내 순위 강조
- 무한 스크롤

### 5. History (`/history`)
- 내 프롬프트 히스토리
- 라운드별 점수 변화

### 6. Profile (`/profile`)
- 내 정보
- 캐릭터 통계

---

## Admin Pages (Ant Design Pro Layout)

### Layout Structure
```typescript
// Admin Layout: Sider (Desktop) + Drawer (Mobile)
import { Layout, Menu, Drawer } from 'antd'

const { Header, Sider, Content } = Layout

export const AdminLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop: Sider */}
      <Sider breakpoint="md" collapsedWidth="0">
        <Menu mode="inline" items={menuItems} />
      </Sider>

      <Layout>
        {/* Mobile: Drawer */}
        <Header>
          <MenuOutlined onClick={() => setDrawerOpen(true)} />
        </Header>

        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Menu mode="inline" items={menuItems} />
        </Drawer>

        <Content style={{ margin: 16 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
```

### Admin Pages
1. **Dashboard** - 전체 통계, 현재 라운드 상태
2. **Round Management** - 라운드 생성/시작/종료
3. **Prompt Moderation** - 프롬프트 관리/삭제
4. **User Management** - 사용자 검색/제재
5. **Statistics** - 통계 (Ant Design Statistic 사용)
6. **Audit Log** - 관리자 활동 로그

---

## State Management (Zustand)

### authStore
```typescript
interface AuthState {
  user: User | null
  session: Session | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}
```

### gameStore
```typescript
interface GameState {
  currentRound: GameRound | null
  hasSubmittedThisRound: boolean
  fetchCurrentRound: () => Promise<void>
}
```

---

## Real-time Features

### Leaderboard Updates
```typescript
import { supabase } from '@/services/supabase'

export const subscribeToLeaderboard = (callback: () => void) => {
  return supabase
    .channel('leaderboard-updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'characters'
    }, callback)
    .subscribe()
}
```

---

## App.tsx Setup

```typescript
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from './styles/globalStyles'
import { appTheme } from './styles/theme'
import { antdTheme } from './config/antd.config'

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <GlobalStyles />
      <ConfigProvider theme={antdTheme}>
        <BrowserRouter>
          {/* Routes */}
        </BrowserRouter>
      </ConfigProvider>
    </ThemeProvider>
  )
}
```

---

## Development Guidelines

1. **Ant Design 기본 컴포넌트 우선 사용**
2. **`style` prop으로 간단한 스타일 적용**
3. **styled-components는 최소한만 사용**
4. **모바일 우선 (Mobile-First)**
5. **Biome.js로 코드 포맷팅**
6. **TypeScript strict mode**

---

## Next Steps

1. ✅ 프로젝트 초기화
2. ⬜ Supabase 설정
3. ⬜ 라우팅 구조 구현
4. ⬜ User 페이지 개발
5. ⬜ Admin 페이지 개발
6. ⬜ 실시간 기능 구현
7. ⬜ 모바일 최적화 및 테스트
