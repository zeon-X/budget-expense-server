import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { Prisma } from "@prisma/client";

import { DatabaseService } from "../../database/database.service";
import { TransactionType } from "./types/transaction.types";

import { CreateExpenseDto } from "./dto/create-expense.dto";
import { CreateIncomeDto } from "./dto/create-income.dto";
import { CreateTransferDto } from "./dto/create-transfer.dto";
import { TransactionQueryDto } from "./dto/transaction-query.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";

import { TransactionBalanceService } from "./services/transaction-balance.service";

@Injectable()
export class TransactionsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly balanceService: TransactionBalanceService,
  ) {}

  private async ensureProfile(userId: string, profileId: string) {
    const profile = await this.db.profile.findFirst({
      where: {
        id: profileId,
        userId,
      },
    });

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    return profile;
  }

  private async ensureAccount(profileId: string, accountId: string) {
    const account = await this.db.account.findFirst({
      where: {
        id: accountId,
        profileId,
      },
    });

    if (!account) {
      throw new BadRequestException("Account does not belong to this profile");
    }

    return account;
  }

  private async ensureCategory(categoryId?: string) {
    if (!categoryId) {
      return;
    }

    const category = await this.db.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new BadRequestException("Category not found");
    }

    return category;
  }

  async createIncome(userId: string, profileId: string, dto: CreateIncomeDto) {
    await this.ensureProfile(userId, profileId);

    if (dto.accountId) {
      await this.ensureAccount(profileId, dto.accountId);
    }

    await this.ensureCategory(dto.categoryId);

    const transaction = await this.db.transaction.create({
      data: {
        profileId,
        accountId: dto.accountId,
        categoryId: dto.categoryId,
        type: TransactionType.INCOME,
        amount: Number(dto.amount),
        note: dto.note,
        photoUrl: dto.photoUrl,
        transactionDate: new Date(dto.transactionDate),
      },
    });

    if (dto.accountId) {
      await this.balanceService.recalculateAccountBalance(dto.accountId);
    }

    return transaction;
  }

  async createExpense(
    userId: string,
    profileId: string,
    dto: CreateExpenseDto,
  ) {
    await this.ensureProfile(userId, profileId);

    await this.ensureAccount(profileId, dto.accountId);
    await this.ensureCategory(dto.categoryId);

    const transaction = await this.db.transaction.create({
      data: {
        profileId,
        accountId: dto.accountId,
        categoryId: dto.categoryId,
        type: TransactionType.EXPENSE,
        amount: Number(dto.amount),
        note: dto.note,
        photoUrl: dto.photoUrl,
        transactionDate: new Date(dto.transactionDate),
      },
    });

    await this.balanceService.recalculateAccountBalance(dto.accountId);

    return transaction;
  }

  async createTransfer(
    userId: string,
    profileId: string,
    dto: CreateTransferDto,
  ) {
    await this.ensureProfile(userId, profileId);

    if (dto.sourceAccountId === dto.destinationAccountId) {
      throw new BadRequestException(
        "Source and destination accounts must be different",
      );
    }

    await this.ensureAccount(profileId, dto.sourceAccountId);

    await this.ensureAccount(profileId, dto.destinationAccountId);

    const transaction = await this.db.transaction.create({
      data: {
        profileId,
        type: TransactionType.TRANSFER,
        amount: Number(dto.amount),
        note: dto.note,
        photoUrl: dto.photoUrl,
        transactionDate: new Date(dto.transactionDate),
        sourceAccountId: dto.sourceAccountId,
        destinationAccountId: dto.destinationAccountId,
      },
    });

    await this.balanceService.recalculateAccountBalance(dto.sourceAccountId);

    await this.balanceService.recalculateAccountBalance(
      dto.destinationAccountId,
    );

    return transaction;
  }

  async findAll(userId: string, profileId: string, query: TransactionQueryDto) {
    await this.ensureProfile(userId, profileId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.TransactionWhereInput = {
      profileId,
    };

    if (query.type) {
      where.type = query.type;
    }

    if (query.accountId) {
      where.accountId = query.accountId;
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.from || query.to) {
      where.transactionDate = {};

      if (query.from) {
        where.transactionDate.gte = new Date(query.from);
      }

      if (query.to) {
        where.transactionDate.lte = new Date(query.to);
      }
    }

    if (query.minAmount || query.maxAmount) {
      where.amount = {};

      if (query.minAmount) {
        where.amount.gte = Number(query.minAmount);
      }

      if (query.maxAmount) {
        where.amount.lte = Number(query.maxAmount);
      }
    }

    if (query.search) {
      where.note = {
        contains: query.search,
        mode: "insensitive",
      };
    }

    const [transactions, total] = await Promise.all([
      this.db.transaction.findMany({
        where,
        orderBy: {
          [query.sortBy ?? "transactionDate"]: query.sortOrder ?? "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),

      this.db.transaction.count({
        where,
      }),
    ]);

    return {
      data: transactions,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, profileId: string, transactionId: string) {
    await this.ensureProfile(userId, profileId);

    const transaction = await this.db.transaction.findFirst({
      where: {
        id: transactionId,
        profileId,
      },
    });

    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }

    return transaction;
  }

  async update(
    userId: string,
    profileId: string,
    transactionId: string,
    dto: UpdateTransactionDto,
  ) {
    const existing = await this.findOne(userId, profileId, transactionId);

    if (dto.accountId) {
      await this.ensureAccount(profileId, dto.accountId);
    }

    await this.ensureCategory(dto.categoryId);

    const data: Prisma.TransactionUncheckedUpdateInput = {};

    if (dto.amount !== undefined) {
      data.amount = Number(dto.amount);
    }

    if (dto.accountId !== undefined) {
      data.accountId = dto.accountId;
    }

    if (dto.categoryId !== undefined) {
      data.categoryId = dto.categoryId;
    }

    if (dto.note !== undefined) {
      data.note = dto.note;
    }

    if (dto.photoUrl !== undefined) {
      data.photoUrl = dto.photoUrl;
    }

    if (dto.transactionDate !== undefined) {
      data.transactionDate = new Date(dto.transactionDate);
    }

    const transaction = await this.db.transaction.update({
      where: {
        id: transactionId,
      },
      data,
    });

    if (existing.accountId) {
      await this.balanceService.recalculateAccountBalance(existing.accountId);
    }

    if (dto.accountId && dto.accountId !== existing.accountId) {
      await this.balanceService.recalculateAccountBalance(dto.accountId);
    }

    return transaction;
  }

  async remove(userId: string, profileId: string, transactionId: string) {
    const existing = await this.findOne(userId, profileId, transactionId);

    await this.db.transaction.delete({
      where: {
        id: transactionId,
      },
    });

    if (existing.accountId) {
      await this.balanceService.recalculateAccountBalance(existing.accountId);
    }

    if (existing.sourceAccountId) {
      await this.balanceService.recalculateAccountBalance(
        existing.sourceAccountId,
      );
    }

    if (existing.destinationAccountId) {
      await this.balanceService.recalculateAccountBalance(
        existing.destinationAccountId,
      );
    }

    return {
      message: "Transaction deleted successfully",
    };
  }
}
