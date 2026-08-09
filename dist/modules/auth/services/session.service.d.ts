import { AuthProvider, AuthSession } from "@prisma/client";
import { DatabaseService } from "../../../database/database.service";
import { SessionMetadata } from "../types/auth.types";
interface CreateSessionInput {
    userId: string;
    provider: AuthProvider;
    refreshToken: string;
    metadata?: SessionMetadata;
    expiresAt?: Date;
}
export declare class SessionService {
    private readonly database;
    constructor(database: DatabaseService);
    createSession({ userId, provider, refreshToken, metadata, expiresAt, }: CreateSessionInput): Promise<AuthSession>;
    validateRefreshToken(refreshToken: string): Promise<({
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string | null;
            emailVerifiedAt: Date | null;
        };
    } & {
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
    }) | null>;
    rotateRefreshToken(sessionId: string, refreshToken: string): Promise<{
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
    logout(sessionId: string): import("@prisma/client").Prisma.Prisma__AuthSessionClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    logoutAll(userId: string): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.BatchPayload>;
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
    revokeSession(sessionId: string): import("@prisma/client").Prisma.Prisma__AuthSessionClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    revokeAllUserSessions(userId: string): import("@prisma/client").Prisma.PrismaPromise<import("@prisma/client").Prisma.BatchPayload>;
    updateLastUsed(sessionId: string): import("@prisma/client").Prisma.Prisma__AuthSessionClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    private hashToken;
}
export {};
