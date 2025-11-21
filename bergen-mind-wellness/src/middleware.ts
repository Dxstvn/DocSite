import { i18nRouter } from 'next-i18n-router';
import { NextRequest, NextResponse } from 'next/server';
import i18nConfig from './i18nConfig';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // First, handle locale routing
  const i18nResponse = i18nRouter(request, i18nConfig);

  // If i18nRouter returned a redirect, apply it
  if (i18nResponse) {
    return i18nResponse;
  }

  // Then handle Supabase session update and auth
  const supabaseResponse = await updateSession(request);

  return supabaseResponse;
}

// Apply middleware to all routes except:
// - API routes
// - Static files
// - Images
// - _next internal routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|images|downloads).*)',
  ],
};
