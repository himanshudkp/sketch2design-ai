import { forwardRef, ReactNode, InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface FormFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "icon"> {
  id: string;
  label: string;
  error?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      id,
      label,
      type = "text",
      placeholder,
      autoComplete,
      error,
      icon,
      rightIcon,
      disabled,
      required,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="block text-sm font-medium">
          {label}
        </Label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <Input
            ref={ref}
            type={type}
            id={id}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            required={required}
            className={`transition-all ${icon ? "pl-10" : ""} ${
              rightIcon ? "pr-10" : ""
            } ${
              error ? "border-destructive focus-visible:ring-destructive" : ""
            } ${className || ""}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-destructive animate-in fade-in-50 duration-200">
            <AlertCircle className="h-3 w-3 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  }
);
