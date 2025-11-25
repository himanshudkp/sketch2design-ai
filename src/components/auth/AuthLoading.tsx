import { Skeleton } from "@/components/ui/skeleton";

const AuthLoading = () => {
  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)] animate-pulse">
        <div className="p-8 pb-6">
          <div className="mb-6">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="h-10 w-full" />

            <div className="relative py-2">
              <Skeleton className="h-px w-full" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-[calc(var(--radius))] border-t p-4">
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default AuthLoading;
