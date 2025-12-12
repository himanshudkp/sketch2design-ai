import type { Provider, ProviderConfig } from "@/lib/types";

export const SESSION_CONFIG = {
  expiresIn: 60 * 60 * 24 * 7,
  updateAge: 60 * 60 * 24,
} as const;

export const SMTP_CONFIG = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
} as const;

export const providerConfig: Record<Provider, ProviderConfig> = {
  google: {
    label: "Google",
    ariaLabel: "Sign in with Google",
  },
  github: {
    label: "GitHub",
    ariaLabel: "Sign in with GitHub",
  },
};
