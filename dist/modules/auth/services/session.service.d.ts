import { AuthProvider, AuthSession } from "@prisma/client";
import { DatabaseService } from "../../../database/database.service";
import { SessionMetadata } from "../types/auth.types";
export declare class SessionService {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    createSession(userId: string, provider: AuthProvider, metadata: SessionMetadata, expiresAt: Date): Promise<{
        session: AuthSession;
        refreshToken: string;
    }>;
    findSession(sessionId: string): Promise<{
        id: string;
        userId: string;
        provider: import("@prisma/client").$Enums.AuthProvider;
        deviceId: string | null;
        deviceName: string | null;
        deviceType: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        refreshTokenHash: string;
        expiresAt: Date;
        lastUsedAt: Date | null;
        revokedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    revokeSession(sessionId: string): Promise<{
        id: string;
        userId: string;
        provider: import("@prisma/client").$Enums.AuthProvider;
        deviceId: string | null;
        deviceName: string | null;
        deviceType: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        refreshTokenHash: string;
        expiresAt: Date;
        lastUsedAt: Date | null;
        revokedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    revokeAllUserSessions(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    updateLastUsed(sessionId: string): Promise<{
        id: string;
        userId: string;
        provider: import("@prisma/client").$Enums.AuthProvider;
        deviceId: string | null;
        deviceName: string | null;
        deviceType: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        refreshTokenHash: string;
        expiresAt: Date;
        lastUsedAt: Date | null;
        revokedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    hashToken(token: string): string;
}
