import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const DashboardLoading = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
          <Loader2
            className={cn(
              "h-8 w-8 animate-spin text-primary relative z-10",
              "transition-colors duration-200"
            )}
          />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            Loading Dashboard
          </p>
          <p className="text-xs text-muted-foreground">
            Preparing your workspace...
          </p>
        </div>

        <div className="w-32 h-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-[width_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default DashboardLoading;
