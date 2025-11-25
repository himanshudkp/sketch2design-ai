"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Mail, User } from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { FormField } from "@/components/auth/FormField";
import { PasswordField } from "@/components/auth/PasswordField";
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator";
import { ErrorAlert } from "@/components/auth/ErrorAlert";
import SocialSignInButtons from "@/components/auth/SocialSignInButtons";

export default function SignUpPage() {
  const { handleSignUp, isLoading, signUpForm } = useAuth();
  const [passwordFocused, setPasswordFocused] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = signUpForm;

  const password = watch("password");
  const showPasswordStrength = useMemo(
    () => passwordFocused || (password?.length ?? 0) > 0,
    [passwordFocused, password]
  );

  return (
    <AuthFormWrapper
      footer={
        <p className="text-accent-foreground text-center text-sm">
          Have an account?
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
        title="Create a Sketch2Design Account"
        description="Welcome! Create an account to get started"
      />

      <ErrorAlert message={errors.root?.message} />

      <form onSubmit={handleSubmit(handleSignUp)} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            id="firstname"
            label="First name"
            placeholder="John"
            autoComplete="given-name"
            error={errors.firstname?.message}
            disabled={isLoading}
            icon={<User className="h-4 w-4" />}
            {...register("firstname")}
          />

          <FormField
            id="lastname"
            label="Last name"
            placeholder="Doe"
            autoComplete="family-name"
            error={errors.lastname?.message}
            disabled={isLoading}
            icon={<User className="h-4 w-4" />}
            {...register("lastname")}
          />
        </div>

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

        <div className="space-y-2">
          <PasswordField
            id="password"
            label="Password"
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

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Creating account..." : "Continue"}
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
