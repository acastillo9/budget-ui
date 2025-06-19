import { z } from 'zod';

export const addTransactionSchema = z.object({
  amount: z.number().min(0.01, { message: 'Amount must be greater than 0' }).default('' as unknown as number),
  date: z.string().min(1, { message: 'Date is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  notes: z.string().optional(),
  account: z.string().min(1, { message: 'Account is required' }),
  category: z.string().optional(),
  originAccount: z.string().optional(),
})

export type AddTransactionSchema = typeof addTransactionSchema;

export const addTransferSchema = z.object({
  amount: z.number().min(0.01, { message: 'Amount must be greater than 0' }).default('' as unknown as number),
  date: z.string().min(1, { message: 'Date is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  notes: z.string().optional(),
  originAccount: z.string().min(1, { message: 'Origin account is required' }),
  account: z.string().min(1, { message: 'Account is required' }),
  category: z.string().optional(),
})

export type AddTransferSchema = typeof addTransferSchema;
