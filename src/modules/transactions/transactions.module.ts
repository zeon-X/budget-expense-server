import { Module } from "@nestjs/common";

import { DatabaseModule } from "../../database/database.module";

import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";

import { TransactionBalanceService } from "./services/transaction-balance.service";
import { TransactionPhotoService } from "./services/transaction-photo.service";

@Module({
  imports: [DatabaseModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionBalanceService,
    TransactionPhotoService,
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}
