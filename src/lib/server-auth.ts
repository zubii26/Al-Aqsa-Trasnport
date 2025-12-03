import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import { User, IUser } from '@/models';

export async function validateRequest(): Promise<IUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token');

    if (!token?.value) {
        return null;
    }

    try {
        const { verifyToken } = await import('@/lib/auth-utils');
        const payload = await verifyToken(token.value);

        if (!payload || !payload.userId) return null;

        // We can either trust the token payload or fetch fresh user data
        // Fetching fresh data is safer for role changes/bans
        await dbConnect();
        const user = await User.findById(payload.userId).lean();
        if (!user) return null;

        // Cast to IUser and ensure string ID
        return { ...user, id: user._id.toString() } as unknown as IUser;
    } catch (error) {
        console.error('Auth error:', error);
        return null;
    }
}

export async function requireRole(allowedRoles: string[]) {
    const user = await validateRequest();
    if (!user) return null;

    // Normalize roles for comparison (handle case sensitivity if needed)
    // The DB uses 'admin' and 'user'. The app might pass 'ADMIN'.
    const normalizedUserRole = user.role.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

    // Map 'manager' to 'admin' or 'user' if needed, or just check inclusion
    // If user is admin, they should generally have access to everything
    if (normalizedUserRole === 'admin') return user;

    // Check if allowed roles include 'manager' and user role includes 'manager'
    if (normalizedAllowedRoles.includes('manager') && normalizedUserRole.includes('manager')) {
        return user;
    }

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
        return null;
    }
    return user;
}
