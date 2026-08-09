"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const database_service_1 = require("../../database/database.service");
const email_service_1 = require("./services/email.service");
const session_service_1 = require("./services/session.service");
const token_service_1 = require("./services/token.service");
let AuthService = class AuthService {
    database;
    emailService;
    sessionService;
    tokenService;
    constructor(database, emailService, sessionService, tokenService) {
        this.database = database;
        this.emailService = emailService;
        this.sessionService = sessionService;
        this.tokenService = tokenService;
    }
    async createSessionTokens(userId, email, provider) {
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
    async register(dto) {
        const existingUser = await this.database.user.findUnique({
            where: {
                email: dto.email.toLowerCase(),
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException("An account with this email already exists");
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.database.user.create({
            data: {
                email: dto.email.toLowerCase(),
                passwordHash,
            },
        });
        const tokens = await this.createSessionTokens(user.id, user.email, client_1.AuthProvider.EMAIL);
        const verification = await this.tokenService.createAuthToken(user.id, client_1.AuthTokenType.EMAIL_VERIFICATION, 24 * 60);
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
    async login(dto) {
        const user = await this.database.user.findUnique({
            where: {
                email: dto.email.toLowerCase(),
            },
        });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException("Invalid email or password");
        }
        const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException("Invalid email or password");
        }
        const tokens = await this.createSessionTokens(user.id, user.email, client_1.AuthProvider.EMAIL);
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
    async googleLogin(dto) {
        const googleUser = await this.tokenService.verifyGoogleToken(dto.idToken);
        if (!googleUser) {
            throw new common_1.UnauthorizedException("Invalid Google token");
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
        const tokens = await this.createSessionTokens(user.id, user.email, client_1.AuthProvider.GOOGLE);
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
    async refreshToken(dto) {
        const session = await this.sessionService.validateRefreshToken(dto.refreshToken);
        if (!session) {
            throw new common_1.UnauthorizedException("Invalid or expired refresh token");
        }
        const refreshToken = this.tokenService.generateToken();
        const accessToken = await this.tokenService.generateAccessToken({
            sub: session.userId,
            email: session.user.email,
            sessionId: session.id,
        });
        await this.sessionService.rotateRefreshToken(session.id, refreshToken);
        return {
            accessToken,
            refreshToken,
        };
    }
    async logout(user) {
        await this.sessionService.logout(user.sessionId);
        return {
            message: "Logged out successfully",
        };
    }
    async logoutAll(user) {
        await this.sessionService.logoutAll(user.userId);
        return {
            message: "Logged out from all devices",
        };
    }
    async forgotPassword(dto) {
        const user = await this.database.user.findUnique({
            where: {
                email: dto.email.toLowerCase(),
            },
        });
        if (!user) {
            return {
                message: "If an account exists with this email, a password reset link has been sent.",
            };
        }
        const reset = await this.tokenService.createAuthToken(user.id, client_1.AuthTokenType.PASSWORD_RESET, 60);
        await this.emailService.sendPasswordResetEmail({ email: user.email, ...reset });
        return {
            message: "If an account exists with this email, a password reset link has been sent.",
        };
    }
    async resetPassword(dto) {
        const resetData = await this.tokenService.verifyPasswordResetToken(dto.token);
        if (!resetData) {
            throw new common_1.BadRequestException("Invalid or expired password reset link");
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
        await this.sessionService.logoutAll(resetData.userId);
        return {
            message: "Password reset successfully",
        };
    }
    async requestVerification(user, dto) {
        const currentUser = await this.database.user.findUnique({
            where: {
                id: user.userId,
            },
        });
        if (!currentUser) {
            throw new common_1.UnauthorizedException("User not found");
        }
        if (currentUser.emailVerifiedAt) {
            return {
                message: "Email is already verified",
            };
        }
        if (currentUser.email.toLowerCase() !== dto.email.toLowerCase()) {
            throw new common_1.BadRequestException("Email does not match the authenticated account");
        }
        const verification = await this.tokenService.createAuthToken(currentUser.id, client_1.AuthTokenType.EMAIL_VERIFICATION, 24 * 60);
        await this.emailService.sendVerificationEmail({
            email: currentUser.email,
            ...verification,
        });
        return {
            message: "Verification link sent",
        };
    }
    async verifyEmail(dto) {
        const verificationData = await this.tokenService.verifyEmailToken(dto.token);
        if (!verificationData) {
            throw new common_1.BadRequestException("Invalid or expired verification link");
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
    async getMe(user) {
        const currentUser = await this.database.user.findUnique({
            where: {
                id: user.userId,
            },
        });
        if (!currentUser) {
            throw new common_1.UnauthorizedException("User not found");
        }
        return {
            id: currentUser.id,
            email: currentUser.email,
            emailVerified: Boolean(currentUser.emailVerifiedAt),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        email_service_1.EmailService,
        session_service_1.SessionService,
        token_service_1.TokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map