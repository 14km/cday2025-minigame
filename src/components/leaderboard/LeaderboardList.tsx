import type { FC } from 'react'
import { List, Card } from 'antd'
import { LeaderboardItem } from './LeaderboardItem'
import type { LeaderboardEntry } from '@/types'

interface LeaderboardListProps {
  data: LeaderboardEntry[]
  loading?: boolean
  currentUserId?: string
}

export const LeaderboardList: FC<LeaderboardListProps> = ({
  data,
  loading = false,
  currentUserId,
}) => {
  return (
    <Card title="리더보드" loading={loading}>
      <List
        dataSource={data}
        renderItem={(item) => (
          <LeaderboardItem entry={item} isCurrentUser={item.character_id === currentUserId} />
        )}
        locale={{ emptyText: '아직 순위가 없습니다' }}
      />
    </Card>
  )
}
