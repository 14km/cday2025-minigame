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

    const { round_id, new_end_time } = await req.json()

    if (!round_id || !new_end_time) {
      return errorResponse('INVALID_REQUEST', 400, 'round_id와 new_end_time이 필요합니다')
    }

    // 라운드 조회
    const { data: round } = await supabase
      .from('game_rounds')
      .select('*')
      .eq('id', round_id)
      .single()

    if (!round) {
      return errorResponse('ROUND_NOT_FOUND', 404, '라운드를 찾을 수 없습니다')
    }

    // 새 종료 시간 검증
    const newEndDate = new Date(new_end_time)
    const startDate = new Date(round.start_time)

    if (newEndDate <= startDate) {
      return errorResponse(
        'INVALID_TIME_RANGE',
        400,
        'new_end_time은 start_time보다 이후여야 합니다'
      )
    }

    // 라운드 연장
    const { data: updated, error: updateError } = await supabase
      .from('game_rounds')
      .update({ end_time: new_end_time })
      .eq('id', round_id)
      .select()
      .single()

    if (updateError) {
      return errorResponse('ROUND_EXTEND_FAILED', 500, updateError.message)
    }

    // Audit log
    await supabase.from('admin_audit_log').insert({
      admin_id: admin.id,
      action: 'EXTEND_ROUND',
      resource_type: 'game_rounds',
      resource_id: round_id,
      changes: { old_end_time: round.end_time, new_end_time },
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent'),
    })

    return successResponse({ round: updated })
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 500, (error as Error).message)
  }
})
