import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(200),
  icon: z.string().optional(),
  categoryType: z.enum(['INCOME', 'EXPENSE'])
})

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
