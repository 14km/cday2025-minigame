import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handleCors } from '../_shared/cors.ts'
import { successResponse, errorResponse } from '../_shared/response.ts'
import { verifyAdmin } from '../_shared/adminAuth.ts'

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // 1. Admin 권한 확인
    const { error, status, admin, supabase } = await verifyAdmin(req, 'rounds')
    if (error || !admin || !supabase) {
      return errorResponse(error!, status)
    }

    // 2. Request Body 파싱
    const { round_id } = await req.json()

    if (!round_id) {
      return errorResponse('INVALID_REQUEST', 400, 'round_id가 필요합니다')
    }

    // 3. 이미 활성화된 라운드가 있는지 확인
    const { data: activeRound } = await supabase
      .from('game_rounds')
      .select('id')
      .eq('is_active', true)
      .maybeSingle()

    if (activeRound) {
      return errorResponse('ROUND_ALREADY_ACTIVE', 400, '이미 활성화된 라운드가 있습니다')
    }

    // 4. 라운드 시작
    const { data: round, error: updateError } = await supabase
      .from('game_rounds')
      .update({
        is_active: true,
        status: 'active',
        started_by: admin.id,
      })
      .eq('id', round_id)
      .eq('status', 'scheduled')
      .select()
      .single()

    if (updateError || !round) {
      return errorResponse('ROUND_START_FAILED', 400, '라운드 시작에 실패했습니다')
    }

    // 5. Audit log 기록
    await supabase.from('admin_audit_log').insert({
      admin_id: admin.id,
      action: 'START_ROUND',
      resource_type: 'game_rounds',
      resource_id: round_id,
      changes: { status: 'scheduled -> active' },
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent'),
    })

    return successResponse({ round })
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 500, (error as Error).message)
  }
})
