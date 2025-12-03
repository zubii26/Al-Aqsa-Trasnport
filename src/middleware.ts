import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // Check if the request is for the admin panel
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Exclude the login page itself to avoid redirect loops
        if (request.nextUrl.pathname === '/admin/login') {
            return NextResponse.next();
        }

        // Check for the admin_token cookie
        const adminToken = request.cookies.get('admin_token');

        // If no token exists, redirect to the login page
        if (!adminToken) {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }

        // Verify the token
        try {
            const { verifyToken } = await import('@/lib/auth-utils');
            const payload = await verifyToken(adminToken.value);

            if (!payload) {
                // Invalid token
                const loginUrl = new URL('/admin/login', request.url);
                const response = NextResponse.redirect(loginUrl);
                response.cookies.delete('admin_token');
                return response;
            }
        } catch {
            // Verification failed
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }


    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
