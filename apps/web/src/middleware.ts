import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This configuration ensures the middleware only runs for /admin routes
export const config = {
  matcher: ['/admin/:path*'],
};

export function middleware(request: NextRequest) {
  // Check for the 'accessToken' cookie we set during login
  const token = request.cookies.get('accessToken')?.value;

  // If there is no token, redirect the user back to the login page
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If the token exists, let them proceed to the admin panel
  return NextResponse.next();
}
