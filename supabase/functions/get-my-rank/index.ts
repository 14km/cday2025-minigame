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
    const { character_id } = await req.json()

    // 3. 내 캐릭터 정보 조회
    const { data: myCharacter, error: charError } = await supabase
      .from('characters')
      .select('total_score, strength, charm, creativity')
      .eq('id', character_id)
      .eq('is_active', true)
      .single()

    if (charError || !myCharacter) {
      return errorResponse('CHARACTER_NOT_FOUND', 404)
    }

    // 4. 전체 활성 캐릭터 수 조회
    const { count: totalParticipants } = await supabase
      .from('characters')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // 5. 내 순위 계산 (내 점수보다 높은 캐릭터 수 + 1)
    const { count: higherRanks } = await supabase
      .from('characters')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .gt('total_score', myCharacter.total_score)

    const rank = (higherRanks || 0) + 1
    const percentile = totalParticipants
      ? ((totalParticipants - rank + 1) / totalParticipants) * 100
      : 0

    // 6. 응답
    return successResponse({
      rank,
      total_participants: totalParticipants || 0,
      percentile: Math.round(percentile * 10) / 10,
      character: {
        total_score: myCharacter.total_score,
        strength: myCharacter.strength,
        charm: myCharacter.charm,
        creativity: myCharacter.creativity,
      },
    })
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 500, (error as Error).message)
  }
})
