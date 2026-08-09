import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UseGuards,
} from "@nestjs/common";

import { UsersService } from "./users.service";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

import { ChangePasswordDto } from "./dto/change-password.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  getMe(@Req() req: any) {
    return this.usersService.getMe(req.user.userId);
  }

  @Patch("me")
  updateMe(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateMe(req.user.userId, dto);
  }

  @Patch("me/password")
  changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.userId, dto);
  }

  @Delete("me")
  deleteMe(@Req() req: any) {
    return this.usersService.deleteMe(req.user.userId);
  }
}
