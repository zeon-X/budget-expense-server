import { Injectable } from "@nestjs/common";
import { AuthProvider, AuthSession } from "@prisma/client";
import { createHash, randomBytes } from "crypto";
import { DatabaseService } from "../../../database/database.service";
import { SessionMetadata } from "../types/auth.types";
@Injectable()
export class SessionService {
  constructor(private readonly databaseService: DatabaseService) {}
  async createSession(
    userId: string,
    provider: AuthProvider,
    metadata: SessionMetadata,
    expiresAt: Date,
  ): Promise<{ session: AuthSession; refreshToken: string }> {
    const refreshToken = randomBytes(48).toString("hex");
    const refreshTokenHash = this.hashToken(refreshToken);
    const session = await this.databaseService.authSession.create({
      data: {
        userId,
        provider,
        deviceId: metadata.deviceId,
        deviceName: metadata.deviceName,
        deviceType: metadata.deviceType,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
        refreshTokenHash,
        expiresAt,
        lastUsedAt: new Date(),
      },
    });
    return { session, refreshToken };
  }
  async findSession(sessionId: string) {
    return this.databaseService.authSession.findUnique({
      where: { id: sessionId },
    });
  }
  async revokeSession(sessionId: string) {
    return this.databaseService.authSession.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }
  async revokeAllUserSessions(userId: string) {
    return this.databaseService.authSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  async updateLastUsed(sessionId: string) {
    return this.databaseService.authSession.update({
      where: { id: sessionId },
      data: { lastUsedAt: new Date() },
    });
  }
  hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
