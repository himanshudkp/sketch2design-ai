import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/schema";
import { z } from "zod";

export type Provider = "google" | "github";

export interface ProviderConfig {
  label: string;
  ariaLabel: string;
}

export interface EmailParams {
  email: string;
  subject: string;
  html: string;
}

export interface SendEmail {
  email: string;
  url?: string;
  name?: string | null;
}

export type SignInData = z.infer<typeof signInSchema>;
export type SignUpData = z.infer<typeof signUpSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export interface BetterAuthCallback {
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  };
  url?: string;
}

export type ErrorCode =
  | "EMAIL_EXISTS"
  | "EMAIL_NOT_VERIFIED"
  | "INVALID_CREDENTIALS"
  | "INVALID_TOKEN"
  | "INVALID_PASSWORD"
  | "TOKEN_EXPIRED"
  | "OAUTH_FAILED"
  | "OAUTH_ACCOUNT"
  | "OAUTH_ERROR"
  | "VERIFICATION_FAILED"
  | "SIGNUP_FAILED"
  | "SIGNIN_FAILED"
  | "RESET_FAILED"
  | "CHANGE_FAILED"
  | "SERVER_ERROR"
  | "VALIDATION_ERROR";

export type ActionResponse<T = undefined> = {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: ErrorCode;
  message?: string;
};

export interface AuthApiError {
  message?: string;
  status?: number;
}

export type SocialProvider = "google" | "github";

export interface Response<T> {
  status: number;
  data?: T;
  error?: string;
  message?: string;
}

export interface Entitlement {
  entitlement: boolean;
  profileName: string;
}
