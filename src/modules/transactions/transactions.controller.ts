import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

import { TransactionsService } from "./transactions.service";

import { CreateExpenseDto } from "./dto/create-expense.dto";
import { CreateIncomeDto } from "./dto/create-income.dto";
import { CreateTransferDto } from "./dto/create-transfer.dto";
import { TransactionQueryDto } from "./dto/transaction-query.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";

@Controller("profiles/:profileId/transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post("income")
  createIncome(
    @Req() req: any,
    @Param("profileId") profileId: string,
    @Body() dto: CreateIncomeDto,
  ) {
    return this.transactionsService.createIncome(req.user.id, profileId, dto);
  }

  @Post("expense")
  createExpense(
    @Req() req: any,
    @Param("profileId") profileId: string,
    @Body() dto: CreateExpenseDto,
  ) {
    return this.transactionsService.createExpense(req.user.id, profileId, dto);
  }

  @Post("transfer")
  createTransfer(
    @Req() req: any,
    @Param("profileId") profileId: string,
    @Body() dto: CreateTransferDto,
  ) {
    return this.transactionsService.createTransfer(req.user.id, profileId, dto);
  }

  @Get()
  findAll(
    @Req() req: any,
    @Param("profileId") profileId: string,
    @Query() query: TransactionQueryDto,
  ) {
    return this.transactionsService.findAll(req.user.id, profileId, query);
  }

  @Get(":transactionId")
  findOne(
    @Req() req: any,
    @Param("profileId") profileId: string,
    @Param("transactionId") transactionId: string,
  ) {
    return this.transactionsService.findOne(
      req.user.id,
      profileId,
      transactionId,
    );
  }

  @Patch(":transactionId")
  update(
    @Req() req: any,
    @Param("profileId") profileId: string,
    @Param("transactionId") transactionId: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(
      req.user.id,
      profileId,
      transactionId,
      dto,
    );
  }

  @Delete(":transactionId")
  remove(
    @Req() req: any,
    @Param("profileId") profileId: string,
    @Param("transactionId") transactionId: string,
  ) {
    return this.transactionsService.remove(
      req.user.id,
      profileId,
      transactionId,
    );
  }
}
