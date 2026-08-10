import { Injectable, NotFoundException } from "@nestjs/common";

import { DatabaseService } from "../../database/database.service";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";

@Injectable()
export class AccountsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(profileId: string, dto: CreateAccountDto) {
    // TODO:
    // Verify that the profile belongs to the authenticated user.
    // We will add this when connecting authentication properly.

    return this.databaseService.account.create({
      data: {
        profileId,
        name: dto.name,
        type: dto.type,
        currency: dto.currency ?? "BDT",
      },
    });
  }

  async findAll(profileId: string) {
    return this.databaseService.account.findMany({
      where: {
        profileId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findOne(profileId: string, accountId: string) {
    const account = await this.databaseService.account.findFirst({
      where: {
        id: accountId,
        profileId,
      },
    });

    if (!account) {
      throw new NotFoundException("Account not found");
    }

    return account;
  }

  async update(profileId: string, accountId: string, dto: UpdateAccountDto) {
    await this.findOne(profileId, accountId);

    return this.databaseService.account.update({
      where: {
        id: accountId,
      },
      data: {
        ...(dto.name !== undefined && {
          name: dto.name,
        }),

        ...(dto.type !== undefined && {
          type: dto.type,
        }),

        ...(dto.currency !== undefined && {
          currency: dto.currency,
        }),
      },
    });
  }

  async remove(profileId: string, accountId: string) {
    await this.findOne(profileId, accountId);

    return this.databaseService.account.delete({
      where: {
        id: accountId,
      },
    });
  }
}
