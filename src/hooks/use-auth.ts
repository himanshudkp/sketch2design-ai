"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import type {
  ForgotPasswordData,
  ResetPasswordData,
  SignInData,
  SignUpData,
} from "@/lib/types";

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/schema";

import {
  signIn,
  signUp,
  signInSocial,
  signOut,
  sendVerificationEmail as sendVerificationEmailAction,
  requestPasswordReset as requestPasswordResetAction,
  resetPassword as resetPasswordAction,
} from "@/actions/auth";

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loading = isLoading || isPending;

  const signInForm = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  });

  const signUpForm = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  });

  const forgotPasswordForm = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const resetPasswordForm = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleSignIn = async ({ email, password }: SignInData) => {
    setIsLoading(true);
    const loadingToast = toast.loading("Signing in...");

    try {
      const result = await signIn(email, password);

      toast.dismiss(loadingToast);

      if (!result.success) {
        signInForm.setError("root", { message: result.error });

        if (result.errorCode === "EMAIL_NOT_VERIFIED") {
          toast.error(result.error, {
            duration: 6000,
            action: {
              label: "Resend Email",
              onClick: async () => {
                const resendToast = toast.loading("Sending email...");
                const resend = await sendVerificationEmailAction(email);
                toast.dismiss(resendToast);

                resend.success
                  ? toast.success(resend.message)
                  : toast.error(resend.error);
              },
            },
          });
        } else {
          toast.error(result.error);
        }
        return;
      }

      toast.success("Welcome back!");

      startTransition(() => {
        router.push("/dashboard");
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const message = error?.message ?? "Unexpected error";
      signInForm.setError("root", { message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async ({
    email,
    password,
    firstname,
    lastname,
  }: SignUpData) => {
    setIsLoading(true);

    try {
      const result = await signUp(email, password, firstname, lastname);

      if (!result.success) {
        signUpForm.setError("root", { message: result.error });
        toast.error(result.error);
        return;
      }

      toast.success(result.message, { duration: 5000 });

      startTransition(() => {
        router.push(
          `/email-sent?email=${encodeURIComponent(email)}&type=verification`
        );
      });
    } catch (error: any) {
      const message = error?.message ?? "Unexpected error";
      signUpForm.setError("root", { message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInSocial = async (provider: "google" | "github") => {
    setIsLoading(true);
    const loadingToast = toast.loading(
      `Connecting to ${provider === "google" ? "Google" : "GitHub"}...`
    );

    try {
      const result = await signInSocial(provider);

      toast.dismiss(loadingToast);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      if (result.data?.url) {
        toast.success("Redirecting...");
        window.location.href = result.data.url;
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error?.message ?? "Social login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    const loadingToast = toast.loading("Signing out...");

    try {
      await signOut();
      toast.dismiss(loadingToast);
      toast.success("Signed out");
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Failed to sign out");
    }
  };

  const handleForgotPassword = async ({ email }: ForgotPasswordData) => {
    setIsLoading(true);
    const loadingToast = toast.loading("Sending reset link...");

    try {
      const result = await requestPasswordResetAction(email);

      toast.dismiss(loadingToast);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      localStorage.setItem("resetPasswordEmail", email);

      startTransition(() => {
        router.push(
          `/email-sent?email=${encodeURIComponent(email)}&type=password-reset`
        );
      });
    } catch {
      toast.dismiss(loadingToast);
      toast.error("Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (
    { password }: ResetPasswordData,
    token: string
  ) => {
    setIsLoading(true);
    const loadingToast = toast.loading("Resetting password...");

    try {
      const result = await resetPasswordAction(password, token);

      toast.dismiss(loadingToast);

      if (!result.success) {
        resetPasswordForm.setError("root", { message: result.error });
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      localStorage.removeItem("resetPasswordEmail");

      startTransition(() => {
        router.push("/sign-in");
      });
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const message = error?.message ?? "Unexpected error";
      resetPasswordForm.setError("root", { message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInForm,
    signUpForm,
    forgotPasswordForm,
    resetPasswordForm,

    handleSignIn,
    handleSignUp,
    handleSignInSocial,
    handleSignOut,
    handleForgotPassword,
    handleResetPassword,

    isLoading: loading,
  };
};
