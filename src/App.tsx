import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from './styles/globalStyles'
import { appTheme } from './styles/theme'
import { antdTheme } from './config/antd.config'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { AuthGuard } from './components/common/AuthGuard'
import { Landing } from './pages/user/Landing'
import { Login } from './pages/user/Login'
import { Signup } from './pages/user/Signup'
import { Dashboard } from './pages/user/Dashboard'
import { Leaderboard } from './pages/user/Leaderboard'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={appTheme}>
        <GlobalStyles />
        <ConfigProvider theme={antdTheme}>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route element={<AuthGuard />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ConfigProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
