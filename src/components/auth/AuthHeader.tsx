import { ReactNode } from "react";

interface AuthHeaderProps {
  title: string;
  description: string | ReactNode;
  icon?: ReactNode;
  iconBgColor?: string;
}

export function AuthHeader({
  title,
  description,
  icon,
  iconBgColor = "bg-primary/10",
}: AuthHeaderProps) {
  return (
    <div className={`mb-6 ${icon ? "text-center" : ""}`}>
      {icon && (
        <div className="mb-6 flex justify-center">
          <div className={`rounded-full ${iconBgColor} p-4`}>{icon}</div>
        </div>
      )}
      <h1 className="mb-1.5 text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
