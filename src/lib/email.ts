import type { EmailParams, SendEmail } from "@/types";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { EmailConfigurationError, EmailSendError } from "./error";
import { SMTP_CONFIG } from "./config";
import {
  APP_NAME,
  EMAIL_ERROR_MESSAGES,
  EMAIL_SENDER,
  MAX_RETRIES,
  PASSWORD_RESET_SUCCESS_SUBJECT,
  RESET_PASSWORD_SUBJECT,
  RETRY_DELAY,
  VERIFY_EMAIL_SUCCESS_SUBJECT,
} from "./constants";

let transporter: Transporter | null = null;

const validateSMTPConfig = (): void => {
  const requiredEnvVars = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new EmailConfigurationError(
      EMAIL_ERROR_MESSAGES.MISSING_SMTP_VARS(missingVars)
    );
  }

  const port = Number(process.env.SMTP_PORT);
  if (process.env.SMTP_PORT && (isNaN(port) || port <= 0 || port > 65535)) {
    throw new EmailConfigurationError(EMAIL_ERROR_MESSAGES.INVALID_SMTP_PORT);
  }
};

const getTransporter = (): Transporter => {
  if (!transporter) {
    try {
      validateSMTPConfig();
      transporter = nodemailer.createTransport(SMTP_CONFIG);
    } catch (error) {
      if (error instanceof EmailConfigurationError) {
        throw error;
      }
      throw new EmailConfigurationError(
        EMAIL_ERROR_MESSAGES.FAILED_CREATE_TRANSPORTER(
          error instanceof Error ? error.message : "Unknown error"
        )
      );
    }
  }
  return transporter;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sanitizeHtml = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const createEmailWrapper = (content: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    ${content}
  </div>
</body>
</html>
`;

const createButton = (url: string, text: string, color: string): string => {
  try {
    new URL(url);
  } catch {
    console.error(EMAIL_ERROR_MESSAGES.INVALID_BUTTON_URL(url));
    return `<p style="color: #dc2626;">Invalid reset link. Please contact support.</p>`;
  }

  return `
<a href="${sanitizeHtml(url)}"
   style="display: inline-block; padding: 12px 24px; background: ${color}; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 16px 0;">
  ${sanitizeHtml(text)}
</a>
`;
};

const createLinkFallback = (url: string): string => `
<p style="margin-top: 16px; font-size: 14px; color: #666;">
  Or copy and paste this link into your browser:
</p>
<p style="word-break: break-all; color: #666; font-size: 14px; background: #f3f4f6; padding: 12px; border-radius: 4px;">
  ${sanitizeHtml(url)}
</p>
`;

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const sendEmail = async (
  { email, subject, html }: EmailParams,
  retries = MAX_RETRIES
): Promise<void> => {
  if (!email || !isValidEmail(email)) {
    throw new EmailSendError(EMAIL_ERROR_MESSAGES.INVALID_EMAIL(email));
  }

  if (!subject || subject.trim().length === 0) {
    throw new EmailSendError(EMAIL_ERROR_MESSAGES.EMPTY_SUBJECT);
  }

  if (!html || html.trim().length === 0) {
    throw new EmailSendError(EMAIL_ERROR_MESSAGES.EMPTY_CONTENT);
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const transporter = getTransporter();

      const info = await transporter.sendMail({
        from: EMAIL_SENDER,
        to: email,
        subject,
        html,
      });

      console.log(
        EMAIL_ERROR_MESSAGES.EMAIL_SEND_SUCCESS(email, info.messageId)
      );

      return;
    } catch (error) {
      lastError = error;

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error(
        EMAIL_ERROR_MESSAGES.EMAIL_SEND_ATTEMPT_FAILED(
          attempt,
          retries,
          email,
          errorMessage
        )
      );

      if (
        error instanceof EmailConfigurationError ||
        errorMessage.includes("Invalid login") ||
        errorMessage.includes("Authentication failed")
      ) {
        throw new EmailSendError(
          EMAIL_ERROR_MESSAGES.EMAIL_CONFIGURATION_ERROR(errorMessage),
          error
        );
      }

      if (attempt < retries) {
        const delayMs = RETRY_DELAY * Math.pow(2, attempt - 1);
        console.log(EMAIL_ERROR_MESSAGES.EMAIL_RETRY_DELAY(delayMs));
        await delay(delayMs);
      }
    }
  }

  throw new EmailSendError(
    EMAIL_ERROR_MESSAGES.EMAIL_SEND_FINAL_FAILURE(email, retries),
    lastError
  );
};

const buildPasswordResetEmail = (name: string, url: string): string => {
  const safeName = sanitizeHtml(name || "there");

  const content = `
    <h2 style="color: #111827; margin-bottom: 16px;">Password Reset Request</h2>
    <p style="color: #374151; line-height: 1.6;">Hello ${safeName},</p>
    <p style="color: #374151; line-height: 1.6;">
      You requested a password reset for your ${APP_NAME} account.
    </p>
    <p style="color: #374151; line-height: 1.6;">
      Click the button below to reset your password:
    </p>
    ${createButton(url, "Reset Password", "#2563eb")}
    ${createLinkFallback(url)}
    <p style="color: #6b7280; margin-top: 24px; font-size: 14px;">
      If you did not request this, you can safely ignore this email. Your password will remain unchanged.
    </p>
    <p style="color: #6b7280; margin-top: 16px; font-size: 14px;">
      This link will expire in 1 hour for security reasons.
    </p>
    <p style="color: #111827; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
      — ${APP_NAME} Team
    </p>
  `;

  return createEmailWrapper(content);
};

const buildVerificationEmail = (name: string, url: string): string => {
  const safeName = sanitizeHtml(name || "there");

  const content = `
    <h2 style="color: #111827; margin-bottom: 16px;">Verify Your Email Address</h2>
    <p style="color: #374151; line-height: 1.6;">Hello ${safeName},</p>
    <p style="color: #374151; line-height: 1.6;">
      Welcome to ${APP_NAME}! Please confirm your email address by clicking below:
    </p>
    ${createButton(url, "Verify Email", "#10b981")}
    ${createLinkFallback(url)}
    <p style="color: #6b7280; margin-top: 24px; font-size: 14px;">
      If you did not create this account, you can safely ignore this email.
    </p>
    <p style="color: #111827; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
      — ${APP_NAME} Team
    </p>
  `;

  return createEmailWrapper(content);
};

const buildPasswordResetSuccessEmail = (name: string): string => {
  const safeName = sanitizeHtml(name || "there");

  const content = `
    <h2 style="color: #111827; margin-bottom: 16px;">Password Reset Successful</h2>
    <p style="color: #374151; line-height: 1.6;">Hello ${safeName},</p>
    <p style="color: #374151; line-height: 1.6;">
      Your password for <strong>${APP_NAME}</strong> has been successfully updated.
    </p>
    <p style="color: #374151; line-height: 1.6;">
      If you made this change, no further action is needed.
    </p>
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
      <p style="margin: 0; color: #92400e; font-size: 14px;">
        <strong>Security Notice:</strong> If you did <strong>not</strong> reset your password, 
        please secure your account immediately by resetting your password again or contacting our support team.
      </p>
    </div>
    <p style="color: #111827; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
      — ${APP_NAME} Team
    </p>
  `;

  return createEmailWrapper(content);
};

export const sendPasswordResetEmail = async ({
  email,
  url,
  name,
}: SendEmail): Promise<void> => {
  try {
    const html = buildPasswordResetEmail(name!, url!);

    await sendEmail({
      email,
      subject: RESET_PASSWORD_SUBJECT,
      html,
    });
  } catch (error) {
    console.error(
      EMAIL_ERROR_MESSAGES.FAILED_PASSWORD_RESET_EMAIL(email),
      error
    );
    throw error;
  }
};

export const sendVerificationEmail = async ({
  email,
  url,
  name,
}: SendEmail): Promise<void> => {
  try {
    const html = buildVerificationEmail(name!, url!);

    await sendEmail({
      email,
      subject: VERIFY_EMAIL_SUCCESS_SUBJECT,
      html,
    });
  } catch (error) {
    console.error(EMAIL_ERROR_MESSAGES.FAILED_VERIFICATION_EMAIL(email), error);
    throw error;
  }
};

export const sendPasswordResetSuccessEmail = async ({
  email,
  name,
}: SendEmail): Promise<void> => {
  try {
    const html = buildPasswordResetSuccessEmail(name!);

    await sendEmail({
      email,
      subject: PASSWORD_RESET_SUCCESS_SUBJECT,
      html,
    });
  } catch (error) {
    console.error(
      EMAIL_ERROR_MESSAGES.FAILED_PASSWORD_RESET_SUCCESS_EMAIL(email),
      error
    );
    throw error;
  }
};
