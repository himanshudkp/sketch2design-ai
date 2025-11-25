"use server";

import { auth } from "@/lib/auth";
import { AUTH_ERROR_MESSAGES, BASE_URL } from "@/lib/constants";
import {
  createErrorResponse,
  createSuccessResponse,
  extractAuthError,
  getErrorMessage,
  handleAuthApiError,
  hasError,
} from "@/lib/error";
import type { ActionResponse, SocialProvider } from "@/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUp = async (
  email: string,
  password: string,
  firstname: string,
  lastname: string
): Promise<ActionResponse> => {
  try {
    const name = `${firstname.trim()} ${lastname.trim()}`;

    const result = await auth.api.signUpEmail({
      body: { email: email.toLowerCase().trim(), password, name },
    });

    if (hasError(result)) {
      return handleAuthApiError(result, "SIGNUP_FAILED");
    }

    return createSuccessResponse(AUTH_ERROR_MESSAGES.SIGNUP_SUCCESS);
  } catch (error) {
    console.error("[signUp] Error:", error);
    return createErrorResponse(getErrorMessage(error), "SERVER_ERROR");
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<ActionResponse> => {
  try {
    const result = await auth.api.signInEmail({
      body: { email: email.toLowerCase().trim(), password },
    });

    if (hasError(result)) {
      return handleAuthApiError(result, "SIGNIN_FAILED");
    }

    return createSuccessResponse(AUTH_ERROR_MESSAGES.SIGNIN_SUCCESS);
  } catch (error) {
    console.error("[signIn] Error:", error);
    return createErrorResponse(getErrorMessage(error), "SERVER_ERROR");
  }
};

export const signInSocial = async (
  provider: SocialProvider
): Promise<ActionResponse<{ url?: string }>> => {
  try {
    const result = await auth.api.signInSocial({
      body: {
        provider,
        callbackURL: "/dashboard",
      },
    });

    if (hasError(result)) {
      return handleAuthApiError<{ url?: string }>(result, "OAUTH_FAILED");
    }

    const url =
      typeof result === "object" && result !== null && "url" in result
        ? (result.url as string | undefined)
        : undefined;

    return createSuccessResponse<{ url?: string }>(undefined, { url });
  } catch (error) {
    console.error("[signInSocial] Error:", error);
    return createErrorResponse<{ url?: string }>(
      getErrorMessage(error),
      "OAUTH_ERROR"
    );
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    console.error("[signOut] Error:", error);
  }

  redirect("/sign-in");
};

export const sendVerificationEmail = async (
  email: string
): Promise<ActionResponse> => {
  try {
    const result = await auth.api.sendVerificationEmail({
      body: {
        email: email.toLowerCase().trim(),
        callbackURL: "/dashboard",
      },
    });

    if (hasError(result)) {
      return handleAuthApiError(result, "VERIFICATION_FAILED");
    }

    return createSuccessResponse(AUTH_ERROR_MESSAGES.VERIFICATION_EMAIL_SENT);
  } catch (error) {
    console.error("[sendVerificationEmail] Error:", error);
    return createErrorResponse(getErrorMessage(error), "SERVER_ERROR");
  }
};

export const requestPasswordReset = async (
  email: string
): Promise<ActionResponse> => {
  try {
    const result = await auth.api.forgetPassword({
      body: {
        email: email.toLowerCase().trim(),
        redirectTo: `${BASE_URL}/reset-password`,
      },
    });

    if (hasError(result)) {
      const { message } = extractAuthError(result.error);
      if (message.toLowerCase().includes("oauth")) {
        return createErrorResponse(
          AUTH_ERROR_MESSAGES.OAUTH_INVALID_ACCOUNT,
          "OAUTH_ACCOUNT"
        );
      }
    }

    return createSuccessResponse(AUTH_ERROR_MESSAGES.PASSWORD_RESET_SENT);
  } catch (error) {
    console.error("[requestPasswordReset] Error:", error);
    return createSuccessResponse(AUTH_ERROR_MESSAGES.PASSWORD_RESET_SENT);
  }
};

export const resetPassword = async (
  newPassword: string,
  token: string
): Promise<ActionResponse> => {
  try {
    if (!token || token.trim().length === 0) {
      return createErrorResponse(
        AUTH_ERROR_MESSAGES.INVALID_RESET_TOKEN,
        "INVALID_TOKEN"
      );
    }

    const result = await auth.api.resetPassword({
      body: {
        newPassword,
        token: token.trim(),
      },
    });

    if (hasError(result)) {
      return handleAuthApiError(result, "RESET_FAILED");
    }

    return createSuccessResponse(AUTH_ERROR_MESSAGES.PASSWORD_RESET_SUCCESS);
  } catch (error) {
    console.error("[resetPassword] Error:", error);
    return createErrorResponse(getErrorMessage(error), "SERVER_ERROR");
  }
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  revokeOtherSessions: boolean = true
): Promise<ActionResponse> => {
  try {
    const result = await auth.api.changePassword({
      body: {
        currentPassword,
        newPassword,
        revokeOtherSessions,
      },
      headers: await headers(),
    });

    if (hasError(result)) {
      return handleAuthApiError(result, "CHANGE_FAILED");
    }

    return createSuccessResponse(AUTH_ERROR_MESSAGES.PASSWORD_CHANGED_SUCCESS);
  } catch (error) {
    console.error("[changePassword] Error:", error);
    return createErrorResponse(getErrorMessage(error), "SERVER_ERROR");
  }
};

export const verifyEmail = async (token: string): Promise<ActionResponse> => {
  try {
    if (!token || token.trim().length === 0) {
      return createErrorResponse(
        AUTH_ERROR_MESSAGES.INVALID_VERIFICATION_TOKEN,
        "INVALID_TOKEN"
      );
    }

    const result = await auth.api.verifyEmail({
      query: { token: token.trim() },
    });

    if (hasError(result)) {
      const { message } = extractAuthError(result.error);
      const lowerMessage = message.toLowerCase();

      if (
        lowerMessage.includes("expired") ||
        lowerMessage.includes("invalid")
      ) {
        return createErrorResponse(
          AUTH_ERROR_MESSAGES.VERIFICATION_EXPIRED,
          "TOKEN_EXPIRED"
        );
      }

      return createSuccessResponse(AUTH_ERROR_MESSAGES.EMAIL_VERIFIED_SUCCESS);
    }

    return createSuccessResponse("Email verified successfully!");
  } catch (error) {
    console.error("[verifyEmail] Error:", error);
    return createErrorResponse(
      getErrorMessage(error) || AUTH_ERROR_MESSAGES.SERVER_ERROR,
      "SERVER_ERROR"
    );
  }
};
