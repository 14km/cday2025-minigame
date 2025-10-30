import { type FC, useState } from 'react'
import { Card, Input, Button, Space, Typography, Alert } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { usePromptSubmit } from '@/hooks/usePromptSubmit'

const { TextArea } = Input
const { Text } = Typography

export const PromptInput: FC = () => {
  const [prompt, setPrompt] = useState('')
  const { submitPrompt, isSubmitting, error, hasSubmittedThisRound, canSubmit } = usePromptSubmit()

  const handleSubmit = async () => {
    if (!prompt.trim() || prompt.length > 30) return

    const success = await submitPrompt(prompt)
    if (success) {
      setPrompt('')
    }
  }

  return (
    <Card
      title="프롬프트 제출"
      style={{ marginBottom: 16 }}
      role="region"
      aria-label="프롬프트 제출 영역"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {hasSubmittedThisRound ? (
          <Alert message="이번 라운드에 이미 제출했습니다" type="info" showIcon role="status" />
        ) : (
          <>
            <div>
              <TextArea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="캐릭터를 성장시킬 프롬프트를 입력하세요 (최대 30자)"
                maxLength={30}
                rows={3}
                disabled={!canSubmit}
                aria-label="프롬프트 입력"
                aria-describedby="prompt-char-count"
              />
              <Text
                type="secondary"
                style={{ display: 'block', marginTop: 8 }}
                id="prompt-char-count"
              >
                {prompt.length}/30자
              </Text>
            </div>

            {error && <Alert message={error} type="error" showIcon role="alert" />}

            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!canSubmit || prompt.trim().length === 0}
              aria-label="프롬프트 제출하기"
              block
              size="large"
            >
              제출하기
            </Button>
          </>
        )}
      </Space>
    </Card>
  )
}
