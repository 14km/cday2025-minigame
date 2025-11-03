import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createSupabaseClient } from '../_shared/db.ts'
import { errorResponse, successResponse } from '../_shared/response.ts'
import { withLogging } from '../_shared/withLogging.ts'

serve(
  withLogging('get-round-info', async (req, logger) => {
    try {
      const { roundId } = await req.json()
      logger.setRequestBody({ roundId })

      if (!roundId) {
        logger.logError(400, 'Round ID is required')
        return errorResponse('MISSING_ROUND_ID', 400, 'Round ID is required')
      }

      const supabase = createSupabaseClient()

      const { data: round, error } = await supabase
        .from('game_rounds')
        .select('*')
        .eq('id', roundId)
        .single()

      if (error) {
        logger.logError(500, error.message)
        return errorResponse('DATABASE_ERROR', 500, error.message)
      }

      if (!round) {
        logger.logError(404, 'Round not found')
        return errorResponse('ROUND_NOT_FOUND', 404, 'Round not found')
      }

      logger.logSuccess(200, round)
      return successResponse(round)
    } catch (error) {
      const errorMsg = (error as Error).message
      logger.logError(500, errorMsg)
      return errorResponse('INTERNAL_ERROR', 500, errorMsg)
    }
  })
)
