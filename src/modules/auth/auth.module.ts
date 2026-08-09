import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { DatabaseModule } from "../../database/database.module";

import { EmailService } from "./services/email.service";
import { SessionService } from "./services/session.service";
import { TokenService } from "./services/token.service";

import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [DatabaseModule, PassportModule, JwtModule.register({})],

  controllers: [AuthController],

  providers: [
    AuthService,

    EmailService,
    SessionService,
    TokenService,

    JwtStrategy,
  ],

  exports: [AuthService],
})
export class AuthModule {}
