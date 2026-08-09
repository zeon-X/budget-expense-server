import { Injectable } from "@nestjs/common";
import { createHash, randomBytes } from "crypto";
@Injectable()
export class TokenService {
  generateToken(): string {
    return randomBytes(32).toString("hex");
  }
  hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
  getExpiration(minutes: number): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }
}
