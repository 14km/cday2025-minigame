import type { FC } from 'react'
import { Card, Statistic, Space } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { useRoundTimer } from '@/hooks/useRoundTimer'

export const RoundTimer: FC = () => {
  const { currentRound, timeRemaining, isRoundActive } = useRoundTimer()

  if (!currentRound) {
    return (
      <Card>
        <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
          <ClockCircleOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
          <Statistic title="활성 라운드 없음" value="대기 중" />
        </Space>
      </Card>
    )
  }

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Statistic
          title={`Round #${currentRound.round_number}`}
          value={isRoundActive ? '진행 중' : currentRound.status}
          prefix={<ClockCircleOutlined />}
        />

        {isRoundActive && (
          <Statistic
            title="남은 시간"
            value={timeRemaining}
            valueStyle={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}
          />
        )}
      </Space>
    </Card>
  )
}
