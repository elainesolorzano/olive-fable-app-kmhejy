
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://lynqyzidefvwttxbwarb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bnF5emlkZWZ2d3R0eGJ3YXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMDI2MjAsImV4cCI6MjA4Mjg3ODYyMH0.43P6Mq85RJiQyubR0ie072KDRxy7m3JjHMNW78b8Xjg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
