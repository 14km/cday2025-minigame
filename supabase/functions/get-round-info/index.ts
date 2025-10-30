import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handleCors } from '../_shared/cors.ts'
import { errorResponse, successResponse } from '../_shared/response.ts'
import { createSupabaseClient } from '../_shared/db.ts'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { roundId } = await req.json()

    if (!roundId) {
      return errorResponse('MISSING_ROUND_ID', 400, 'Round ID is required')
    }

    const supabase = createSupabaseClient()

    const { data: round, error } = await supabase
      .from('game_rounds')
      .select('*')
      .eq('id', roundId)
      .single()

    if (error) {
      return errorResponse('DATABASE_ERROR', 500, error.message)
    }

    if (!round) {
      return errorResponse('ROUND_NOT_FOUND', 404, 'Round not found')
    }

    return successResponse(round)
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 500, (error as Error).message)
  }
})
