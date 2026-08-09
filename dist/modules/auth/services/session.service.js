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
    database;
    constructor(database) {
        this.database = database;
    }
    async createSession({ userId, provider, refreshToken, metadata = {}, expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), }) {
        return this.database.authSession.create({
            data: {
                userId,
                provider,
                deviceId: metadata.deviceId,
                deviceName: metadata.deviceName,
                deviceType: metadata.deviceType,
                ipAddress: metadata.ipAddress,
                userAgent: metadata.userAgent,
                refreshTokenHash: this.hashToken(refreshToken),
                expiresAt,
                lastUsedAt: new Date(),
            },
        });
    }
    async validateRefreshToken(refreshToken) {
        const session = await this.database.authSession.findFirst({
            where: {
                refreshTokenHash: this.hashToken(refreshToken),
                revokedAt: null,
                expiresAt: { gt: new Date() },
            },
            include: { user: true },
        });
        if (session) {
            await this.updateLastUsed(session.id);
        }
        return session;
    }
    async rotateRefreshToken(sessionId, refreshToken) {
        return this.database.authSession.update({
            where: { id: sessionId },
            data: {
                refreshTokenHash: this.hashToken(refreshToken),
                lastUsedAt: new Date(),
            },
        });
    }
    logout(sessionId) {
        return this.revokeSession(sessionId);
    }
    logoutAll(userId) {
        return this.revokeAllUserSessions(userId);
    }
    async findSession(sessionId) {
        return this.database.authSession.findUnique({ where: { id: sessionId } });
    }
    revokeSession(sessionId) {
        return this.database.authSession.update({
            where: { id: sessionId },
            data: { revokedAt: new Date() },
        });
    }
    revokeAllUserSessions(userId) {
        return this.database.authSession.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
    updateLastUsed(sessionId) {
        return this.database.authSession.update({
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