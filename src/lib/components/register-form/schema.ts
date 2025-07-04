import { $t } from '$lib/i18n';
import { z } from 'zod';

export const signupFormSchema = z.object({
  name: z.string().min(1, { message: $t('signUp.validation.nameIsRequired') }).max(200),
  email: z.string().email(),
});

export type SignupFormSchema = z.infer<typeof signupFormSchema>;

export const checkEmailSchema = signupFormSchema.pick({ email: true });

export type CheckEmailSchema = z.infer<typeof checkEmailSchema>;

export const activationSchema = z.object({
  activationCode: z.string().min(6, { message: $t('signUp.validation.activationCodeMinLength') }).max(6),
});

export type ActivationSchema = z.infer<typeof activationSchema>;

export const activationWithEmailSchema = z.object({
  email: z.string().email(),
  activationCode: z.string().min(6, { message: $t('signUp.validation.activationCodeMinLength') }).max(6),
});

export type ActivationWithEmailSchema = z.infer<typeof activationWithEmailSchema>;

export const passwordSchema = z.object({
  password: z.string()
    .min(8, { message: $t('signUp.validation.passwordMinLength') })
    .max(250)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).*$/, { message: $t('signUp.validation.passwordMustContainUppercase') }),
});

export type PasswordSchema = z.infer<typeof passwordSchema>;

export const passwordWithTokenSchema = z.object({
  accessToken: z.string(),
  password: passwordSchema.shape.password,
});

export type PasswordWithTokenSchema = z.infer<typeof passwordWithTokenSchema>;
