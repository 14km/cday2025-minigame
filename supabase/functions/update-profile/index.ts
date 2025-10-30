import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handleCors } from '../_shared/cors.ts'
import { errorResponse, successResponse } from '../_shared/response.ts'
import { verifyUser } from '../_shared/auth.ts'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { error, status, user, supabase } = await verifyUser(req)
    if (error || !user || !supabase) {
      return errorResponse(error!, status)
    }

    const { display_name, avatar_url } = await req.json()

    if (!display_name && !avatar_url) {
      return errorResponse('MISSING_FIELDS', 400, 'At least one field is required')
    }

    // Update user metadata in auth.users
    const updateData: { display_name?: string; avatar_url?: string } = {}
    if (display_name) updateData.display_name = display_name
    if (avatar_url) updateData.avatar_url = avatar_url

    const { data, error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        ...updateData,
      },
    })

    if (updateError) {
      return errorResponse('UPDATE_FAILED', 500, updateError.message)
    }

    return successResponse({
      user: data.user,
      message: 'Profile updated successfully',
    })
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 500, (error as Error).message)
  }
})
