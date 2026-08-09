import { AuthService } from "./auth.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { GoogleLoginDto } from "./dto/google-login.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { RequestVerificationDto } from "./dto/request-verification.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            emailVerified: any;
        };
        accessToken: any;
        refreshToken: any;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            emailVerified: any;
        };
        accessToken: any;
        refreshToken: any;
    }>;
    googleLogin(dto: GoogleLoginDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            emailVerified: any;
        };
        accessToken: any;
        refreshToken: any;
    }>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: any;
        refreshToken: any;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    logoutAll(req: any): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    requestVerification(req: any, dto: RequestVerificationDto): Promise<{
        message: string;
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            emailVerified: any;
        };
    }>;
    getMe(req: any): Promise<{
        id: string;
        email: string;
        emailVerified: any;
    }>;
}
