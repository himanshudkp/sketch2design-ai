import { Provider } from "@/lib/types";

export const AUTH_ERROR_MESSAGES = {
  OAUTH_ACCOUNT:
    "This account was created using social sign-in. Please use your social provider to sign in.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
  INVALID_EMAIL: "Invalid email address",
  INVALID_NAME: "Invalid name format",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_MAX: "Password must be between 8 and 20 characters",
  INVALID_PROVIDER: "Invalid OAuth provider",
  INVALID_RESET_TOKEN: "Invalid reset token",
  INVALID_VERIFICATION_TOKEN: "Invalid verification token",
  SIGNUP_SUCCESS:
    "Account created! Please check your email to verify your account.",
  SIGNIN_SUCCESS: "Signed in successfully!",
  VERIFICATION_EMAIL_SENT: "Verification email sent! Please check your inbox.",
  PASSWORD_RESET_SENT:
    "If an account exists with this email, you will receive a password reset link shortly.",
  PASSWORD_RESET_SUCCESS: "Password reset successfully!",
  PASSWORD_CHANGED_SUCCESS: "Password changed successfully!",
  EMAIL_VERIFIED_SUCCESS: "Email verified successfully!",
  NEW_PASSWORD_SAME_AS_OLD:
    "New password must be different from current password",
  OAUTH_INVALID_ACCOUNT:
    "This account uses a social login provider. Please sign in with your OAuth provider.",
  OAUTH_ERROR: "OAuth authentication failed",
  VERIFICATION_EXPIRED: "This verification link is invalid or has expired.",
  VERIFICATION_FAILED: "Email verification failed.",
  SIGNUP_FAILED: "Failed to create account",
  SIGNIN_FAILED: "Failed to sign in",
  OAUTH_FAILED: "OAuth login failed",
  INVALID_TOKEN: "Invalid token",
  VERIFICATION_FAILED_API: "Email verification failed",
  RESET_FAILED: "Failed to reset password",
  CHANGE_FAILED: "Failed to change password",
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_EXISTS: "An account with this email already exists",
  SERVER_ERROR: "Something went wrong. Please try again later.",
  PASSWORD_RESET_ERROR_MESSAGE:
    "Password reset is not available for accounts created with social sign-in. Please use your social provider to sign in.",
  ACCOUNT_NOT_EXIST: "Account Does Not Exist",
  RESET_PASSWORD_LINK: "Failed to send reset password link",
  PASSWORD_RESET_SUCCESS_FAILED: "Failed to send password reset success email",
  EMAIL_VERIFICATION: "Failed to send email verification link",
} as const;

export const SCHEMA_ERROR_MESSAGES = {};

export const EMAIL_ERROR_MESSAGES = {
  INVALID_EMAIL: (email: string) => `Invalid email address: ${email}`,
  EMPTY_SUBJECT: "Email subject cannot be empty",
  EMPTY_CONTENT: "Email content cannot be empty",
  MISSING_SMTP_VARS: (vars: string[]) =>
    `Missing required SMTP configuration: ${vars.join(", ")}`,
  INVALID_SMTP_PORT: "Invalid SMTP_PORT: must be a number between 1 and 65535",
  FAILED_CREATE_TRANSPORTER: (msg: string) =>
    `Failed to create email transporter: ${msg}`,
  INVALID_BUTTON_URL: (url: string) =>
    `Invalid URL provided for email button: ${url}`,
  EMAIL_SEND_SUCCESS: (email: string, id: string) =>
    `Email sent successfully to ${email}. MessageId: ${id}`,
  EMAIL_SEND_ATTEMPT_FAILED: (
    attempt: number,
    retries: number,
    email: string,
    err: string
  ) => `Email send attempt ${attempt}/${retries} failed for ${email}: ${err}`,
  EMAIL_RETRY_DELAY: (ms: number) => `Retrying in ${ms}ms...`,
  EMAIL_CONFIGURATION_ERROR: (msg: string) =>
    `Email configuration error: ${msg}`,
  EMAIL_SEND_FINAL_FAILURE: (email: string, retries: number) =>
    `Failed to send email to ${email} after ${retries} attempts`,
  FAILED_PASSWORD_RESET_EMAIL: (email: string) =>
    `Failed to send password reset email to ${email}`,
  FAILED_VERIFICATION_EMAIL: (email: string) =>
    `Failed to send verification email to ${email}`,
  FAILED_PASSWORD_RESET_SUCCESS_EMAIL: (email: string) =>
    `Failed to send password reset success email to ${email}`,
};

export const EMAIL_SENDER = `"Sketch2Design" <${process.env.SMTP_USER}>`;
export const APP_NAME = "Sketch2Design";

export const PASSWORD_RESET_SUCCESS_SUBJECT = "Your password has been reset";
export const VERIFY_EMAIL_SUCCESS_SUBJECT = `Verify your ${APP_NAME} email`;
export const RESET_PASSWORD_SUBJECT = `Reset your ${APP_NAME} password`;

export const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000;

export const BETTER_AUTH_DB_PROVIDER = "postgresql";
export const BETTER_AUTH_COOKIE_PREFIX = "sketch_2_design_auth";

export const VALIDATION_MESSAGES = {
  EMAIL_INVALID: "Invalid email address",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN: "Password must be at least 8 characters",
  PASSWORD_MAX: "Password must be at most 128 characters",
  PASSWORD_UPPERCASE: "Must contain at least one uppercase letter",
  PASSWORD_LOWERCASE: "Must contain at least one lowercase letter",
  PASSWORD_NUMBER: "Must contain at least one number",
  PASSWORD_SPECIAL: "Must contain at least one special character",
  FIRSTNAME_MIN: "First name must be at least 2 characters",
  FIRSTNAME_MAX: "First name must be at most 50 characters",
  FIRSTNAME_INVALID: "First name contains invalid characters",
  LASTNAME_MIN: "Last name must be at least 2 characters",
  LASTNAME_MAX: "Last name must be at most 50 characters",
  LASTNAME_INVALID: "Last name contains invalid characters",
  TOKEN_REQUIRED: "Token is required",
  PASSWORDS_MISMATCH: "Passwords do not match",
};

export const PROVIDERS: Provider[] = ["google", "github"];

export const ERRORS = {
  NOT_AUTHENTICATED: { status: 401, error: "User is not authenticated." },
  USER_NOT_FOUND: {
    status: 404,
    error: "User does not exist in the database.",
  },
  SERVER_ERROR: {
    status: 500,
    error: "Internal server error while retrieving subscription.",
  },
  PROJECT_NOT_FOUND: {
    status: 404,
    error: "Project not found",
  },
  ACCESS_DENIED: {
    status: 403,
    error: "Access denied",
  },
  PROJECT_ID_NOT_FOUND: {
    status: 404,
    error: "Project not found.",
  },
} as const;
