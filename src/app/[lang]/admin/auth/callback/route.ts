import { NextRequest } from 'next/server';
import { GET as handleCallback } from '@/app/auth/callback/route';

export async function GET(
  request: NextRequest,
  { params }: { params: { lang: string } }
) {
  const url = new URL(request.url);
  if (!url.searchParams.has('context')) {
    url.searchParams.set('context', 'admin');
  }
  if (!url.searchParams.has('lang') && params.lang) {
    url.searchParams.set('lang', params.lang);
  }
  if (!url.searchParams.has('next')) {
    url.searchParams.set('next', `/${params.lang || 'fr'}/admin/dashboard`);
  }

  const modifiedRequest = new NextRequest(url.toString(), {
    headers: request.headers,
  });

  return handleCallback(modifiedRequest);
}
