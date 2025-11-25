import { memo, useMemo } from "react";
import { Check, X } from "lucide-react";

interface PasswordCheckItem {
  label: string;
  check: (pwd: string) => boolean;
}

const PASSWORD_REQUIREMENTS: readonly PasswordCheckItem[] = [
  { label: "At least 8 characters", check: (pwd) => pwd.length >= 8 },
  { label: "Contains uppercase letter", check: (pwd) => /[A-Z]/.test(pwd) },
  { label: "Contains number", check: (pwd) => /[0-9]/.test(pwd) },
  {
    label: "Contains special character",
    check: (pwd) => /[!@#$%^&*]/.test(pwd),
  },
] as const;

const RequirementItem = memo<{
  requirement: PasswordCheckItem;
  password: string;
}>(({ requirement, password }) => {
  const isValid = requirement.check(password);

  return (
    <div className="flex items-center gap-2 text-xs transition-all">
      {isValid ? (
        <Check
          className="w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0"
          aria-hidden="true"
        />
      ) : (
        <X
          className="w-3.5 h-3.5 text-muted-foreground shrink-0"
          aria-hidden="true"
        />
      )}
      <span
        className={
          isValid
            ? "text-green-700 dark:text-green-400 font-medium"
            : "text-muted-foreground"
        }
      >
        {requirement.label}
      </span>
    </div>
  );
});
RequirementItem.displayName = "RequirementItem";

interface PasswordStrengthIndicatorProps {
  password: string;
  show: boolean;
}

export const PasswordStrengthIndicator = memo<PasswordStrengthIndicatorProps>(
  ({ password, show }) => {
    const allRequirementsMet = useMemo(
      () => PASSWORD_REQUIREMENTS.every((req) => req.check(password)),
      [password]
    );

    if (!show) return null;

    return (
      <div
        className="mt-3 p-3 rounded-md bg-muted/50 border space-y-2 animate-in fade-in-50 slide-in-from-top-2 duration-200"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium">Password requirements:</p>
          {allRequirementsMet && (
            <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              All met
            </span>
          )}
        </div>
        {PASSWORD_REQUIREMENTS.map((requirement, idx) => (
          <RequirementItem
            key={idx}
            requirement={requirement}
            password={password}
          />
        ))}
      </div>
    );
  }
);
