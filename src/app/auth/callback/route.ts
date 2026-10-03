import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_WHITELIST = ['aqotbi@babfez.ma', 'anoirqotbi87@gmail.com'];

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');
  const context = (requestUrl.searchParams.get('context') || 'proprietaire') as 'admin' | 'proprietaire';
  const errorParam = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  const origin = requestUrl.origin;

  // Détection de la langue
  const lang =
    requestUrl.searchParams.get('lang') ||
    next?.match(/^\/([a-z]{2})/)?.[1] ||
    'fr';

  const defaultDestination =
    context === 'admin' ? `/${lang}/admin/dashboard` : `/${lang}/proprietaire/dashboard`;
  const destination = next || defaultDestination;
  const fullDestination = destination.startsWith('http')
    ? destination
    : `${origin}${destination.startsWith('/') ? destination : `/${destination}`}`;

  const loginFallback = `${origin}/${lang}/${context === 'admin' ? 'admin' : 'proprietaire'}/login?error=oauth_failed`;

  // Si Google ou le fournisseur a renvoyé une erreur ou si aucun code n'est présent
  if (errorParam || !code) {
    console.error('OAuth callback error parameter:', errorParam, errorDescription);
    return NextResponse.redirect(loginFallback);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ckbhcwlpnybfrxwcjfwq.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrYmhjd2xwbnliZnJ4d2NqZndxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTcxODksImV4cCI6MjEwNTU3MzE4OX0.bwffYV1PLexgh1u_AKbXBi4bDXiUu4wBItbXQzvYjLo';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Récupération du PKCE code_verifier depuis les cookies
  let codeVerifier = request.cookies.get('sb-code-verifier')?.value;
  if (!codeVerifier) {
    for (const c of request.cookies.getAll()) {
      if (c.name.includes('code-verifier')) {
        codeVerifier = c.value;
        break;
      }
    }
  }

  // Storage SSR pour alimenter le client Supabase avec le code verifier
  const serverStorage = {
    getItem: (key: string) => {
      if (key.includes('code-verifier') && codeVerifier) {
        return codeVerifier;
      }
      return null;
    },
    setItem: () => {},
    removeItem: () => {},
  };

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: serverStorage,
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user && data?.session) {
      const user = data.user;
      const session = data.session;
      const userEmail = (user.email || '').toLowerCase();

      // 1. Détermination du rôle
      const isWhitelistedAdmin = ADMIN_WHITELIST.includes(userEmail);
      let userRole: 'admin' | 'owner' = isWhitelistedAdmin ? 'admin' : (context === 'admin' ? 'admin' : 'owner');

      // Tentative de synchronisation du profil
      if (supabaseServiceKey) {
        try {
          const dbClient = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
          const { data: existingProfile } = await dbClient
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();

          if (existingProfile) {
            // Profil trouvé
          }
        } catch (dbErr) {
          console.warn('Sync profile notice:', dbErr);
        }
      }

      // 2. Verrouillage strict de l'accès Super-Admin
      if (context === 'admin' && !isWhitelistedAdmin && userRole !== 'admin') {
        console.warn(`Tentative d'accès non autorisé à l'admin par ${userEmail}`);
        return NextResponse.redirect(`${origin}/${lang}/admin/login?error=unauthorized_admin`);
      }

      // 3. Poser les cookies de session et rediriger vers le dashboard
      const response = NextResponse.redirect(fullDestination);
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

      response.cookies.set(
        'babfez-auth-user',
        encodeURIComponent(
          JSON.stringify({
            id: user.id,
            email: user.email,
            fullName: user.user_metadata?.full_name || user.user_metadata?.name || 'Anoir Qotbi',
            username: isWhitelistedAdmin ? 'Aqotbi' : user.email?.split('@')[0] || 'User',
            role: userRole,
          })
        ),
        {
          path: '/',
          httpOnly: false,
          secure: isProd,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        }
      );

      // Supprimer le cookie temporaire de code-verifier
      response.cookies.delete('sb-code-verifier');

      return response;
    }
  } catch (err: any) {
    console.warn('Erreur échange de code SSR Supabase :', err?.message);
  }

  // 4. Fallback Client-side : si le serveur n'avait pas le cookie verifier,
  // le navigateur détient le verifier dans son localStorage et peut finaliser l'échange !
  const fallbackHtml = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Connexion BABFEZ...</title>
  <style>
    body {
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #0B2545;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      text-align: center;
      padding: 20px;
    }
    .spinner {
      width: 48px;
      height: 48px;
      border: 3.5px solid rgba(197, 155, 39, 0.25);
      border-top-color: #C59B27;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 24px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .logo { width: 56px; height: 56px; margin-bottom: 20px; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <img src="/icons/logo.svg" alt="BABFEZ" class="logo" onerror="this.src='/icon-192.png'"/>
  <div class="spinner"></div>
  <p style="font-size: 1.15rem; font-weight: 700; color: #C59B27; margin: 0 0 8px;">Authentification en cours...</p>
  <p style="font-size: 0.875rem; opacity: 0.7; margin: 0;">Veuillez patienter pendant la sécurisation de votre session BABFEZ.</p>

  <script>
    (async function() {
      try {
        const client = window.supabase.createClient("${supabaseUrl}", "${supabaseAnonKey}");
        const { data, error } = await client.auth.exchangeCodeForSession("${code}");
        if (error || !data || !data.session) throw (error || new Error('Session exchange failed'));

        const user = data.user;
        const email = (user.email || '').toLowerCase();
        const isWhitelisted = email === 'aqotbi@babfez.ma' || email === 'anoirqotbi87@gmail.com';
        const role = isWhitelisted ? 'admin' : ('${context}' === 'admin' ? 'admin' : 'owner');

        const userObj = {
          id: user.id,
          email: user.email,
          fullName: user.user_metadata?.full_name || user.user_metadata?.name || 'Anoir Qotbi',
          username: isWhitelisted ? 'Aqotbi' : (user.email?.split('@')[0] || 'User'),
          role: role
        };

        const maxAge = 60 * 60 * 24 * 7;
        document.cookie = "babfez-auth-role=" + role + "; path=/; max-age=" + maxAge + "; SameSite=Lax";
        document.cookie = "babfez-auth-user=" + encodeURIComponent(JSON.stringify(userObj)) + "; path=/; max-age=" + maxAge + "; SameSite=Lax";
        document.cookie = "sb-access-token=" + data.session.access_token + "; path=/; max-age=" + maxAge + "; SameSite=Lax";
        document.cookie = "sb-refresh-token=" + data.session.refresh_token + "; path=/; max-age=" + maxAge + "; SameSite=Lax";

        if ('${context}' === 'admin') {
          localStorage.setItem("babfez_admin_logged_in", "true");
          localStorage.setItem("babfez_user", JSON.stringify(userObj));
        } else {
          localStorage.setItem("babfez_owner_logged_in", "true");
          localStorage.setItem("babfez_owner_user", JSON.stringify(userObj));
        }

        window.location.replace("${fullDestination}");
      } catch (e) {
        console.error('Client-side exchange failed:', e);
        window.location.replace("${loginFallback}");
      }
    })();
  </script>
</body>
</html>`;

  return new NextResponse(fallbackHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
