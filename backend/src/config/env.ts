export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
export const JWT_SECRET = process.env.JWT_SECRET!;
export const SALT_ROUNDS = process.env.SALT_ROUNDS || '10';
export const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '24h';
export const BACKEND_PORT = process.env.PORT || process.env.BACKEND_PORT || '4000';