export type Category = {
  createdAt: string;
  deletedAt: string;
  description: string;
  id: string;
  name: string;
  type: string;
  updatedAt: string;
  userId: string;
}

export interface CategoryResult {
  rows: Category[];
}