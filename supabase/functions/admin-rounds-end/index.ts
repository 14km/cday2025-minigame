import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handleCors } from '../_shared/cors.ts'
import { successResponse, errorResponse } from '../_shared/response.ts'
import { verifyAdmin } from '../_shared/adminAuth.ts'

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    // 1. Admin 권한 확인
    const { error, status, admin, supabase } = await verifyAdmin(req, 'rounds')
    if (error || !admin || !supabase) {
      return errorResponse(error!, status)
    }

    // 2. Request Body 파싱
    const { notes } = await req.json()

    // 3. 현재 활성 라운드 조회
    const { data: currentRound } = await supabase
      .from('game_rounds')
      .select('*')
      .eq('is_active', true)
      .maybeSingle()

    if (!currentRound) {
      return errorResponse('NO_ACTIVE_ROUND', 400, '활성화된 라운드가 없습니다')
    }

    // 4. 라운드 종료
    const { data: round, error: updateError } = await supabase
      .from('game_rounds')
      .update({
        is_active: false,
        status: 'completed',
        actual_end_time: new Date().toISOString(),
        ended_by: admin.id,
        notes: notes || null,
      })
      .eq('id', currentRound.id)
      .select()
      .single()

    if (updateError || !round) {
      return errorResponse('ROUND_END_FAILED', 400, '라운드 종료에 실패했습니다')
    }

    // 5. 리더보드 스냅샷 생성
    const { data: characters } = await supabase
      .from('characters')
      .select('*')
      .eq('is_active', true)
      .order('total_score', { ascending: false })

    if (characters && characters.length > 0) {
      const snapshots = characters.map((char, index) => ({
        round_number: currentRound.round_number,
        character_id: char.id,
        user_id: char.user_id,
        rank: index + 1,
        total_score: char.total_score,
        strength: char.strength,
        charm: char.charm,
        creativity: char.creativity,
      }))

      await supabase.from('leaderboard_snapshots').insert(snapshots)
    }

    // 6. Audit log 기록
    await supabase.from('admin_audit_log').insert({
      admin_id: admin.id,
      action: 'END_ROUND',
      resource_type: 'game_rounds',
      resource_id: currentRound.id,
      changes: {
        status: 'active -> completed',
        snapshot_count: characters?.length || 0,
      },
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent'),
    })

    return successResponse({
      round,
      snapshot_created: true,
      leaderboard_count: characters?.length || 0,
    })
  } catch (error) {
    return errorResponse('INTERNAL_ERROR', 500, (error as Error).message)
  }
})
