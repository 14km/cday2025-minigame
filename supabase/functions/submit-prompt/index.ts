import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { handleCors } from '../_shared/cors.ts'
import { successResponse, errorResponse } from '../_shared/response.ts'

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // 1. JWT 검증
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return errorResponse('Unauthorized', 401)
    }

    const token = authHeader.replace('Bearer ', '')
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const {
      data: { user },
    } = await supabase.auth.getUser(token)
    if (!user) {
      return errorResponse('Unauthorized', 401)
    }

    // 2. Request Body 파싱
    const { character_id, prompt } = await req.json()

    // 3. 프롬프트 유효성 검증
    if (!prompt || typeof prompt !== 'string') {
      return errorResponse('INVALID_PROMPT', 400, '프롬프트를 입력해주세요')
    }

    if (prompt.trim().length === 0 || prompt.length > 30) {
      return errorResponse('INVALID_PROMPT_LENGTH', 400, '프롬프트는 1-30자 사이여야 합니다')
    }

    // 4. 현재 활성 라운드 조회
    const { data: round, error: roundError } = await supabase
      .from('game_rounds')
      .select('*')
      .eq('is_active', true)
      .maybeSingle()

    if (roundError || !round) {
      return errorResponse('ROUND_NOT_ACTIVE', 400, '현재 진행 중인 라운드가 없습니다')
    }

    // 5. 중복 제출 확인
    const { data: existing } = await supabase
      .from('prompt_history')
      .select('id')
      .eq('character_id', character_id)
      .eq('round_number', round.round_number)
      .maybeSingle()

    if (existing) {
      return errorResponse('ALREADY_SUBMITTED', 400, '이미 이번 라운드에 제출했습니다')
    }

    // 6. AI 점수 평가 (임시: 랜덤 점수)
    // TODO: OpenAI/Claude/Gemini API 연동
    const scores = {
      strength: Math.floor(Math.random() * 30) + 5,
      charm: Math.floor(Math.random() * 30) + 5,
      creativity: Math.floor(Math.random() * 30) + 5,
    }
    scores.total = scores.strength + scores.charm + scores.creativity

    // 7. prompt_history 저장
    const { data: promptHistory, error: historyError } = await supabase
      .from('prompt_history')
      .insert({
        character_id,
        user_id: user.id,
        prompt: prompt.trim(),
        round_number: round.round_number,
        strength_gained: scores.strength,
        charm_gained: scores.charm,
        creativity_gained: scores.creativity,
        total_score_gained: scores.total,
      })
      .select()
      .single()

    if (historyError) {
      return errorResponse('SUBMISSION_FAILED', 500, '제출에 실패했습니다')
    }

    // 8. characters 점수 업데이트
    const { data: character } = await supabase
      .from('characters')
      .select('*')
      .eq('id', character_id)
      .single()

    if (!character) {
      return errorResponse('CHARACTER_NOT_FOUND', 404)
    }

    const { data: updatedCharacter, error: updateError } = await supabase
      .from('characters')
      .update({
        current_prompt: prompt.trim(),
        strength: character.strength + scores.strength,
        charm: character.charm + scores.charm,
        creativity: character.creativity + scores.creativity,
        total_score: character.total_score + scores.total,
      })
      .eq('id', character_id)
      .select()
      .single()

    if (updateError) {
      return errorResponse('UPDATE_FAILED', 500, '캐릭터 업데이트에 실패했습니다')
    }

    // 9. 성공 응답
    return successResponse({
      prompt_history_id: promptHistory.id,
      round_number: round.round_number,
      scores: {
        strength: scores.strength,
        charm: scores.charm,
        creativity: scores.creativity,
        total: scores.total,
      },
      character: {
        total_score: updatedCharacter.total_score,
        strength: updatedCharacter.strength,
        charm: updatedCharacter.charm,
        creativity: updatedCharacter.creativity,
      },
    })
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 500, (error as Error).message)
  }
})
