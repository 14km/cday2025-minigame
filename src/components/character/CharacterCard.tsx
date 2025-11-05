import { memo } from 'react'
import type { FC } from 'react'
import { Space, Typography, Progress, Tag, Divider } from 'antd'
import { FireOutlined, HeartOutlined, BulbOutlined } from '@ant-design/icons'
import type { Character } from '@/types'

const { Title, Text } = Typography

interface CharacterCardProps {
  character: Character
}

export const CharacterCard: FC<CharacterCardProps> = memo(({ character }) => {
  const maxScore = 500

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        padding: '20px',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>👤</div>
          <Title level={3} style={{ margin: 0 }}>
            캐릭터 카드
          </Title>
        </div>

        <Divider style={{ margin: 0 }} />

        {/* Character Info */}
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            키우고 있는 캐릭터
          </Text>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              background: '#fafafa',
              borderRadius: 8,
            }}
          >
            <Text strong style={{ fontSize: 18 }}>
              {character.name}
            </Text>
            <Tag color="gold" style={{ fontSize: 14, padding: '4px 12px', margin: 0 }}>
              총점 {character.total_score}
            </Tag>
          </div>
        </div>

        {/* Current Prompt */}
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            사용 중인 프롬프트
          </Text>
          <div
            style={{
              padding: '12px',
              background: '#e6f4ff',
              border: '1px solid #91caff',
              borderRadius: 8,
              wordBreak: 'break-word',
            }}
          >
            <Text style={{ fontSize: 15 }}>"{character.current_prompt}"</Text>
          </div>
        </div>

        <Divider style={{ margin: 0 }} />

        {/* Stats */}
        <div>
          <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
            능력치
          </Text>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* Strength */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Space size="small">
                  <FireOutlined style={{ color: '#ef4444', fontSize: 16 }} />
                  <Text style={{ fontSize: 14 }}>힘</Text>
                </Space>
                <Text strong style={{ fontSize: 14 }}>
                  {character.strength}
                </Text>
              </div>
              <Progress
                percent={(character.strength / maxScore) * 100}
                strokeColor="#ef4444"
                showInfo={false}
              />
            </div>

            {/* Charm */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Space size="small">
                  <HeartOutlined style={{ color: '#3b82f6', fontSize: 16 }} />
                  <Text style={{ fontSize: 14 }}>매력</Text>
                </Space>
                <Text strong style={{ fontSize: 14 }}>
                  {character.charm}
                </Text>
              </div>
              <Progress
                percent={(character.charm / maxScore) * 100}
                strokeColor="#3b82f6"
                showInfo={false}
              />
            </div>

            {/* Creativity */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Space size="small">
                  <BulbOutlined style={{ color: '#10b981', fontSize: 16 }} />
                  <Text style={{ fontSize: 14 }}>창의성</Text>
                </Space>
                <Text strong style={{ fontSize: 14 }}>
                  {character.creativity}
                </Text>
              </div>
              <Progress
                percent={(character.creativity / maxScore) * 100}
                strokeColor="#10b981"
                showInfo={false}
              />
            </div>
          </Space>
        </div>
      </Space>
    </div>
  )
})
