import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createSupabaseClient } from '../_shared/db.ts'
import { errorResponse, successResponse } from '../_shared/response.ts'
import { withLogging } from '../_shared/withLogging.ts'

serve(
  withLogging('get-current-round', async (req, logger) => {
    try {
      const supabase = createSupabaseClient()

      const { data: round, error } = await supabase
        .from('game_rounds')
        .select('*')
        .eq('is_active', true)
        .maybeSingle()

      if (error) {
        logger.logError(500, error.message)
        return errorResponse('DATABASE_ERROR', 500, error.message)
      }

      if (!round) {
        logger.logError(404, '활성 라운드가 없습니다')
        return errorResponse('NO_ACTIVE_ROUND', 404, '활성 라운드가 없습니다')
      }

      const now = Date.now()
      const end = new Date(round.end_time).getTime()
      const diff = Math.max(0, end - now)
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      const timeRemaining = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

      const responseData = {
        id: round.id,
        round_number: round.round_number,
        start_time: round.start_time,
        end_time: round.end_time,
        time_remaining: timeRemaining,
        is_active: round.is_active,
        status: round.status,
      }

      logger.logSuccess(200, responseData)
      return successResponse(responseData)
    } catch (error) {
      const errorMsg = (error as Error).message
      logger.logError(500, errorMsg)
      return errorResponse('INTERNAL_ERROR', 500, errorMsg)
    }
  })
)
