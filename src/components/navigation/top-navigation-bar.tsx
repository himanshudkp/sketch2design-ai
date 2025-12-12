"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ReactNode, useEffect } from "react";
import { fetchUserProfile } from "@/store/slices/userProfileSlice";
import {
  CircleQuestionMark,
  Hash,
  LayoutTemplate,
  Loader2,
  TriangleAlert,
  User2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUserProject } from "@/hooks/use-user-project";

interface TabProps {
  label: string;
  href: string;
  icon: ReactNode;
}

const TopNavigationBar = () => {
  const params = useSearchParams();
  const pathname = usePathname();
  const projectId = params.get("project");
  const hasCanvas = pathname.includes("canvas");
  const hasStyleGuide = pathname.includes("style-guide");
  const {
    data: projectData,
    error: projectError,
    isLoading: isProjectLoading,
  } = useUserProject(projectId!);
  const dispatch = useAppDispatch();
  const {
    data: profileData,
    error: profileError,
    loading: isProfileLoading,
  } = useAppSelector((state) => state.userProfile);

  const TABS: TabProps[] = [
    {
      label: "Canvas",
      href: `/dashboard/${profileData?.name}/canvas?${projectId}`,
      icon: <Hash className="h-4 w-4" />,
    },
    {
      label: "Style Guide",
      href: `/dashboard/${profileData?.name}/style-guide?project/${projectId}`,
      icon: <LayoutTemplate className="h-4 w-4" />,
    },
  ];

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);

  if (isProfileLoading || isProjectLoading)
    return (
      <div className="flex h-screen justify-center items-center">
        <Loader2 className="text-black h-12 w-12" />
      </div>
    );

  if (profileError || projectError)
    return (
      <div className="flex h-screen justify-center items-center">
        <TriangleAlert className="text-red-700 h-12 w-12" />
      </div>
    );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 p-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-2">
        <Link
          href={`/dashboard`}
          className="w-8 h-8 rounded-full border-3 border-white bg-black flex items-center justify-center"
        >
          <div className="w-4 h-4 rounded-full bg-white" />
        </Link>
        {!hasCanvas ||
          (!hasStyleGuide && (
            <div className="lg:inline-block hidden rounded-full text-primary/60 border border-white[0.12] backdrop-blur-xl bg-white[0.08] px-4 py-2 text-sm saturate-150">
              Project / {projectData?.data?.title}
            </div>
          ))}
      </div>
      <div className="lg:flex hidden items-center justify-center gap-2">
        <div className="flex items-center gap-2 backdrop-blur-xl bg-white[0.08] border border-white[0.12] rounded-full p-2 saturate-150">
          {TABS.map((tab) => {
            const { label, href, icon } = tab;
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition duration-300",
                  `${pathname}?project=${projectId}` === href
                    ? "bg-white[0.12] text-white border border-white[0.16] backdrop-blur-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white[0.06] border border-transparent"
                )}
              >
                <span
                  className={
                    `${pathname}?project=${projectId}` === href
                      ? "opacity-100"
                      : "opacity-70 group-hover:opacity-90"
                  }
                >
                  {icon}
                </span>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-4 justify-center">
        <span className="text-sm text-white/50">TODO: credits</span>
        <Button
          variant={"secondary"}
          className="rounded-full h-12 w-12 flex items-center justify-center backdrop-blur-xl bg-white[0.08] border border-white[0.12] saturate-150 hover:bg-white[0.12]"
        >
          <CircleQuestionMark className="size-5 text-white" />
        </Button>
        <Avatar className="size-12 ml-2">
          <AvatarImage src={"/images/logo.png"} />
          <AvatarFallback>
            <User2 className="size-5 text-black" />
          </AvatarFallback>
        </Avatar>
        {/* {hasCanvas && <AutoSave />} */}
        {/* {!hasCanvas && !hasStyleGuide && <CreateProject />} */}
      </div>
    </div>
  );
};

export default TopNavigationBar;
