import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean(),
});

export type LoginFormSchema = typeof loginFormSchema;
