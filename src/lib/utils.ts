import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Response } from "./types";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const extractNameFromEmail = (email: string): string => {
  return email
    .split("@")[0]
    .split(/[._-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

export const combinedSlug = (name: string, max = 80): string => {
  const existingName = name;
  if (!existingName) return "untitled";
  let s = existingName
    .normalize("NFKD".replace(/\p{M}+/gu, ""))
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
  if (!s) return (s = "untitled");
  if (s.length > max) return (s = s.slice(0, max));
  return s;
};

export const isSubscriptionActive = (
  status: string | null | undefined,
  currentPeriodEnd: number | null | undefined | bigint
): boolean => {
  if (!status || status.toLowerCase() !== "active") return false;
  return currentPeriodEnd == null || currentPeriodEnd > Date.now();
};

export function successResponse<T>(data: T, status = 200): Response<T> {
  return { status, data };
}
