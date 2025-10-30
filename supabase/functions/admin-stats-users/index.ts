import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handleCors } from '../_shared/cors.ts'
import { errorResponse, successResponse } from '../_shared/response.ts'
import { verifyAdmin } from '../_shared/adminAuth.ts'
import { keysToCamelCase } from '../_shared/camelCase.ts'

serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { error, status, admin, supabase } = await verifyAdmin(req)
    if (error || !admin || !supabase) {
      return errorResponse(error!, status)
    }

    const { limit = 50 } = await req.json()

    // Get user stats with character/prompt counts
    const { data: users, error: queryError } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        created_at,
        characters:characters(count),
        prompts:prompt_history(count)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (queryError) {
      return errorResponse('DATABASE_ERROR', 500, queryError.message)
    }

    // Transform to match UserStat interface
    const userStats = users?.map((user: any) => ({
      userId: user.id,
      email: user.email,
      characterCount: user.characters?.[0]?.count || 0,
      promptCount: user.prompts?.[0]?.count || 0,
      avgScoreChange: 0, // TODO: Calculate from prompt_history
      maxScore: 0, // TODO: Calculate from characters
      createdAt: user.created_at,
    })) || []

    return successResponse({
      users: userStats,
    })
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 500, (error as Error).message)
  }
})
