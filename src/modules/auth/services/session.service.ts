import { Injectable } from "@nestjs/common";
import { AuthProvider, AuthSession } from "@prisma/client";
import { createHash } from "crypto";

import { DatabaseService } from "../../../database/database.service";
import { SessionMetadata } from "../types/auth.types";

interface CreateSessionInput {
  userId: string;
  provider: AuthProvider;
  refreshToken: string;
  metadata?: SessionMetadata;
  expiresAt?: Date;
}

@Injectable()
export class SessionService {
  constructor(private readonly database: DatabaseService) {}

  async createSession({
    userId,
    provider,
    refreshToken,
    metadata = {},
    expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }: CreateSessionInput): Promise<AuthSession> {
    return this.database.authSession.create({
      data: {
        userId,
        provider,
        deviceId: metadata.deviceId,
        deviceName: metadata.deviceName,
        deviceType: metadata.deviceType,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
        refreshTokenHash: this.hashToken(refreshToken),
        expiresAt,
        lastUsedAt: new Date(),
      },
    });
  }

  async validateRefreshToken(refreshToken: string) {
    const session = await this.database.authSession.findFirst({
      where: {
        refreshTokenHash: this.hashToken(refreshToken),
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (session) {
      await this.updateLastUsed(session.id);
    }

    return session;
  }

  async rotateRefreshToken(sessionId: string, refreshToken: string) {
    return this.database.authSession.update({
      where: { id: sessionId },
      data: {
        refreshTokenHash: this.hashToken(refreshToken),
        lastUsedAt: new Date(),
      },
    });
  }

  logout(sessionId: string) {
    return this.revokeSession(sessionId);
  }

  logoutAll(userId: string) {
    return this.revokeAllUserSessions(userId);
  }

  async findSession(sessionId: string) {
    return this.database.authSession.findUnique({ where: { id: sessionId } });
  }

  revokeSession(sessionId: string) {
    return this.database.authSession.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  revokeAllUserSessions(userId: string) {
    return this.database.authSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  updateLastUsed(sessionId: string) {
    return this.database.authSession.update({
      where: { id: sessionId },
      data: { lastUsedAt: new Date() },
    });
  }

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
