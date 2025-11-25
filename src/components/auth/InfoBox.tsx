import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface InfoBoxProps {
  title?: string;
  children: ReactNode;
  variant?: "info" | "warning" | "success" | "error";
  icon?: LucideIcon;
}

const variantStyles = {
  info: {
    container:
      "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900",
    text: "text-blue-800 dark:text-blue-200",
    icon: "text-blue-600 dark:text-blue-400",
  },
  warning: {
    container:
      "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900",
    text: "text-amber-800 dark:text-amber-200",
    icon: "text-amber-600 dark:text-amber-400",
  },
  success: {
    container:
      "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900",
    text: "text-green-800 dark:text-green-200",
    icon: "text-green-600 dark:text-green-400",
  },
  error: {
    container:
      "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900",
    text: "text-red-800 dark:text-red-200",
    icon: "text-red-600 dark:text-red-400",
  },
};

export function InfoBox({
  title,
  children,
  variant = "info",
  icon: Icon,
}: InfoBoxProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`rounded-md border p-3 ${styles.container} animate-in fade-in-50 slide-in-from-top-2 duration-300`}
    >
      <div className="flex items-start gap-2">
        {Icon && <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${styles.icon}`} />}
        <div className={`text-xs ${styles.text} flex-1`}>
          {title && <p className="font-medium mb-1">{title}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
