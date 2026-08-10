import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AuthTokenType } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import { createHash, randomBytes } from "crypto";

import { DatabaseService } from "../../../database/database.service";
import { AuthTokens, JwtPayload } from "../types/auth.types";

@Injectable()
export class TokenService {
  private readonly googleClient = new OAuth2Client();

  constructor(
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(payload: JwtPayload): Promise<AuthTokens> {
    return {
      accessToken: await this.generateAccessToken(payload),
      refreshToken: this.generateToken(),
    };
  }

  async generateAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
      expiresIn: "15m",
    });
  }

  generateToken(): string {
    return randomBytes(32).toString("hex");
  }

  async createAuthToken(
    userId: string,
    type: AuthTokenType,
    expiresInMinutes: number,
  ): Promise<{ token: string; expiresAt: Date }> {
    const token = this.generateToken();
    const expiresAt = this.getExpiration(expiresInMinutes);

    await this.database.authToken.create({
      data: {
        userId,
        type,
        tokenHash: this.hashToken(token),
        expiresAt,
      },
    });

    return { token, expiresAt };
  }

  async verifyAuthToken(token: string, type: AuthTokenType) {
    const authToken = await this.database.authToken.findFirst({
      where: {
        tokenHash: this.hashToken(token),
        type,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!authToken) {
      return null;
    }

    await this.database.authToken.update({
      where: { id: authToken.id },
      data: { usedAt: new Date() },
    });

    return { userId: authToken.userId };
  }

  verifyEmailToken(token: string) {
    return this.verifyAuthToken(token, AuthTokenType.EMAIL_VERIFICATION);
  }

  verifyPasswordResetToken(token: string) {
    return this.verifyAuthToken(token, AuthTokenType.PASSWORD_RESET);
  }

  async verifyGoogleToken(idToken: string) {
    const audience = this.configService.get<string>("GOOGLE_CLIENT_ID");
    if (!audience) {
      return null;
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience,
      });
      const payload = ticket.getPayload();

      if (!payload?.email || !payload.email_verified) {
        return null;
      }

      return { email: payload.email };
    } catch {
      return null;
    }
  }

  hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  getExpiration(minutes: number): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }
}
