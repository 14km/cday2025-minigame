import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handleCors } from '../_shared/cors.ts'
import { errorResponse, successResponse } from '../_shared/response.ts'
import { verifyAdmin } from '../_shared/adminAuth.ts'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { error, status, admin, supabase } = await verifyAdmin(req)
    if (error || !admin || !supabase) {
      return errorResponse(error!, status)
    }

    const { prompt_id, reason } = await req.json()

    if (!prompt_id) {
      return errorResponse('INVALID_REQUEST', 400, 'prompt_id가 필요합니다')
    }

    // 1. 프롬프트 정보 조회
    const { data: prompt, error: fetchError } = await supabase
      .from('prompt_history')
      .select('*, characters!inner(*)')
      .eq('id', prompt_id)
      .single()

    if (fetchError || !prompt) {
      return errorResponse('PROMPT_NOT_FOUND', 404, '프롬프트를 찾을 수 없습니다')
    }

    // 2. 캐릭터 점수 롤백
    const { error: rollbackError } = await supabase
      .from('characters')
      .update({
        strength: (prompt.characters as any).strength - prompt.strength_gained,
        charm: (prompt.characters as any).charm - prompt.charm_gained,
        creativity: (prompt.characters as any).creativity - prompt.creativity_gained,
        total_score: (prompt.characters as any).total_score - prompt.total_score_gained,
      })
      .eq('id', prompt.character_id)

    if (rollbackError) {
      return errorResponse('ROLLBACK_FAILED', 500, rollbackError.message)
    }

    // 3. 프롬프트 삭제
    const { error: deleteError } = await supabase
      .from('prompt_history')
      .delete()
      .eq('id', prompt_id)

    if (deleteError) {
      return errorResponse('DELETE_FAILED', 500, deleteError.message)
    }

    // 4. Audit log
    await supabase.from('admin_audit_log').insert({
      admin_id: admin.id,
      action: 'DELETE_PROMPT',
      resource_type: 'prompt_history',
      resource_id: prompt_id,
      changes: {
        prompt: prompt.prompt,
        scores_rolled_back: {
          strength: prompt.strength_gained,
          charm: prompt.charm_gained,
          creativity: prompt.creativity_gained,
          total: prompt.total_score_gained,
        },
        reason,
      },
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent'),
    })

    return successResponse({
      message: 'Prompt deleted and scores rolled back',
      rolled_back: {
        strength: prompt.strength_gained,
        charm: prompt.charm_gained,
        creativity: prompt.creativity_gained,
        total: prompt.total_score_gained,
      },
    })
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 500, (error as Error).message)
  }
})
