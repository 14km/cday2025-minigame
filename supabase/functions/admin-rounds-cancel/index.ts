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

    const { round_id, reason } = await req.json()

    if (!round_id) {
      return errorResponse('INVALID_REQUEST', 400, 'round_id가 필요합니다')
    }

    // 라운드 취소
    const { data: round, error: updateError } = await supabase
      .from('game_rounds')
      .update({
        is_active: false,
        status: 'cancelled',
        notes: reason || 'Admin cancelled',
      })
      .eq('id', round_id)
      .in('status', ['scheduled', 'active'])
      .select()
      .single()

    if (updateError || !round) {
      return errorResponse(
        'ROUND_CANCEL_FAILED',
        400,
        '라운드 취소 실패 (이미 완료되었거나 존재하지 않음)'
      )
    }

    // Audit log
    await supabase.from('admin_audit_log').insert({
      admin_id: admin.id,
      action: 'CANCEL_ROUND',
      resource_type: 'game_rounds',
      resource_id: round_id,
      changes: { status: `${round.status} -> cancelled`, reason },
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent'),
    })

    return successResponse({ round })
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 500, (error as Error).message)
  }
})
