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

    const { user_id, reason, duration_hours } = await req.json()

    if (!user_id || !reason) {
      return errorResponse('INVALID_REQUEST', 400, 'user_id와 reason이 필요합니다')
    }

    // Ban 기한 계산
    const bannedUntil = duration_hours
      ? new Date(Date.now() + duration_hours * 60 * 60 * 1000).toISOString()
      : null

    // 1. 사용자 Ban
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(user_id, {
      ban_duration: duration_hours ? `${duration_hours}h` : 'indefinite',
    })

    if (updateError) {
      return errorResponse('BAN_FAILED', 500, updateError.message)
    }

    // 2. Audit log
    await supabase.from('admin_audit_log').insert({
      admin_id: admin.id,
      action: 'BAN_USER',
      resource_type: 'auth.users',
      resource_id: user_id,
      changes: {
        reason,
        duration_hours: duration_hours || 'indefinite',
        banned_until: bannedUntil,
      },
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent'),
    })

    return successResponse({
      message: 'User banned successfully',
      user: data.user,
      banned_until: bannedUntil,
    })
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 500, (error as Error).message)
  }
})
