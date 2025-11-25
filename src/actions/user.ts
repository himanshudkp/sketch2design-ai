import { AUTH_ERROR_MESSAGES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export const validateCredentialAccount = async (userId: string) => {
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
