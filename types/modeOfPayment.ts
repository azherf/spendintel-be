export type ModeOfPayment = {
  createdAt: string;
  deletedAt: string;
  description: string;
  id: string;
  name: string;
  type: string;
  updatedAt: string;
  userId: string;
}

export interface ModeOfPaymentResult {
  rows: ModeOfPayment[];
}