export type Transaction = {
  amount: number;
  baseCurrency: string;
  categoryId: string;
  convertedAmount: number;
  createdAt: string;
  currency: string;
  description: string;
  deletedAt: string;
  id: string;
  modeOfPaymentId: number;
  transactionDate: string;
  type: string;
  updatedAt: string;
  userId: string;
}

export interface TransactionResult {
  rows: Transaction[];
}