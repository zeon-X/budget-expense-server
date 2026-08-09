import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { DatabaseService } from "../../database/database.service";
import { UpdateProfileCategoriesDto } from "./dto/update-profile-categories.dto";

@Injectable()
export class CategoriesService {
  constructor(private readonly database: DatabaseService) {}

  /**
   * GET /api/categories
   *
   * Returns the complete category tree.
   *
   * Parents are sorted by sortOrder.
   * Children are sorted by sortOrder.
   */
  async getCategories(parentId?: string) {
    if (parentId) {
      return this.getChildCategories(parentId);
    }

    const parents = await this.database.category.findMany({
      where: {
        parentId: null,
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        children: {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    return parents;
  }

  /**
   * GET /api/categories?parentId=...
   *
   * Returns only direct children of the specified parent.
   */
  private async getChildCategories(parentId: string) {
    const parent = await this.database.category.findFirst({
      where: {
        id: parentId,
        isActive: true,
      },
    });

    if (!parent) {
      throw new NotFoundException("Parent category not found");
    }

    return this.database.category.findMany({
      where: {
        parentId,
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });
  }

  /**
   * GET /api/profiles/:profileId/categories
   *
   * Returns categories enabled for this profile.
   */
  async getProfileCategories(userId: string, profileId: string) {
    await this.verifyProfileOwnership(userId, profileId);

    const profileCategories = await this.database.profileCategory.findMany({
      where: {
        profileId,
        enabled: true,
        category: {
          isActive: true,
        },
      },
      include: {
        category: {
          include: {
            parent: true,
          },
        },
      },
    });

    return profileCategories
      .map((item) => item.category)
      .sort((a, b) => {
        return a.sortOrder - b.sortOrder;
      });
  }

  /**
   * PATCH /api/profiles/:profileId/categories
   *
   * Updates which categories are enabled/disabled
   * for the profile.
   */
  async updateProfileCategories(
    userId: string,
    profileId: string,
    dto: UpdateProfileCategoriesDto,
  ) {
    await this.verifyProfileOwnership(userId, profileId);

    const enabled = dto.enabled ?? [];
    const disabled = dto.disabled ?? [];

    const duplicateIds = enabled.filter((id) => disabled.includes(id));

    if (duplicateIds.length > 0) {
      throw new BadRequestException(
        "A category cannot be both enabled and disabled",
      );
    }

    const categoryIds = [...enabled, ...disabled];

    if (categoryIds.length === 0) {
      return {
        message: "Profile categories updated successfully",
      };
    }

    const categories = await this.database.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    const existingIds = new Set(categories.map((category) => category.id));

    const invalidIds = categoryIds.filter((id) => !existingIds.has(id));

    if (invalidIds.length > 0) {
      throw new BadRequestException(
        `Invalid category IDs: ${invalidIds.join(", ")}`,
      );
    }

    await this.database.$transaction(async (tx) => {
      if (enabled.length > 0) {
        await tx.profileCategory.updateMany({
          where: {
            profileId,
            categoryId: {
              in: enabled,
            },
          },
          data: {
            enabled: true,
          },
        });

        const existingEnabled = await tx.profileCategory.findMany({
          where: {
            profileId,
            categoryId: {
              in: enabled,
            },
          },
          select: {
            categoryId: true,
          },
        });

        const existingIds = new Set(
          existingEnabled.map((item) => item.categoryId),
        );

        const missing = enabled.filter((id) => !existingIds.has(id));

        if (missing.length > 0) {
          await tx.profileCategory.createMany({
            data: missing.map((categoryId) => ({
              profileId,
              categoryId,
              enabled: true,
            })),
          });
        }
      }

      if (disabled.length > 0) {
        await tx.profileCategory.updateMany({
          where: {
            profileId,
            categoryId: {
              in: disabled,
            },
          },
          data: {
            enabled: false,
          },
        });

        const existingDisabled = await tx.profileCategory.findMany({
          where: {
            profileId,
            categoryId: {
              in: disabled,
            },
          },
          select: {
            categoryId: true,
          },
        });

        const existingIds = new Set(
          existingDisabled.map((item) => item.categoryId),
        );

        const missing = disabled.filter((id) => !existingIds.has(id));

        if (missing.length > 0) {
          await tx.profileCategory.createMany({
            data: missing.map((categoryId) => ({
              profileId,
              categoryId,
              enabled: false,
            })),
          });
        }
      }
    });

    return {
      message: "Profile categories updated successfully",
    };
  }

  /**
   * Make sure the authenticated user actually owns
   * the profile being accessed.
   */
  private async verifyProfileOwnership(userId: string, profileId: string) {
    const profile = await this.database.profile.findFirst({
      where: {
        id: profileId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    return profile;
  }
}
