import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthTokenType } from "@prisma/client";
import { DatabaseService } from "../../../database/database.service";
import { AuthTokens, JwtPayload } from "../types/auth.types";
export declare class TokenService {
    private readonly database;
    private readonly jwtService;
    private readonly configService;
    private readonly googleClient;
    constructor(database: DatabaseService, jwtService: JwtService, configService: ConfigService);
    generateTokens(payload: JwtPayload): Promise<AuthTokens>;
    generateAccessToken(payload: JwtPayload): Promise<string>;
    generateToken(): string;
    createAuthToken(userId: string, type: AuthTokenType, expiresInMinutes: number): Promise<{
        token: string;
        expiresAt: Date;
    }>;
    verifyAuthToken(token: string, type: AuthTokenType): Promise<{
        userId: string;
    } | null>;
    verifyEmailToken(token: string): Promise<{
        userId: string;
    } | null>;
    verifyPasswordResetToken(token: string): Promise<{
        userId: string;
    } | null>;
    verifyGoogleToken(idToken: string): Promise<{
        email: string;
    } | null>;
    hashToken(token: string): string;
    getExpiration(minutes: number): Date;
}
