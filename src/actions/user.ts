"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  combinedSlug,
  extractNameFromEmail,
  isSubscriptionActive,
  successResponse,
} from "@/lib/utils";
import type { Entitlement, Response } from "@/lib/types";
import { headers } from "next/headers";
import { ERRORS } from "@/lib/constants";
import { User } from "../../generated/prisma/client";

export const authenticateUser = async (): Promise<
  Response<{ userId: string }>
> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId || !session) {
      return ERRORS.NOT_AUTHENTICATED;
    }

    return successResponse<{ userId: string }>({ userId });
  } catch (error) {
    console.error("[authenticateUser] Authentication error:", error);
    return ERRORS.SERVER_ERROR;
  }
};

export const getSubscriptionEntitlement = async (): Promise<
  Response<Entitlement>
> => {
  try {
    const { data } = await authenticateUser();

    const [user, subscription] = await Promise.all([
      prisma.user.findFirst({
        where: { id: data?.userId },
        select: { id: true, name: true, email: true },
      }),
      prisma.subscription.findFirst({
        where: { userId: data?.userId },
        select: { status: true, currentPeriodEnd: true },
      }),
    ]);

    if (!user) {
      return ERRORS.USER_NOT_FOUND;
    }

    const profileName =
      combinedSlug(user.name) || extractNameFromEmail(user.email);
    const entitlement = isSubscriptionActive(
      subscription?.status,
      subscription?.currentPeriodEnd
    );

    return successResponse<Entitlement>({ entitlement, profileName });
  } catch (error) {
    console.error(
      "[getSubscriptionEntitlement] Error fetching subscription entitlement:",
      error
    );
    return ERRORS.SERVER_ERROR;
  }
};

export const getUserProfile = async (): Promise<Response<User>> => {
  try {
    const { data } = await authenticateUser();

    const user = await prisma.user.findFirst({
      where: { id: data?.userId! },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return ERRORS.USER_NOT_FOUND;

    return successResponse<User>(user);
  } catch (err) {
    console.error("[getUserProfile] Error:", err);
    return ERRORS.SERVER_ERROR;
  }
};
