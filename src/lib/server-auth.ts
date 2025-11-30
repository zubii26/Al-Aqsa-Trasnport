import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function validateRequest() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('admin_user_id');

    if (!userId?.value) {
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId.value }
        });
        return user;
    } catch (error) {
        console.error('Auth error:', error);
        return null;
    }
}

export async function requireRole(allowedRoles: ('ADMIN' | 'MANAGER')[]) {
    const user = await validateRequest();
    if (!user || !allowedRoles.includes(user.role as any)) {
        return null;
    }
    return user;
}
