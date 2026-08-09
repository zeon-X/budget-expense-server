import { Injectable, Logger } from "@nestjs/common";

import {
  PasswordResetEmailData,
  VerificationEmailData,
} from "../types/auth.types";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendVerificationEmail(data: VerificationEmailData): Promise<void> {
    this.logger.log(`Verification email requested for ${data.email}`);

    // Email provider will be implemented later.
    //
    // Example:
    // https://your-app.com/auth/verify-email?token=${data.token}
  }

  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
    this.logger.log(`Password reset email requested for ${data.email}`);

    // Email provider will be implemented later.
    //
    // Example:
    // https://your-app.com/auth/reset-password?token=${data.token}
  }
}
