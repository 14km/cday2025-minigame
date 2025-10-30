import { memo } from 'react'
import type { FC } from 'react'
import { Card, Space, Typography, Progress, Row, Col } from 'antd'
import { TrophyOutlined } from '@ant-design/icons'
import type { Character } from '@/types'

const { Title, Text } = Typography

interface CharacterCardProps {
  character: Character
}

export const CharacterCard: FC<CharacterCardProps> = memo(({ character }) => {
  const maxScore = 500

  return (
    <Card
      title={
        <Space>
          <TrophyOutlined />
          {character.name}
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Text strong>현재 프롬프트:</Text>
          <Text style={{ display: 'block', marginTop: 8, fontSize: 16 }}>
            "{character.current_prompt}"
          </Text>
        </div>

        <div>
          <Title level={4} style={{ marginBottom: 16 }}>
            총점: {character.total_score}
          </Title>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Text>힘 (Strength): {character.strength}</Text>
              <Progress
                percent={(character.strength / maxScore) * 100}
                strokeColor="#ef4444"
                showInfo={false}
              />
            </Col>

            <Col span={24}>
              <Text>매력 (Charm): {character.charm}</Text>
              <Progress
                percent={(character.charm / maxScore) * 100}
                strokeColor="#3b82f6"
                showInfo={false}
              />
            </Col>

            <Col span={24}>
              <Text>창의성 (Creativity): {character.creativity}</Text>
              <Progress
                percent={(character.creativity / maxScore) * 100}
                strokeColor="#10b981"
                showInfo={false}
              />
            </Col>
          </Row>
        </div>
      </Space>
    </Card>
  )
})
