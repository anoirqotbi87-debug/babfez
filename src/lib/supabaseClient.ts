import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ckbhcwlpnybfrxwcjfwq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrYmhjd2xwbnliZnJ4d2NqZndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTcxODksImV4cCI6MjEwNTU3MzE4OX0.bwffYV1PLexgh1u_AKbXBi4bDXiUu4wBItbXQzvYjLo';

const isBrowser = typeof window !== 'undefined';

const hybridStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null;
    try {
      const localVal = window.localStorage.getItem(key);
      if (localVal) return localVal;
    } catch {}
    const match = document.cookie.match(new RegExp(`(?:^|; )${key.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`));
    return match ? decodeURIComponent(match[2]) : null;
  },
  setItem: (key: string, value: string): void => {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(key, value);
    } catch {}
    // Mirror code-verifier to cookie so server-side route can read it
    if (key.includes('code-verifier')) {
      document.cookie = `sb-code-verifier=${encodeURIComponent(value)}; path=/; max-age=3600; SameSite=Lax`;
    }
  },
  removeItem: (key: string): void => {
    if (!isBrowser) return;
    try {
      window.localStorage.removeItem(key);
    } catch {}
    if (key.includes('code-verifier')) {
      document.cookie = `sb-code-verifier=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isBrowser ? hybridStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
