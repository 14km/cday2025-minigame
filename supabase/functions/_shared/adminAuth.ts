import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function verifyAdmin(req: Request, requiredPermission?: string) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return { error: 'No token provided', status: 401, admin: null, supabase: null }
  }

  const token = authHeader.replace('Bearer ', '')
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 1. JWT 검증
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token)

  if (authError || !user) {
    return { error: 'Invalid token', status: 401, admin: null, supabase }
  }

  // 2. Admin 확인
  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  if (adminError || !admin) {
    return { error: 'Admin permission required', status: 403, admin: null, supabase }
  }

  // 3. 특정 권한 확인
  if (requiredPermission && !admin.permissions[requiredPermission]) {
    return {
      error: `No ${requiredPermission} permission`,
      status: 403,
      admin: null,
      supabase,
    }
  }

  return { error: null, status: 200, admin, supabase }
}
