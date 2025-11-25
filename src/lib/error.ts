import type { ActionResponse, AuthApiError, ErrorCode } from "@/types";
import { AUTH_ERROR_MESSAGES } from "./constants";

export class AuthError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class EmailConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailConfigurationError";
  }
}

export class EmailSendError extends Error {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = "EmailSendError";
  }
}

export const getErrorMessage = (error: unknown) => {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as any).message === "string"
  ) {
    return (error as any).message;
  }
  return "Unknown error";
};

export const hasError = (result: unknown): result is { error: unknown } => {
  return (
    typeof result === "object" &&
    result !== null &&
    "error" in result &&
    result.error != null
  );
};

export const extractAuthError = (
  error: unknown
): { message: string; status: number | null } => {
  if (!error) {
    return { message: "", status: null };
  }

  if (typeof error === "string") {
    return { message: error, status: null };
  }

  if (typeof error === "object") {
    const errorObj = error as Partial<AuthApiError>;
    return {
      message: errorObj.message || "",
      status: errorObj.status ?? null,
    };
  }

  return { message: "", status: null };
};

export const createErrorResponse = <T = undefined>(
  error: string,
  errorCode: ErrorCode
): ActionResponse<T> => ({
  success: false,
  error,
  errorCode,
});

export const createSuccessResponse = <T = undefined>(
  message?: string,
  data?: T
): ActionResponse<T> => ({
  success: true,
  message,
  ...(data !== undefined && { data }),
});

export const handleAuthApiError = <T = undefined>(
  result: unknown,
  defaultErrorCode: ErrorCode
): ActionResponse<T> => {
  if (!hasError(result)) {
    return createErrorResponse(
      AUTH_ERROR_MESSAGES.UNKNOWN_ERROR,
      defaultErrorCode
    );
  }

  const { message, status } = extractAuthError(result.error);

  if (status === 403) {
    return createErrorResponse(
      AUTH_ERROR_MESSAGES.EMAIL_VERIFICATION,
      "EMAIL_NOT_VERIFIED"
    );
  }

  if (status === 401 || message.toLowerCase().includes("invalid")) {
    return createErrorResponse(
      AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
      "INVALID_CREDENTIALS"
    );
  }

  if (
    message.toLowerCase().includes("email") &&
    message.toLowerCase().includes("exist")
  ) {
    return createErrorResponse(
      AUTH_ERROR_MESSAGES.EMAIL_EXISTS,
      "EMAIL_EXISTS"
    );
  }

  if (message.toLowerCase().includes("oauth")) {
    return createErrorResponse(
      AUTH_ERROR_MESSAGES.OAUTH_ACCOUNT,
      "OAUTH_ACCOUNT"
    );
  }

  if (
    message.toLowerCase().includes("token") ||
    message.toLowerCase().includes("expired")
  ) {
    return createErrorResponse(
      AUTH_ERROR_MESSAGES.INVALID_TOKEN,
      "INVALID_TOKEN"
    );
  }

  if (message.toLowerCase().includes("current")) {
    return createErrorResponse(
      "Current password is incorrect",
      "INVALID_PASSWORD"
    );
  }

  return createErrorResponse(
    message || AUTH_ERROR_MESSAGES.UNKNOWN_ERROR,
    defaultErrorCode
  );
};
