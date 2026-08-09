import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { Request } from "express";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ProfilesService } from "./profiles.service";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

@Controller("profiles")
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateProfileDto) {
    return this.profilesService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.profilesService.findAll(req.user.id);
  }

  @Get(":profileId")
  findOne(
    @Req() req: AuthenticatedRequest,
    @Param("profileId") profileId: string,
  ) {
    return this.profilesService.findOne(req.user.id, profileId);
  }

  @Patch(":profileId")
  update(
    @Req() req: AuthenticatedRequest,
    @Param("profileId") profileId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profilesService.update(req.user.id, profileId, dto);
  }

  @Patch(":profileId/default")
  setDefault(
    @Req() req: AuthenticatedRequest,
    @Param("profileId") profileId: string,
  ) {
    return this.profilesService.setDefault(req.user.id, profileId);
  }

  @Delete(":profileId")
  remove(
    @Req() req: AuthenticatedRequest,
    @Param("profileId") profileId: string,
  ) {
    return this.profilesService.remove(req.user.id, profileId);
  }
}
