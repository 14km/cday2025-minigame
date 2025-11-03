import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { verifyAdmin } from '../_shared/adminAuth.ts'
import { errorResponse, successResponse } from '../_shared/response.ts'
import { withLogging } from '../_shared/withLogging.ts'
import { keysToCamelCase } from '../_shared/camelCase.ts'

serve(
  withLogging('admin-users-list', async (req, logger) => {
    try {
      const { error, status, admin, supabase } = await verifyAdmin(req)
      logger.setUser(admin?.id, admin?.email)

      if (error || !admin || !supabase) {
        logger.logError(status, error!)
        return errorResponse(error!, status)
      }

      const { search, limit = 50, offset = 0 } = await req.json()
      logger.setRequestBody({ search, limit, offset })

      let query = supabase.from('characters').select(
        `
        *,
        prompt_history(count)
      `,
        { count: 'exact' }
      )

      // 검색 (캐릭터 이름으로)
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      query = query.order('total_score', { ascending: false }).range(offset, offset + limit - 1)

      const { data: characters, error: queryError, count } = await query

      if (queryError) {
        logger.logError(500, queryError.message)
        return errorResponse('DATABASE_ERROR', 500, queryError.message)
      }

      const responseData = {
        users: keysToCamelCase(characters || []),
        total: count || 0,
        limit,
        offset,
      }
      logger.logSuccess(200, responseData)
      return successResponse(responseData)
    } catch (error) {
      logger.logError(500, (error as Error).message)
      return errorResponse('INTERNAL_ERROR', 500, (error as Error).message)
    }
  })
)
