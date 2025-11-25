import { ReactNode } from "react";

interface AuthFormWrapperProps {
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: "sm" | "md";
  className?: string;
}

export function AuthFormWrapper({
  children,
  footer,
  maxWidth = "sm",
  className = "",
}: AuthFormWrapperProps) {
  const maxWidthClass = maxWidth === "sm" ? "max-w-sm" : "max-w-md";

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <div
        className={`bg-card m-auto h-fit w-full ${maxWidthClass} rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)] transition-all duration-300 hover:shadow-lg ${className}`}
      >
        <div className="p-8 pb-6">{children}</div>
        {footer && (
          <div className="bg-muted rounded-[calc(var(--radius))] border-t p-4">
            {footer}
          </div>
        )}
      </div>
    </section>
  );
}
