import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['fr', 'en', 'es', 'ar'];
const defaultLocale = 'fr';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Skip static assets, internal Next.js assets, API routes, and OAuth callbacks
  if (
    pathname.includes('.') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next();
  }

  // 2. Extract locale and normalized path
  const pathSegments = pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  const hasLocale = locales.includes(firstSegment);
  const currentLocale = hasLocale ? firstSegment : defaultLocale;
  const pathWithoutLocale = hasLocale ? '/' + pathSegments.slice(1).join('/') : pathname;

  // 3. RBAC - Protection de l'Espace Administrateur (/admin/*)
  const isAdminRoute = pathWithoutLocale.startsWith('/admin');
  const isAdminLogin = pathWithoutLocale === '/admin/login' || pathWithoutLocale === '/admin/login/';

  if (isAdminRoute && !isAdminLogin) {
    const roleCookie = request.cookies.get('babfez-auth-role')?.value;
    const hasAdminRole = roleCookie === 'admin';

    if (!hasAdminRole) {
      const loginUrl = new URL(`/${currentLocale}/admin/login`, request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. RBAC - Protection de l'Espace Propriétaire (/proprietaire/*)
  const isOwnerRoute = pathWithoutLocale.startsWith('/proprietaire');
  const isOwnerLogin = pathWithoutLocale === '/proprietaire/login' || pathWithoutLocale === '/proprietaire/login/';

  if (isOwnerRoute && !isOwnerLogin) {
    const roleCookie = request.cookies.get('babfez-auth-role')?.value;
    const hasOwnerRole = roleCookie === 'owner' || roleCookie === 'admin';

    if (!hasOwnerRole) {
      const loginUrl = new URL(`/${currentLocale}/proprietaire/login`, request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. Redirection de langue si le préfixe locale est absent
  if (!hasLocale) {
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
};
