import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://crjktsyzgqbeyjzveiiv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyamt0c3l6Z3FiZXlqenZlaWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDc2NzcsImV4cCI6MjA5MTcyMzY3N30.mYEsVBwazgd4zAVx4P5R4VA52muNwnoi1HibKmI7ZdM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)