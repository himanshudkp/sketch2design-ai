import { AlertCircle } from "lucide-react";

interface ErrorAlertProps {
  message?: string;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <div className="mb-4 flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in-50 slide-in-from-top-2 duration-300">
      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
