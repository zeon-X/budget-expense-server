import { Injectable, UnauthorizedException } from "@nestjs/common";

import * as bcrypt from "bcrypt";

import { DatabaseService } from "../../database/database.service";

import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async getMe(userId: string) {
    const user = await this.database.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return this.sanitizeUser(user);
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
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

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.database.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException(
        "Password authentication is not enabled for this account",
      );
    }

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Current password is incorrect");
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

    /*
     * We should invalidate all other sessions here.
     *
     * We'll connect this with SessionService once
     * we finalize the session lifecycle.
     */

    return {
      message: "Password changed successfully",
    };
  }

  async deleteMe(userId: string) {
    const user = await this.database.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    /*
     * IMPORTANT:
     *
     * We are intentionally not deciding between
     * hard-delete and soft-delete yet.
     *
     * This will depend on the final Profile ->
     * Transaction data relationship.
     */

    await this.database.user.delete({
      where: {
        id: userId,
      },
    });

    return {
      message: "Account deleted successfully",
    };
  }

  private sanitizeUser(user: any) {
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
}
