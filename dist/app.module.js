"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_path_1 = require("node:path");
const database_module_1 = require("./database/database.module");
const health_module_1 = require("./health/health.module");
const auth_module_1 = require("./modules/auth/auth.module");
const profiles_module_1 = require("./modules/profiles/profiles.module");
const users_module_1 = require("./modules/users/users.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: (0, node_path_1.resolve)(__dirname, "..", ".env"),
                validate: (environment) => {
                    const databaseUrl = environment.DATABASE_URL?.trim();
                    if (!databaseUrl) {
                        throw new Error("DATABASE_URL is required. Set it in the deployment environment or copy .env.example to .env and provide a MongoDB connection string.");
                    }
                    if (!/^mongodb(\+srv)?:\/\//.test(databaseUrl)) {
                        throw new Error("DATABASE_URL must be a valid MongoDB connection string starting with mongodb:// or mongodb+srv://.");
                    }
                    if (!environment.JWT_ACCESS_SECRET?.trim()) {
                        throw new Error("JWT_ACCESS_SECRET is required. Set it to a cryptographically random value.");
                    }
                    return environment;
                },
            }),
            database_module_1.DatabaseModule,
            health_module_1.HealthModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            profiles_module_1.ProfilesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map