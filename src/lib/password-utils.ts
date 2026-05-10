import bcrypt from 'bcryptjs';

// Cost factor 12 meets the current security standard minimum.
// Higher values increase brute-force resistance at the cost of CPU time.
const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};
