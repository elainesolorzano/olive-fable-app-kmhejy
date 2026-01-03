
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://lynqyzidefvwttxbwarb.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bnF5emlkZWZ2d3R0eGJ3YXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMDI2MjAsImV4cCI6MjA4Mjg3ODYyMH0.43P6Mq85RJiQyubR0ie072KDRxy7m3JjHMNW78b8Xjg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
