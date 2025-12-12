"use client";

import { getProjectById } from "@/actions/project";
import { useQuery } from "@tanstack/react-query";

export const useUserProject = (projectId: string) => {
  return useQuery({
    queryKey: ["user-project"],
    queryFn: () => getProjectById(projectId),
  });
};
