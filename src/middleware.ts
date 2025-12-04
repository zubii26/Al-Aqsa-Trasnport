import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the request is for the admin panel or admin API
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
        // Exclude the login page itself to avoid redirect loops
        if (pathname === '/admin/login' || pathname === '/api/auth/login') {
            return NextResponse.next();
        }

        // Check for the admin_token cookie
        const adminToken = request.cookies.get('admin_token');

        // If no token exists, redirect to the login page
        if (!adminToken) {
            // For API routes, return 401
            if (pathname.startsWith('/api/')) {
                return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
            }
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }

        // Verify the token
        try {
            const { verifyToken } = await import('@/lib/auth-utils');
            const payload = await verifyToken(adminToken.value);

            if (!payload || !payload.role) {
                throw new Error('Invalid token');
            }

            // Role-based access control
            const allowedRoles = ['admin', 'manager', 'operational_manager'];
            if (!allowedRoles.includes(payload.role as string)) {
                // For API routes, return 403
                if (pathname.startsWith('/api/')) {
                    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
                }
                // For pages, redirect to login with error (or a 403 page if we had one)
                const loginUrl = new URL('/admin/login', request.url);
                loginUrl.searchParams.set('error', 'Unauthorized access');
                return NextResponse.redirect(loginUrl);
            }

        } catch {
            // Verification failed
            if (pathname.startsWith('/api/')) {
                return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
            }
            const loginUrl = new URL('/admin/login', request.url);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('admin_token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
