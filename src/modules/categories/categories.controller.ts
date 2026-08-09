import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CategoriesService } from "./categories.service";
import { UpdateProfileCategoriesDto } from "./dto/update-profile-categories.dto";

@Controller()
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * GET /api/categories
   * GET /api/categories?parentId=...
   */
  @Get("categories")
  async getCategories(@Query("parentId") parentId?: string) {
    return this.categoriesService.getCategories(parentId);
  }

  /**
   * GET /api/profiles/:profileId/categories
   */
  @Get("profiles/:profileId/categories")
  async getProfileCategories(
    @Param("profileId") profileId: string,
    @Req() req: any,
  ) {
    return this.categoriesService.getProfileCategories(req.user.id, profileId);
  }

  /**
   * PATCH /api/profiles/:profileId/categories
   */
  @Patch("profiles/:profileId/categories")
  async updateProfileCategories(
    @Param("profileId") profileId: string,
    @Body() dto: UpdateProfileCategoriesDto,
    @Req() req: any,
  ) {
    return this.categoriesService.updateProfileCategories(
      req.user.id,
      profileId,
      dto,
    );
  }
}
