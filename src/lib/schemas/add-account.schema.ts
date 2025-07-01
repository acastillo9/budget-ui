import { z } from 'zod';

export const addAccountSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(200),
  balance: z.number().min(0, { message: 'Balance must be a positive number' }).default('' as unknown as number),
  accountType: z.enum(['CHECKING', 'CREDIT', 'CASH']),
  currencyCode: z.enum(['USD', 'COP']),
})

export type AddAccountSchema = z.infer<typeof addAccountSchema>;
