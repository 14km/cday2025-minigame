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
          <div
            style={{
              minHeight: '100vh',
              padding: '32px',
              textAlign: 'center',
            }}
          >
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
              Character Battle
            </h1>
            <p>1시간마다 30자 프롬프트로 최강의 캐릭터를 만들어보세요</p>
          </div>
        </BrowserRouter>
      </ConfigProvider>
    </ThemeProvider>
  )
}

export default App
