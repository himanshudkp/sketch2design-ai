"use server";

import type { Projects } from "../../generated/prisma/client";
import { authenticateUser } from "./user";
import { prisma } from "@/lib/prisma";
import { ERRORS } from "@/lib/constants";
import { successResponse } from "@/lib/utils";
import type { Response } from "@/lib/types";

export const getProjectById = async (
  projectId: string
): Promise<Response<Projects>> => {
  try {
    if (!projectId) return ERRORS.PROJECT_ID_NOT_FOUND;

    const { data: { userId } = {} } = await authenticateUser();

    const project = await prisma.projects.findFirst({
      where: { id: projectId },
    });

    if (!project) return ERRORS.PROJECT_NOT_FOUND;

    const { userId: ownerId, isPublic } = project as Projects;

    if (ownerId !== userId || !isPublic) ERRORS.ACCESS_DENIED;

    return successResponse(project);
  } catch (error) {
    console.error("[getProjectById] Error fetching project:", error);
    return ERRORS.SERVER_ERROR;
  }
};
