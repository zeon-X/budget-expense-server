"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const google_auth_library_1 = require("google-auth-library");
const crypto_1 = require("crypto");
const database_service_1 = require("../../../database/database.service");
let TokenService = class TokenService {
    database;
    jwtService;
    configService;
    googleClient = new google_auth_library_1.OAuth2Client();
    constructor(database, jwtService, configService) {
        this.database = database;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async generateTokens(payload) {
        return {
            accessToken: await this.generateAccessToken(payload),
            refreshToken: this.generateToken(),
        };
    }
    async generateAccessToken(payload) {
        return this.jwtService.signAsync(payload, {
            secret: this.configService.getOrThrow("JWT_ACCESS_SECRET"),
            expiresIn: "15m",
        });
    }
    generateToken() {
        return (0, crypto_1.randomBytes)(32).toString("hex");
    }
    async createAuthToken(userId, type, expiresInMinutes) {
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
    async verifyAuthToken(token, type) {
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
    verifyEmailToken(token) {
        return this.verifyAuthToken(token, client_1.AuthTokenType.EMAIL_VERIFICATION);
    }
    verifyPasswordResetToken(token) {
        return this.verifyAuthToken(token, client_1.AuthTokenType.PASSWORD_RESET);
    }
    async verifyGoogleToken(idToken) {
        const audience = this.configService.get("GOOGLE_CLIENT_ID");
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
        }
        catch {
            return null;
        }
    }
    hashToken(token) {
        return (0, crypto_1.createHash)("sha256").update(token).digest("hex");
    }
    getExpiration(minutes) {
        return new Date(Date.now() + minutes * 60 * 1000);
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService,
        jwt_1.JwtService,
        config_1.ConfigService])
], TokenService);
//# sourceMappingURL=token.service.js.map