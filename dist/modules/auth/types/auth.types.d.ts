export interface JwtPayload {
    sub: string;
    sessionId: string;
    email: string;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface SessionMetadata {
    deviceId?: string;
    deviceName?: string;
    deviceType?: string;
    ipAddress?: string;
    userAgent?: string;
}
export interface VerificationEmailData {
    email: string;
    token: string;
    expiresAt: Date;
}
export interface PasswordResetEmailData {
    email: string;
    token: string;
    expiresAt: Date;
}
