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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const database_service_1 = require("../../database/database.service");
let UsersService = class UsersService {
    database;
    constructor(database) {
        this.database = database;
    }
    async getMe(userId) {
        const user = await this.database.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        return this.sanitizeUser(user);
    }
    async updateMe(userId, dto) {
        const user = await this.database.user.update({
            where: {
                id: userId,
            },
            data: {
                ...(dto.name !== undefined && {
                    name: dto.name,
                }),
                ...(dto.avatar !== undefined && {
                    avatar: dto.avatar,
                }),
            },
        });
        return this.sanitizeUser(user);
    }
    async changePassword(userId, dto) {
        const user = await this.database.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        if (!user.passwordHash) {
            throw new common_1.UnauthorizedException("Password authentication is not enabled for this account");
        }
        const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Current password is incorrect");
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, 12);
        await this.database.user.update({
            where: {
                id: userId,
            },
            data: {
                passwordHash,
            },
        });
        return {
            message: "Password changed successfully",
        };
    }
    async deleteMe(userId) {
        const user = await this.database.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        await this.database.user.delete({
            where: {
                id: userId,
            },
        });
        return {
            message: "Account deleted successfully",
        };
    }
    sanitizeUser(user) {
        return {
            id: user.id,
            email: user.email,
            emailVerified: user.emailVerified,
            name: user.name ?? null,
            avatar: user.avatar ?? null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map