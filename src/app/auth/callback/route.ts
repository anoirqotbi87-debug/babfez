import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_WHITELIST = ['aqotbi@babfez.ma', 'anoirqotbi87@gmail.com'];

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';
  const context = (requestUrl.searchParams.get('context') || 'proprietaire') as 'admin' | 'proprietaire';
  const errorParam = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  const origin = requestUrl.origin;

  // Si une erreur OAuth est retournée par Google ou Supabase
  if (errorParam || !code) {
    console.error('OAuth callback error:', errorParam, errorDescription);
    const fallbackPath = context === 'admin' ? '/admin/login?error=unauthorized' : '/proprietaire/login?error=unauthorized';
    return NextResponse.redirect(`${origin}${fallbackPath}`);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Supabase client pour l'échange de code PKCE
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data?.user || !data?.session) {
    console.error('Erreur échange de code PKCE:', error?.message);
    const fallbackPath = context === 'admin' ? '/admin/login?error=unauthorized' : '/proprietaire/login?error=unauthorized';
    return NextResponse.redirect(`${origin}${fallbackPath}`);
  }

  const user = data.user;
  const session = data.session;
  const userEmail = (user.email || '').toLowerCase();

  // Client avec droits de service pour l'écriture sécurisée dans public.profiles si clé dispo
  const dbClient = supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })
    : supabase;

  // 1. Vérification des droits Admin (Whitelist stricte)
  const isWhitelistedAdmin = ADMIN_WHITELIST.includes(userEmail);
  let userRole: 'admin' | 'owner' = isWhitelistedAdmin ? 'admin' : 'owner';

  try {
    const { data: existingProfile } = await dbClient
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .maybeSingle();

    if (existingProfile?.role === 'admin') {
      userRole = 'admin';
    }

    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      (userEmail ? userEmail.split('@')[0] : 'Utilisateur BABFEZ');

    const avatarUrl = user.user_metadata?.avatar_url || '';

    // Synchronisation automatique du profil dans public.profiles
    await dbClient.from('profiles').upsert(
      {
        id: user.id,
        email: user.email,
        full_name: fullName,
        avatar_url: avatarUrl,
        role: userRole,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
  } catch (profileErr: any) {
    console.warn('Notice synchronisation profil (non bloquant) :', profileErr?.message);
  }

  // 2. Verrouillage strict de l'accès Super-Admin
  if (context === 'admin' && userRole !== 'admin') {
    console.warn(`Tentative d'accès non autorisé à l'admin par ${userEmail}`);
    return NextResponse.redirect(`${origin}/admin/login?error=unauthorized_admin`);
  }

  // 3. Préparation de la redirection et des cookies de session
  let destination = next;
  if (!destination.startsWith('http')) {
    destination = `${origin}${destination.startsWith('/') ? destination : `/${destination}`}`;
  }

  const response = NextResponse.redirect(destination);

  // Configuration des cookies de session conformes aux standards SSR Next.js & Supabase
  const isProd = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    path: '/',
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  };

  response.cookies.set('sb-access-token', session.access_token, cookieOptions);
  response.cookies.set('sb-refresh-token', session.refresh_token, cookieOptions);

  // Cookie de rôle pour lecture côté client et synchronisation avec localStorage
  response.cookies.set('babfez-auth-role', userRole, {
    path: '/',
    httpOnly: false,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.set('babfez-auth-user', encodeURIComponent(JSON.stringify({
    id: user.id,
    email: user.email,
    fullName: user.user_metadata?.full_name || user.user_metadata?.name || 'Anoir Qotbi',
    username: isWhitelistedAdmin ? 'Aqotbi' : (user.email?.split('@')[0] || 'User'),
    role: userRole,
  })), {
    path: '/',
    httpOnly: false,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
