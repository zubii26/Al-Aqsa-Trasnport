export const login = async (username: string, password: string): Promise<boolean> => {
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        return data.success;
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
};

export const logout = async (shouldRedirect: boolean = true): Promise<void> => {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        if (shouldRedirect && typeof window !== 'undefined') {
            window.location.href = '/admin/login';
        }
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

export const isAuthenticated = async (): Promise<boolean> => {
    try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        return data.authenticated;
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
};

