import { z } from "zod";

export const signupFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(200),
  email: z.string().email(),
});

export type SignupFormSchema = typeof signupFormSchema;

export const checkEmailSchema = signupFormSchema.pick({ email: true });

export type CheckEmailSchema = typeof checkEmailSchema;

export const activationSchema = z.object({
  activationCode: z.string().min(6, { message: 'Your one-time password must be at least 6 digits.' }).max(6),
});

export type ActivationSchema = typeof activationSchema;

export const activationWithEmailSchema = z.object({
  email: z.string().email(),
  activationCode: z.string().min(6, { message: 'Your one-time password must be at least 6 digits.' }).max(6),
});

export type ActivationWithEmailSchema = typeof activationWithEmailSchema;

export const passwordSchema = z.object({
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(250)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).*$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' }),
});

export type PasswordSchema = typeof passwordSchema;

export const passwordWithTokenSchema = z.object({
  accessToken: z.string(),
  password: passwordSchema.shape.password,
});

export type PasswordWithTokenSchema = typeof passwordWithTokenSchema;
