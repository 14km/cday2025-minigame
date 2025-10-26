import { Spin } from 'antd'
import type { FC } from 'react'

interface LoadingProps {
  size?: 'small' | 'default' | 'large'
  tip?: string
  fullscreen?: boolean
}

export const Loading: FC<LoadingProps> = ({ size = 'default', tip, fullscreen = false }) => {
  if (fullscreen) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size={size} tip={tip} />
      </div>
    )
  }

  return <Spin size={size} tip={tip} />
}
