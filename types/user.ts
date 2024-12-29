export type user = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  contact: string;
  accounts: account[];
  password: string | undefined;
  country: string;
  defaultCurrency: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type account = {
  id: string;
  userId: string;
  name: string;
  currency: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export interface UserResult {
  rows: user[];
}