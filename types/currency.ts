export type Currency = {
  active: boolean;
  code: string;
  createdAt: string;
  deletedAt: string;
  exchangeRate: number;
  name: string;
  symbol: string;
  updatedAt: string;
}

export interface CurrencyResult {
  rows: Currency[];
}