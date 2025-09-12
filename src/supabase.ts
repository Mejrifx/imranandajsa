import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uwclrkfbdexltbagiaxx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3Y2xya2ZiZGV4bHRiYWdpYXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MzUwNDgsImV4cCI6MjA3MzIxMTA0OH0.ONduWbAqk_-mEYmXJoMGktNVu0UbgBEXmufRVyz4sxM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Note {
  id: string
  from_user: string
  message: string
  created_at: string
  updated_at: string
}

export interface Movie {
  id: string
  title: string
  added_by: string
  created_at: string
}

export interface Favorite {
  id: string
  type: string
  name: string
  person: string
  emoji: string
  created_at: string
}

export interface BucketListItem {
  id: string
  item: string
  created_at: string
}

export interface UserMood {
  id: string
  user_name: string
  mood_emoji: string
  mood_text: string
  updated_at: string
}
