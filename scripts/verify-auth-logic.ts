import { signToken, verifyToken } from '../src/lib/auth-utils';

async function testAuth() {
    console.log('Testing Auth Logic...');

    const payload = { userId: '123', email: 'test@example.com', role: 'admin' };
    console.log('Original Payload:', payload);

    try {
        // 1. Sign Token
        console.log('Signing token...');
        const token = await signToken(payload);
        console.log('Token generated:', token.substring(0, 20) + '...');

        // 2. Verify Token
        console.log('Verifying token...');
        const decoded = await verifyToken(token);
        console.log('Decoded Payload:', decoded);

        if (decoded && decoded.userId === payload.userId) {
            console.log('SUCCESS: Token verification passed!');
        } else {
            console.error('FAILURE: Token verification failed or payload mismatch.');
        }

        // 3. Verify Invalid Token
        console.log('Verifying invalid token...');
        const invalidDecoded = await verifyToken('invalid-token');
        if (invalidDecoded === null) {
            console.log('SUCCESS: Invalid token correctly rejected.');
        } else {
            console.error('FAILURE: Invalid token was accepted!');
        }

    } catch (error) {
        console.error('Test failed with error:', error);
    }
}

testAuth();
