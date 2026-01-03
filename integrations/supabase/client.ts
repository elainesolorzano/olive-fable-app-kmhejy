
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Fallback to hardcoded values if environment variables are not available
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://lynqyzidefvwttxbwarb.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bnF5emlkZWZ2d3R0eGJ3YXJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMDI2MjAsImV4cCI6MjA4Mjg3ODYyMH0.43P6Mq85RJiQyubR0ie072KDRxy7m3JjHMNW78b8Xjg';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file contains EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY'
  );
}

console.log('Supabase client initialized with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
