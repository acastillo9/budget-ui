import { z } from "zod";

export const forgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordFormSchema>;
