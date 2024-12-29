export type User = {
  accounts: Account[];
  active: boolean;
  contact: string;
  country: string;
  createdAt: string;
  defaultCurrency: string;
  deletedAt: string;
  email: string;
  exists?: boolean;
  firstName: string;
  id: string;
  lastName: string;
  password: string | undefined;
  updatedAt: string;
};

export type Account = {
  balance: number;
  createdAt: string;
  currency: string;
  deletedAt: string;
  id: string;
  name: string;
  updatedAt: string;
  userId: string;
};

export interface UserResult {
  rows: User[];
}