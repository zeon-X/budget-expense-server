import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { AccountsService } from "./accounts.service";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";

@Controller("profiles/:profileId/accounts")
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Param("profileId") profileId: string, @Body() dto: CreateAccountDto) {
    return this.accountsService.create(profileId, dto);
  }

  @Get()
  findAll(@Param("profileId") profileId: string) {
    return this.accountsService.findAll(profileId);
  }

  @Get(":accountId")
  findOne(
    @Param("profileId") profileId: string,
    @Param("accountId") accountId: string,
  ) {
    return this.accountsService.findOne(profileId, accountId);
  }

  @Patch(":accountId")
  update(
    @Param("profileId") profileId: string,
    @Param("accountId") accountId: string,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.accountsService.update(profileId, accountId, dto);
  }

  @Delete(":accountId")
  remove(
    @Param("profileId") profileId: string,
    @Param("accountId") accountId: string,
  ) {
    return this.accountsService.remove(profileId, accountId);
  }
}
