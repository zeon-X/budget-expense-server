import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthProvider, AuthTokenType } from "@prisma/client";

import * as bcrypt from "bcrypt";

import { DatabaseService } from "../../database/database.service";

import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { GoogleLoginDto } from "./dto/google-login.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { RequestVerificationDto } from "./dto/request-verification.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";

import { EmailService } from "./services/email.service";
import { SessionService } from "./services/session.service";
import { TokenService } from "./services/token.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly emailService: EmailService,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
  ) {}

  private async createSessionTokens(
    userId: string,
    email: string,
    provider: AuthProvider,
  ) {
    const refreshToken = this.tokenService.generateToken();
    const session = await this.sessionService.createSession({
      userId,
      refreshToken,
      provider,
    });
    const accessToken = await this.tokenService.generateAccessToken({
      sub: userId,
      email,
      sessionId: session.id,
    });

    return { accessToken, refreshToken };
  }

  // --------------------------------------------------
  // REGISTER
  // --------------------------------------------------

  async register(dto: RegisterDto) {
    const existingUser = await this.database.user.findUnique({
      where: {
        email: dto.email.toLowerCase(),
      },
    });

    if (existingUser) {
      throw new ConflictException("An account with this email already exists");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.database.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
      },
    });

    /*
     * We immediately create a session.
     *
     * The user does NOT need to login again
     * after registration.
     */
    const tokens = await this.createSessionTokens(
      user.id,
      user.email,
      AuthProvider.EMAIL,
    );

    /*
     * Verification is optional.
     *
     * We send the verification link, but the user
     * can continue using the application without
     * verifying their email.
     */
    const verification = await this.tokenService.createAuthToken(
      user.id,
      AuthTokenType.EMAIL_VERIFICATION,
      24 * 60,
    );
    await this.emailService.sendVerificationEmail({
      email: user.email,
      ...verification,
    });

    return {
      message: "Registration successful",

      user: {
        id: user.id,
        email: user.email,
        emailVerified: Boolean(user.emailVerifiedAt),
      },

      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  async login(dto: LoginDto) {
    const user = await this.database.user.findUnique({
      where: {
        email: dto.email.toLowerCase(),
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const tokens = await this.createSessionTokens(
      user.id,
      user.email,
      AuthProvider.EMAIL,
    );

    return {
      message: "Login successful",

      user: {
        id: user.id,
        email: user.email,
        emailVerified: Boolean(user.emailVerifiedAt),
      },

      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // --------------------------------------------------
  // GOOGLE LOGIN
  // --------------------------------------------------

  async googleLogin(dto: GoogleLoginDto) {
    /*
     * Google token verification will be implemented
     * inside the Google authentication flow.
     *
     * For now this is intentionally separated from
     * email/password authentication.
     */

    const googleUser = await this.tokenService.verifyGoogleToken(dto.idToken);

    if (!googleUser) {
      throw new UnauthorizedException("Invalid Google token");
    }

    let user = await this.database.user.findUnique({
      where: {
        email: googleUser.email.toLowerCase(),
      },
    });

    if (!user) {
      user = await this.database.user.create({
        data: {
          email: googleUser.email.toLowerCase(),
          emailVerifiedAt: new Date(),
        },
      });
    }

    const tokens = await this.createSessionTokens(
      user.id,
      user.email,
      AuthProvider.GOOGLE,
    );

    return {
      message: "Google login successful",

      user: {
        id: user.id,
        email: user.email,
        emailVerified: Boolean(user.emailVerifiedAt),
      },

      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // --------------------------------------------------
  // REFRESH TOKEN
  // --------------------------------------------------

  async refreshToken(dto: RefreshTokenDto) {
    const session = await this.sessionService.validateRefreshToken(
      dto.refreshToken,
    );

    if (!session) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const refreshToken = this.tokenService.generateToken();
    const accessToken = await this.tokenService.generateAccessToken({
      sub: session.userId,
      email: session.user.email,
      sessionId: session.id,
    });

    await this.sessionService.rotateRefreshToken(
      session.id,
      refreshToken,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  async logout(user: any) {
    await this.sessionService.logout(user.sessionId);

    return {
      message: "Logged out successfully",
    };
  }

  // --------------------------------------------------
  // LOGOUT ALL DEVICES
  // --------------------------------------------------

  async logoutAll(user: any) {
    await this.sessionService.logoutAll(user.userId);

    return {
      message: "Logged out from all devices",
    };
  }

  // --------------------------------------------------
  // FORGOT PASSWORD
  // --------------------------------------------------

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.database.user.findUnique({
      where: {
        email: dto.email.toLowerCase(),
      },
    });

    /*
     * Don't reveal whether an email exists.
     */
    if (!user) {
      return {
        message:
          "If an account exists with this email, a password reset link has been sent.",
      };
    }

    const reset = await this.tokenService.createAuthToken(
      user.id,
      AuthTokenType.PASSWORD_RESET,
      60,
    );
    await this.emailService.sendPasswordResetEmail({ email: user.email, ...reset });

    return {
      message:
        "If an account exists with this email, a password reset link has been sent.",
    };
  }

  // --------------------------------------------------
  // RESET PASSWORD
  // --------------------------------------------------

  async resetPassword(dto: ResetPasswordDto) {
    const resetData = await this.tokenService.verifyPasswordResetToken(
      dto.token,
    );

    if (!resetData) {
      throw new BadRequestException("Invalid or expired password reset link");
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);

    await this.database.user.update({
      where: {
        id: resetData.userId,
      },

      data: {
        passwordHash,
      },
    });

    /*
     * Password changed -> invalidate all existing
     * sessions for security.
     */
    await this.sessionService.logoutAll(resetData.userId);

    return {
      message: "Password reset successfully",
    };
  }

  // --------------------------------------------------
  // REQUEST EMAIL VERIFICATION
  // --------------------------------------------------

  async requestVerification(user: any, dto: RequestVerificationDto) {
    const currentUser = await this.database.user.findUnique({
      where: {
        id: user.userId,
      },
    });

    if (!currentUser) {
      throw new UnauthorizedException("User not found");
    }

    if (currentUser.emailVerifiedAt) {
      return {
        message: "Email is already verified",
      };
    }

    /*
     * The email in the request should belong to the
     * authenticated user.
     */
    if (currentUser.email.toLowerCase() !== dto.email.toLowerCase()) {
      throw new BadRequestException(
        "Email does not match the authenticated account",
      );
    }

    const verification = await this.tokenService.createAuthToken(
      currentUser.id,
      AuthTokenType.EMAIL_VERIFICATION,
      24 * 60,
    );
    await this.emailService.sendVerificationEmail({
      email: currentUser.email,
      ...verification,
    });

    return {
      message: "Verification link sent",
    };
  }

  // --------------------------------------------------
  // VERIFY EMAIL
  // --------------------------------------------------

  async verifyEmail(dto: VerifyEmailDto) {
    const verificationData = await this.tokenService.verifyEmailToken(
      dto.token,
    );

    if (!verificationData) {
      throw new BadRequestException("Invalid or expired verification link");
    }

    const user = await this.database.user.update({
      where: {
        id: verificationData.userId,
      },

      data: {
        emailVerifiedAt: new Date(),
      },
    });

    return {
      message: "Email verified successfully",

      user: {
        id: user.id,
        email: user.email,
        emailVerified: Boolean(user.emailVerifiedAt),
      },
    };
  }

  // --------------------------------------------------
  // CURRENT USER
  // --------------------------------------------------

  async getMe(user: any) {
    const currentUser = await this.database.user.findUnique({
      where: {
        id: user.userId,
      },
    });

    if (!currentUser) {
      throw new UnauthorizedException("User not found");
    }

    return {
      id: currentUser.id,
      email: currentUser.email,
      emailVerified: Boolean(currentUser.emailVerifiedAt),
    };
  }
}
