import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Get environment variables - use exact same approach as test file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || 'https://ttuoomryfewtmotaeigf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || 'sb_publishable_cZy-mEFHYmbfiw3bawGA9w_N6ebKHyn';

// Validate - but don't throw, just log
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Using fallback Supabase credentials. Check .env file.');
}

// Create Supabase client - EXACT same config as test file that works
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
