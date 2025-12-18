"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { User } from "../../generated/prisma/client";
import { toast } from "sonner";
import { createProjectsStart } from "@/store/slices/projects-slice";
import { generateGradientThumbnail } from "@/lib/utils";

export const useProject = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.profile) as User;
  const projects = useAppSelector((state) => state.projects);

  const createProject = async () => {
    if (!user.id) {
      toast.error("Please sign in to create projects.");
      return;
    }

    dispatch(createProjectsStart());

    try {
      const thumbnail = generateGradientThumbnail();
    } catch (error) {}
  };
  return {
    canCreate: !!user?.id,
    isCreating: projects.isCreating!,
    totalProjects: projects.total,
    projects: projects.projects,
    createProject: createProject,
  };
};
