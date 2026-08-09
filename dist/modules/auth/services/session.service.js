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
exports.SessionService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const database_service_1 = require("../../../database/database.service");
let SessionService = class SessionService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async createSession(userId, provider, metadata, expiresAt) {
        const refreshToken = (0, crypto_1.randomBytes)(48).toString("hex");
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
    async findSession(sessionId) {
        return this.databaseService.authSession.findUnique({
            where: { id: sessionId },
        });
    }
    async revokeSession(sessionId) {
        return this.databaseService.authSession.update({
            where: { id: sessionId },
            data: { revokedAt: new Date() },
        });
    }
    async revokeAllUserSessions(userId) {
        return this.databaseService.authSession.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
    async updateLastUsed(sessionId) {
        return this.databaseService.authSession.update({
            where: { id: sessionId },
            data: { lastUsedAt: new Date() },
        });
    }
    hashToken(token) {
        return (0, crypto_1.createHash)("sha256").update(token).digest("hex");
    }
};
exports.SessionService = SessionService;
exports.SessionService = SessionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], SessionService);
//# sourceMappingURL=session.service.js.map