import type { ThemeConfig } from 'antd'

// 전체 앱 통일 테마
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

// User Pages는 다른 primary color 사용 (선택사항)
export const userAntdTheme: ThemeConfig = {
  ...antdTheme,
  token: {
    ...antdTheme.token,
    colorPrimary: '#7c3aed', // Purple for game feeling
  },
}

// Admin Pages는 기본 테마 사용
export const adminAntdTheme = antdTheme
