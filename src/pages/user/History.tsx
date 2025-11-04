import type { FC } from 'react'
import { Card, List, Tag, Space, Typography } from 'antd'
import { MainLayout } from '@/components/layout/MainLayout'
import { useMyRoundHistory } from '@/hooks/queries/usePromptQuery'
import type { RoundHistory } from '@/types/game.types'

const { Text } = Typography

export const History: FC = () => {
  const { data: history = [], isLoading: loading } = useMyRoundHistory(20, 0)

  return (
    <MainLayout>
      <Card title="라운드 히스토리" loading={loading}>
        <List
          dataSource={history}
          renderItem={(item: RoundHistory) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <Tag color={item.participated ? 'blue' : 'default'}>
                      Round #{item.round_number}
                    </Tag>
                    {item.participated ? (
                      <Text strong>"{item.prompt}"</Text>
                    ) : (
                      <Text type="secondary">참가하지 않음</Text>
                    )}
                  </Space>
                }
                description={
                  item.participated ? (
                    <Space size="large">
                      <Tag color="red">힘 +{item.strength_gained}</Tag>
                      <Tag color="blue">매력 +{item.charm_gained}</Tag>
                      <Tag color="green">창의 +{item.creativity_gained}</Tag>
                      <Tag>총점 +{item.total_score_gained}</Tag>
                    </Space>
                  ) : (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {new Date(item.round_start_time).toLocaleDateString('ko-KR')} ~{' '}
                      {new Date(item.round_end_time).toLocaleDateString('ko-KR')}
                    </Text>
                  )
                }
              />
              {item.created_at && (
                <Text type="secondary">{new Date(item.created_at).toLocaleString('ko-KR')}</Text>
              )}
            </List.Item>
          )}
          locale={{ emptyText: '아직 진행된 라운드가 없습니다' }}
        />
      </Card>
    </MainLayout>
  )
}
