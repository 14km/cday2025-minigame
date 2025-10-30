export interface AdminRound {
  id: string
  round_number: number
  start_time: string
  end_time: string
  actual_end_time?: string
  is_active: boolean
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  started_by?: string
  ended_by?: string
  notes?: string
  created_at: string
}

export interface AdminPrompt {
  id: string
  character_id: string
  user_id: string
  prompt_text: string
  prompt: string
  round_number: number
  strength_gained: number
  charm_gained: number
  creativity_gained: number
  total_score_gained: number
  score_change: number
  submitted_at: string
  created_at: string
  user_email?: string
  character_name?: string
  characters?: {
    name: string
    user_id: string
  }
}

export interface AdminUser {
  id: string
  user_id: string
  email: string
  name: string
  strength: number
  charm: number
  creativity: number
  total_score: number
  is_banned: boolean
  banned_at?: string
  ban_reason?: string
  role: 'user' | 'admin' | 'super_admin'
  character_count: number
  prompt_count: number
  last_submission_round?: number
  created_at: string
  updated_at: string
  prompt_history?: { count: number }[]
}

export interface AdminUserDetail {
  user: AdminUser
  characters: Array<{
    id: string
    name: string
    total_score: number
    created_at: string
  }>
  prompts: Array<{
    id: string
    round_number: number
    prompt_text: string
    score_change: number
    created_at: string
  }>
}

export interface AdminStats {
  total_users: number
  total_characters: number
  total_prompts: number
  total_rounds: number
  active_round?: {
    id: string
    round_number: number
    start_time: string
    end_time: string
    status: string
    is_active: boolean
    participants?: number
    submission_rate?: number
  } | null
  recent_activity?: {
    last_1_hour: number
    last_24_hours: number
  }
}

export interface RoundStats {
  round: AdminRound
  stats: {
    total_prompts: number
    unique_users: number
    average_scores: {
      strength: number
      charm: number
      creativity: number
      total: number
    }
  }
  top_prompts: AdminPrompt[]
}

export interface UserStat {
  user_id: string
  email: string
  character_count: number
  prompt_count: number
  avg_score_change: number
  max_score: number
  created_at: string
}

export interface UserStats {
  total_users: number
  active_users_7d: number
  new_users_7d: number
  total_prompts: number
  avg_prompts_per_user: string
  users: UserStat[]
}

// JSON value types for audit logs
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

export interface AuditLog {
  id: string
  admin_id: string
  admin_email: string
  action: string
  resource_type: string
  resource_id?: string
  target_id?: string
  changes?: Record<string, JsonValue>
  details?: Record<string, JsonValue>
  ip_address?: string
  user_agent?: string
  created_at: string
}
