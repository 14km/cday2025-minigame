import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handleCors } from '../_shared/cors.ts'
import { errorResponse, successResponse } from '../_shared/response.ts'
import { createSupabaseClient } from '../_shared/db.ts'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { roundNumber, limit = 100, offset = 0 } = await req.json()

    if (!roundNumber) {
      return errorResponse('MISSING_ROUND_NUMBER', 400, 'Round number is required')
    }

    const supabase = createSupabaseClient()

    // Get leaderboard snapshot for the round
    const { data: snapshot, error: snapshotError } = await supabase
      .from('leaderboard_snapshots')
      .select('*')
      .eq('round_number', roundNumber)
      .order('rank', { ascending: true })
      .range(offset, offset + limit - 1)

    if (snapshotError) {
      return errorResponse('DATABASE_ERROR', 500, snapshotError.message)
    }

    if (!snapshot || snapshot.length === 0) {
      // If no snapshot, return empty array
      return successResponse([])
    }

    return successResponse(snapshot)
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 500, (error as Error).message)
  }
})
