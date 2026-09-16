import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  const sanitize = (val?: string) => (val ? val.replace(/[\\"'`]/g, '').trim() : '');
  
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ccydagfljcdnkkobyhwx.supabase.co';
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_8lvXhuJamTZ2xmlwCulnTw_N8q2mdLq';

  const supabaseUrl = sanitize(rawUrl) || 'https://ccydagfljcdnkkobyhwx.supabase.co';
  const supabaseAnonKey = sanitize(rawKey) || 'sb_publishable_8lvXhuJamTZ2xmlwCulnTw_N8q2mdLq';

  if (typeof window === 'undefined') {
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseClient;
}
