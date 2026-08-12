import { Injectable } from "@nestjs/common";

import { DatabaseService } from "../../../database/database.service";

@Injectable()
export class TransactionBalanceService {
  constructor(private readonly db: DatabaseService) {}

  async recalculateAccountBalance(accountId: string): Promise<void> {
    // Checkpoint-based balance calculation will be implemented here.
    //
    // This service will eventually:
    // 1. Find the account checkpoint.
    // 2. Find transactions after that checkpoint.
    // 3. Calculate the delta.
    // 4. Update Account.currentBalance.
    // 5. Move the checkpoint forward.
  }
}
