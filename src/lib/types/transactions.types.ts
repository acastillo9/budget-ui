import type { Account } from "./account.types";
import type { Category } from "./category.types";

export type Transaction = {
  id: string;
  date: Date;
  amount: number;
  description: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  isTransfer: boolean;
  category: Category;
  account: Account;
  transfer: Transaction;
}
