"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { FormField } from "@/components/auth/FormField";
import { PasswordField } from "@/components/auth/PasswordField";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import SocialSignInButtons from "@/components/auth/SocialSignInButtons";

export default function SignInPage() {
  const { signInForm, handleSignIn, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = signInForm;

  const password = watch("password");

  return (
    <AuthFormWrapper
      footer={
        <p className="text-accent-foreground text-center text-sm">
          Don't have an account?
          <Link
            href="/sign-up"
            className="px-2 font-medium text-primary hover:underline transition-colors"
          >
            Create account
          </Link>
        </p>
      }
    >
      <AuthHeader
        title="Sign In to Sketch2Design"
        description="Welcome back! Sign in to continue"
      />

      <ErrorAlert message={errors.root?.message} />

      <form onSubmit={handleSubmit(handleSignIn)} className="space-y-5">
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

        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          disabled={isLoading}
          value={password}
          showForgotPassword
          {...register("password")}
        />

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-dashed" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <SocialSignInButtons />
      </form>
    </AuthFormWrapper>
  );
}
