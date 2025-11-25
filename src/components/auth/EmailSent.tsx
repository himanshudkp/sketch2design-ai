import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { InfoBox } from "@/components/auth/InfoBox";
import { Button } from "@/components/ui/button";
import { useResendTimer } from "@/hooks/use-resend-timer";
import { Mail, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

interface EmailSentProps {
  email: string;
  type: "password-reset" | "verification";
  onResend?: () => Promise<void>;
  isResending?: boolean;
}

const content = {
  "password-reset": {
    title: "Password Reset Email Sent",
    description: "We've sent a password reset link to:",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    steps: [
      "Check your email inbox",
      "Click the 'Reset Password' link",
      "Enter your new password",
      "Sign in with your new password",
    ],
    expiry: "Link expires in 1 hour",
    expiryNote:
      "If you don't reset your password within an hour, the link will expire and you'll need to request a new one.",
  },
  verification: {
    title: "Verify Your Email",
    description: "We've sent a verification link to:",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    steps: [
      "Check your email inbox",
      "Click the verification link",
      "You'll be redirected to complete your signup",
    ],
    expiry: null,
    expiryNote: null,
  },
};

export function EmailSent({
  email,
  type,
  onResend,
  isResending = false,
}: EmailSentProps) {
  const { countdown, canResend, startTimer } = useResendTimer(60);
  const config = content[type];

  const handleResend = async () => {
    if (onResend && canResend) {
      await onResend();
      startTimer();
    }
  };

  return (
    <AuthFormWrapper
      footer={
        <p className="text-accent-foreground text-center text-sm">
          {type === "verification"
            ? "Already have an account?"
            : "Remember your password?"}

          <Link
            href="/sign-in"
            className="px-2 font-medium text-primary hover:underline transition-colors"
          >
            Sign In
          </Link>
        </p>
      }
    >
      <AuthHeader
        title={config.title}
        description={
          <>
            {config.description}
            <span className="block mt-2 font-medium text-foreground">
              {email}
            </span>
          </>
        }
        icon={<Mail className={`h-8 w-8 ${config.iconColor}`} />}
        iconBgColor={config.iconBg}
      />

      <InfoBox variant={type === "password-reset" ? "success" : "info"}>
        <p className="font-medium mb-2">
          {type === "password-reset"
            ? "What happens next:"
            : "To complete your registration:"}
        </p>
        <ol className="list-inside list-decimal space-y-2">
          {config.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </InfoBox>

      {config.expiry && config.expiryNote && (
        <InfoBox variant="warning" icon={Clock} title={config.expiry}>
          <p className="mt-1">{config.expiryNote}</p>
        </InfoBox>
      )}

      <div className="space-y-2 text-xs text-muted-foreground">
        <p>💡 Didn't receive the email?</p>
        <ul className="list-inside list-disc space-y-1">
          <li>Check your spam or junk folder</li>
          <li>Make sure you entered the correct email</li>
          <li>
            Try resending the{" "}
            {type === "password-reset" ? "password reset" : "verification"}{" "}
            email
          </li>
        </ul>
      </div>

      <div className="space-y-3 mt-6">
        {onResend && (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={isResending || !canResend}
          >
            {isResending
              ? "Sending..."
              : !canResend
              ? `Resend in ${countdown}s`
              : `Resend ${
                  type === "password-reset" ? "Password Reset" : "Verification"
                } Email`}
          </Button>
        )}

        <Button asChild variant="outline" className="w-full">
          <Link href="/sign-in">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Link>
        </Button>
      </div>
    </AuthFormWrapper>
  );
}
