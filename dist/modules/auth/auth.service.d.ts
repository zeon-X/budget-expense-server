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
export declare class AuthService {
    private readonly database;
    private readonly emailService;
    private readonly sessionService;
    private readonly tokenService;
    constructor(database: DatabaseService, emailService: EmailService, sessionService: SessionService, tokenService: TokenService);
    private createSessionTokens;
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            emailVerified: boolean;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            emailVerified: boolean;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    googleLogin(dto: GoogleLoginDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            emailVerified: boolean;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refreshToken(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(user: any): Promise<{
        message: string;
    }>;
    logoutAll(user: any): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    requestVerification(user: any, dto: RequestVerificationDto): Promise<{
        message: string;
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            emailVerified: boolean;
        };
    }>;
    getMe(user: any): Promise<{
        id: string;
        email: string;
        emailVerified: boolean;
    }>;
}
