export interface AccountResponse {
  id: string;
  profileId: string;
  name: string;
  type: string;
  currency: string;
  currentBalance: string;
  lastBalanceTransactionId: string | null;
  balanceUpdatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
