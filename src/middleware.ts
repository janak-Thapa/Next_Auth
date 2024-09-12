import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/login' || path === '/register';
  const token = request.cookies.get("token")?.value || "";

  // Log for debugging
  console.log('Public Path:', isPublicPath, 'Token:', token);

  // If the user is authenticated and tries to access a public page, redirect to the profile
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl));
  }

  // If the user is not authenticated and tries to access a protected page, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Otherwise, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/profile'],
};
