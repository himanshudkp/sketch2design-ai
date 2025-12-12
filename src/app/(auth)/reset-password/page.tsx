"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { PasswordField } from "@/components/auth/PasswordField";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import { ResetPasswordData } from "@/lib/types";

type TokenStatus = "checking" | "valid" | "invalid";

export default function ResetPasswordTokenPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { resetPasswordForm, handleResetPassword, isLoading } = useAuth();

  const [passwordFocused, setPasswordFocused] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>("checking");

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = resetPasswordForm;

  const password = watch("password");

  const showPasswordStrength = useMemo(
    () => passwordFocused || (password?.length ?? 0) > 0,
    [passwordFocused, password]
  );

  useEffect(() => {
    const checkToken = async () => {
      const tokenParam = (params.token as string) || searchParams.get("token");
      const errorParam = searchParams.get("error");

      if (errorParam === "INVALID_TOKEN") {
        setTokenStatus("invalid");
        resetPasswordForm.setError("root", {
          message: "This password reset link is invalid or has expired.",
        });
        toast.error("Invalid reset link", {
          position: "bottom-right",
          duration: 4000,
        });
        return;
      }

      if (!tokenParam) {
        setTokenStatus("invalid");
        return;
      }

      setToken(tokenParam);
      setTokenStatus("valid");
    };

    checkToken();
  }, [params.token, searchParams, resetPasswordForm]);

  const onSubmit = (data: ResetPasswordData) => {
    console.log("Form submitted with data:", data);
    if (!token) {
      resetPasswordForm.setError("root", {
        message:
          "Invalid reset token. Please request a new password reset link.",
      });
      toast.error("Invalid reset token", { position: "bottom-right" });
      return;
    }
    handleResetPassword(data, token);
  };

  if (tokenStatus === "checking") {
    return (
      <AuthFormWrapper>
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
          <h1 className="text-xl font-semibold mb-2">Verifying Link</h1>
          <p className="text-sm text-muted-foreground">
            Please wait while we verify your reset link...
          </p>
        </div>
      </AuthFormWrapper>
    );
  }

  if (tokenStatus === "invalid") {
    return (
      <AuthFormWrapper>
        <AuthHeader
          title="Invalid Reset Link"
          description="This password reset link is invalid or has expired. Please request a new one."
          icon={<AlertCircle className="w-12 h-12 text-destructive" />}
          iconBgColor="bg-destructive/10"
        />

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/forgot-password">Request New Link</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/sign-in">Back to Sign In</Link>
          </Button>
        </div>
      </AuthFormWrapper>
    );
  }

  return (
    <AuthFormWrapper
      className="animate-in fade-in-50 slide-in-from-top-4 duration-500"
      footer={
        <p className="text-accent-foreground text-center text-sm">
          Remember your password?
          <Link
            href="/sign-in"
            className={`px-2 font-medium text-primary hover:underline transition-colors ${
              isLoading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Sign in
          </Link>
        </p>
      }
    >
      <AuthHeader
        title="Create New Password"
        description="Enter your new password below"
        icon={
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
        }
        iconBgColor="bg-green-100 dark:bg-green-950"
      />

      <ErrorAlert message={errors.root?.message} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <PasswordField
            id="password"
            label="New Password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            error={errors.password?.message}
            disabled={isLoading}
            value={password}
            onFocus={() => setPasswordFocused(true)}
            {...register("password")}
          />

          <PasswordStrengthIndicator
            password={password || ""}
            show={showPasswordStrength}
          />
        </div>

        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          disabled={isLoading}
          value={watch("confirmPassword")}
          {...register("confirmPassword")}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={isLoading}
          onClick={() =>
            onSubmit({
              confirmPassword: getValues("confirmPassword"),
              password,
              token:
                (params.token as string) || searchParams.get("token") || "",
            })
          }
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Resetting password..." : "Reset Password"}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
