import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handleCors } from '../_shared/cors.ts'
import { errorResponse, successResponse } from '../_shared/response.ts'
import { verifyAdmin } from '../_shared/adminAuth.ts'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { error, status, admin, supabase } = await verifyAdmin(req, 'users')
    if (error || !admin || !supabase) {
      return errorResponse(error!, status)
    }

    const { user_id } = await req.json()

    if (!user_id) {
      return errorResponse('INVALID_REQUEST', 400, 'user_id가 필요합니다')
    }

    // 1. Unban 처리
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(user_id, {
      ban_duration: 'none',
    })

    if (updateError) {
      return errorResponse('UNBAN_FAILED', 500, updateError.message)
    }

    // 2. Audit log
    await supabase.from('admin_audit_log').insert({
      admin_id: admin.id,
      action: 'UNBAN_USER',
      resource_type: 'auth.users',
      resource_id: user_id,
      changes: { unbanned: true },
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent'),
    })

    return successResponse({
      message: 'User unbanned successfully',
      user: data.user,
    })
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 500, (error as Error).message)
  }
})
