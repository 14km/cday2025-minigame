import { memo } from 'react'
import type { FC } from 'react'
import { List, Space, Tag, Typography, Avatar } from 'antd'
import { TrophyOutlined, UserOutlined } from '@ant-design/icons'
import type { LeaderboardEntry } from '@/types'
import { getRankColor } from '@/utils'

const { Text } = Typography

interface LeaderboardItemProps {
  entry: LeaderboardEntry
  isCurrentUser?: boolean
}

export const LeaderboardItem: FC<LeaderboardItemProps> = memo(
  ({ entry, isCurrentUser = false }) => {
    const rankColor = getRankColor(entry.rank)

    return (
      <List.Item
        style={{
          background: isCurrentUser ? '#e6f7ff' : 'transparent',
          padding: '12px 16px',
          borderRadius: 8,
        }}
      >
        <List.Item.Meta
          avatar={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag color={entry.rank <= 3 ? rankColor : 'default'} style={{ fontSize: 16 }}>
                #{entry.rank}
              </Tag>
              <Avatar src={entry.avatar_url} icon={<UserOutlined />} />
            </div>
          }
          title={
            <Space>
              <Text strong>{entry.display_name}</Text>
              {isCurrentUser && <Tag color="blue">나</Tag>}
            </Space>
          }
          description={
            <Space direction="vertical" size={4}>
              <Text type="secondary">
                <TrophyOutlined /> {entry.character_name}
              </Text>
              <Text type="secondary" ellipsis>
                "{entry.current_prompt}"
              </Text>
            </Space>
          }
        />
        <div style={{ textAlign: 'right' }}>
          <Text strong style={{ fontSize: 20, display: 'block' }}>
            {entry.total_score}
          </Text>
          <Space size={4} style={{ fontSize: 12 }}>
            <Text type="secondary">힘 {entry.strength}</Text>
            <Text type="secondary">매력 {entry.charm}</Text>
            <Text type="secondary">창의 {entry.creativity}</Text>
          </Space>
        </div>
      </List.Item>
    )
  }
)
