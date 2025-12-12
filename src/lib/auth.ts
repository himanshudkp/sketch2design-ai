import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import {
  sendPasswordResetEmail,
  sendPasswordResetSuccessEmail,
  sendVerificationEmail,
} from "./email";
import { prisma } from "./prisma";
import {
  AUTH_ERROR_MESSAGES,
  BASE_URL,
  BETTER_AUTH_COOKIE_PREFIX,
  BETTER_AUTH_DB_PROVIDER,
} from "./constants";
import { SESSION_CONFIG } from "./config";
import type { BetterAuthCallback } from "@/lib/types";

async function handlePasswordReset({
  user,
  url,
}: BetterAuthCallback): Promise<void> {
  try {
    await validateAccountCredential(user.id);

    await sendPasswordResetEmail({
      email: user.email,
      url,
      name: user.name,
    });
  } catch (error) {
    console.error(
      `${AUTH_ERROR_MESSAGES.PASSWORD_RESET_ERROR_MESSAGE}: `,
      error
    );

    throw error;
  }
}

async function handlePasswordResetSuccess({ user }: BetterAuthCallback) {
  try {
    await sendPasswordResetSuccessEmail({
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error(`${AUTH_ERROR_MESSAGES.PASSWORD_RESET_SUCCESS}: `, error);
    throw error;
  }
}

async function handleVerificationEmail({ user, url }: BetterAuthCallback) {
  try {
    await sendVerificationEmail({
      email: user.email,
      url,
      name: user.name,
    });
  } catch (error) {
    console.error(`${AUTH_ERROR_MESSAGES.EMAIL_VERIFICATION}: `, error);
    throw error;
  }
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: BETTER_AUTH_DB_PROVIDER,
  }),

  baseURL: BASE_URL,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 20,
    sendResetPassword: handlePasswordReset,
    onPasswordReset: handlePasswordResetSuccess,
  },

  emailVerification: {
    sendVerificationEmail: handleVerificationEmail,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  plugins: [nextCookies()],

  session: SESSION_CONFIG,

  advanced: {
    cookiePrefix: BETTER_AUTH_COOKIE_PREFIX,
  },
});

export const validateAccountCredential = async (userId: string) => {
  const account = await prisma.account.findFirst({
    where: { userId, providerId: "credential" },
    select: { providerId: true },
  });

  if (!account) {
    throw new Error(AUTH_ERROR_MESSAGES.ACCOUNT_NOT_EXIST);
  }

  if (account.providerId !== "credential") {
    throw new Error(AUTH_ERROR_MESSAGES.PASSWORD_RESET_ERROR_MESSAGE);
  }
};
