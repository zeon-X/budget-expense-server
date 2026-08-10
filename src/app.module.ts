import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { resolve } from "node:path";

import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { AccountsModule } from "./modules/accounts/accounts.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { ProfilesModule } from "./modules/profiles/profiles.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Resolve relative to `src` in development and `dist` in production,
      // rather than relying on the directory from which Node is invoked.
      envFilePath: resolve(__dirname, "..", ".env"),
      validate: (environment) => {
        const databaseUrl = environment.DATABASE_URL?.trim();

        if (!databaseUrl) {
          throw new Error(
            "DATABASE_URL is required. Set it in the deployment environment or copy .env.example to .env and provide a MongoDB connection string.",
          );
        }

        if (!/^mongodb(\+srv)?:\/\//.test(databaseUrl)) {
          throw new Error(
            "DATABASE_URL must be a valid MongoDB connection string starting with mongodb:// or mongodb+srv://.",
          );
        }

        if (!environment.JWT_ACCESS_SECRET?.trim()) {
          throw new Error(
            "JWT_ACCESS_SECRET is required. Set it to a cryptographically random value.",
          );
        }

        return environment;
      },
    }),

    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    AccountsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
