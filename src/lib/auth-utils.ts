import { SignJWT, jwtVerify } from 'jose';

// ✅ Fail fast at runtime if the JWT secret is missing.
// Never fall back to a hardcoded string — that would allow token forgery.
function getSecretKey() {
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    if (!SECRET_KEY) {
        throw new Error(
            '[auth-utils] JWT_SECRET_KEY is not set. ' +
            'Add it to your .env.local (development) or hosting environment variables (production). ' +
            'It must be a random string of at least 32 characters.'
        );
    }
    return new TextEncoder().encode(SECRET_KEY);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signToken(payload: any, expiresIn: string = '24h') {
    const key = getSecretKey();
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn) // Default: 24-hour admin sessions
        .sign(key);
}

export async function verifyToken(token: string) {
    try {
        const key = getSecretKey();
        const { payload } = await jwtVerify(token, key);
        return payload;
    } catch {
        return null;
    }
}
