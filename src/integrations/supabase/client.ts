
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://yrpsnjhqrqjdfujfagdb.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlycHNuamhxcnFqZGZ1amZhZ2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0NjA3MDAsImV4cCI6MjA0OTAzNjcwMH0.TqFJr8Usp3Bgu6JxJhEJnOCY1H3lNs0xFyJ4Xc8G9O8"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
