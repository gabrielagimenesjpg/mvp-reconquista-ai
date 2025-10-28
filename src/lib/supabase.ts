import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface UserProfile {
  id: string
  user_id: string
  relationship_type: string
  breakup_reason: string
  ex_type: string
  time_since_breakup: string
  goal_type: string
  created_at: string
  updated_at: string
}

export interface DailyMessage {
  id: string
  user_id: string
  message: string
  day_number: number
  phase: string
  completed: boolean
  completed_at?: string
  created_at: string
}

export interface EmotionalCheckin {
  id: string
  user_id: string
  mood: string
  energy_level: number
  confidence_level: number
  notes?: string
  created_at: string
}

export interface Achievement {
  id: string
  user_id: string
  type: string
  title: string
  description: string
  badge_icon: string
  earned_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  current_day: number
  current_phase: string
  total_points: number
  level: number
  streak_days: number
  last_activity: string
  created_at: string
  updated_at: string
}