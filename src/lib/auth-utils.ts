import { SignJWT, jwtVerify } from 'jose';

// ✅ Deferred secret key access — do NOT throw at module-evaluation time.
// Next.js static generation workers evaluate all imported modules during build,
// and a top-level throw here crashes the entire build even for routes that never
// use JWT. The secret is only required at runtime (during an actual HTTP request).
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
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .sign(getSecretKey());
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, getSecretKey());
        return payload;
    } catch {
        return null;
    }
}
