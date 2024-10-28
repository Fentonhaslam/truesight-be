import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types';

let cachedSupabaseClient: SupabaseClient<Database>;

export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (!cachedSupabaseClient) {
    cachedSupabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
  }
  return cachedSupabaseClient;
};