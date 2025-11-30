interface OtpStore {
    [username: string]: {
        code: string;
        expires: number;
    };
}

// In-memory store for OTPs (Note: This resets on server restart)
// For production, use Redis or a database
export const otpStore: OtpStore = {};

export const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
