import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if the request is for the admin panel
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Exclude the login page itself to avoid redirect loops
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        // Check for the admin_user_id cookie
        const adminSession = request.cookies.get('admin_user_id');

        // If no session exists, redirect to the login page
        if (!adminSession) {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    const response = NextResponse.next();

    // Add security headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' https://images.unsplash.com https://s7g10.scene7.com data:; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:;");

    return response;
}

export const config = {
    matcher: ['/admin/:path*', '/api/admin/:path*'],
};
