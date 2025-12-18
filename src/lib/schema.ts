import { z } from "zod";
import { VALIDATION_MESSAGES } from "./constants";

const emailSchema = z.string().email(VALIDATION_MESSAGES.EMAIL_INVALID);

const passwordSchema = z
  .string()
  .min(8, VALIDATION_MESSAGES.PASSWORD_MIN)
  .max(128, VALIDATION_MESSAGES.PASSWORD_MAX)
  .regex(/[A-Z]/, VALIDATION_MESSAGES.PASSWORD_UPPERCASE)
  .regex(/[a-z]/, VALIDATION_MESSAGES.PASSWORD_LOWERCASE)
  .regex(/[0-9]/, VALIDATION_MESSAGES.PASSWORD_NUMBER)
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    VALIDATION_MESSAGES.PASSWORD_SPECIAL
  );

export const signInSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED)
    .min(8, VALIDATION_MESSAGES.PASSWORD_MIN),
});

export const signUpSchema = z.object({
  firstname: z
    .string()
    .min(2, VALIDATION_MESSAGES.FIRSTNAME_MIN)
    .max(50, VALIDATION_MESSAGES.FIRSTNAME_MAX)
    .regex(/^[a-zA-Z\s'-]+$/, VALIDATION_MESSAGES.FIRSTNAME_INVALID),

  lastname: z
    .string()
    .min(2, VALIDATION_MESSAGES.LASTNAME_MIN)
    .max(50, VALIDATION_MESSAGES.LASTNAME_MAX)
    .regex(/^[a-zA-Z\s'-]+$/, VALIDATION_MESSAGES.LASTNAME_INVALID),

  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
    token: z.string().min(1, VALIDATION_MESSAGES.TOKEN_REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORDS_MISMATCH,
    path: ["confirmPassword"],
  });
