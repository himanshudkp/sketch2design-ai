"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { FormField } from "@/components/auth/FormField";
import { ErrorAlert } from "@/components/auth/ErrorAlert";

export default function ForgotPasswordPage() {
  const { forgotPasswordForm, handleForgotPassword, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = forgotPasswordForm;

  return (
    <AuthFormWrapper
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
      <Link
        href="/sign-in"
        className={`inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 ${
          isLoading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to sign in
      </Link>

      <AuthHeader
        title="Reset Password"
        description="Enter your email address and we'll send you a link to reset your password"
      />

      <ErrorAlert message={errors.root?.message} />

      <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-5">
        <FormField
          id="email"
          label="Email"
          type="email"
          placeholder="john.doe@example.com"
          autoComplete="email"
          error={errors.email?.message}
          disabled={isLoading}
          icon={<Mail className="h-4 w-4" />}
          {...register("email")}
        />

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Sending link..." : "Send Reset Link"}
        </Button>
      </form>
    </AuthFormWrapper>
  );
}
