import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { errorResponse, successResponse } from '../_shared/response.ts'
import { verifyUser } from '../_shared/auth.ts'
import { withLogging } from '../_shared/withLogging.ts'

serve(
  withLogging('get-my-prompts', async (req, logger) => {
    try {
      const { error: authError, status, user, supabase } = await verifyUser(req)
      logger.setUser(user?.id, user?.email)

      if (authError || !supabase) {
        logger.logError(status, authError || 'UNAUTHORIZED')
        return errorResponse(authError || 'UNAUTHORIZED', status)
      }

      // Parse from body (POST request)
      const body = await req.json()
      const limit = body?.limit || 20
      const offset = body?.offset || 0
      logger.setRequestBody({ limit, offset })

      const { data: character } = await supabase
        .from('characters')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!character) {
        logger.logError(404, '활성 캐릭터가 없습니다')
        return errorResponse('CHARACTER_NOT_FOUND', 404, '활성 캐릭터가 없습니다')
      }

      const {
        data: prompts,
        error: promptError,
        count,
      } = await supabase
        .from('prompt_history')
        .select('*', { count: 'exact' })
        .eq('character_id', character.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (promptError) {
        logger.logError(500, promptError.message)
        return errorResponse('DATABASE_ERROR', 500, promptError.message)
      }

      const responseData = {
        data: prompts || [],
        pagination: {
          total: count || 0,
          limit,
          offset,
        },
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
