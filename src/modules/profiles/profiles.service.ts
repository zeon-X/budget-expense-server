import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { DatabaseService } from "../../database/database.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class ProfilesService {
  constructor(private readonly database: DatabaseService) {}

  async create(userId: string, dto: CreateProfileDto) {
    const existingProfile = await this.database.profile.findFirst({
      where: {
        userId,
      },
    });

    return this.database.profile.create({
      data: {
        userId,
        name: dto.name,
        isDefault: !existingProfile,
      },
    });
  }

  async findAll(userId: string) {
    return this.database.profile.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          isDefault: "desc",
        },
        {
          createdAt: "asc",
        },
      ],
    });
  }

  async findOne(userId: string, profileId: string) {
    const profile = await this.database.profile.findFirst({
      where: {
        id: profileId,
      },
    });

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    if (profile.userId !== userId) {
      throw new ForbiddenException("You do not have access to this profile");
    }

    return profile;
  }

  async update(userId: string, profileId: string, dto: UpdateProfileDto) {
    await this.findOne(userId, profileId);

    return this.database.profile.update({
      where: {
        id: profileId,
      },
      data: {
        ...(dto.name !== undefined && {
          name: dto.name,
        }),
      },
    });
  }

  async remove(userId: string, profileId: string) {
    const profile = await this.findOne(userId, profileId);

    const profileCount = await this.database.profile.count({
      where: {
        userId,
      },
    });

    if (profileCount === 1) {
      throw new ForbiddenException("You cannot delete your only profile");
    }

    if (profile.isDefault) {
      throw new ForbiddenException(
        "Set another profile as default before deleting this profile",
      );
    }

    await this.database.profile.delete({
      where: {
        id: profileId,
      },
    });

    return {
      message: "Profile deleted successfully",
    };
  }

  async setDefault(userId: string, profileId: string) {
    await this.findOne(userId, profileId);

    await this.database.$transaction([
      this.database.profile.updateMany({
        where: {
          userId,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      }),

      this.database.profile.update({
        where: {
          id: profileId,
        },
        data: {
          isDefault: true,
        },
      }),
    ]);

    return this.database.profile.findUnique({
      where: {
        id: profileId,
      },
    });
  }
}
