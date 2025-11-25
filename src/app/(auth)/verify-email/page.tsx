"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { verifyEmail } from "@/actions/auth";
import Link from "next/link";
import { AuthFormWrapper } from "@/components/auth/AuthFormWrapper";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { InfoBox } from "@/components/auth/InfoBox";

type VerificationStatus = "verifying" | "success" | "error" | "expired";

export default function VerifyEmailTokenPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleVerification = async () => {
      const token = (params.token as string) || searchParams.get("token");
      const error = searchParams.get("error");

      if (error === "INVALID_TOKEN") {
        setStatus("expired");
        setErrorMessage("This verification link is invalid or has expired.");
        toast.error("Verification link expired", { position: "bottom-right" });
        return;
      }

      if (!token) {
        setStatus("error");
        setErrorMessage("No verification token found.");
        return;
      }

      try {
        const result = await verifyEmail(token);

        if (!result.success) {
          if (result.errorCode === "TOKEN_EXPIRED") {
            setStatus("expired");
            setErrorMessage(result.error || "Verification link has expired.");
          } else {
            setStatus("error");
            setErrorMessage(result.error || "Verification failed.");
          }
          toast.error(result.error, { position: "bottom-right" });
          return;
        }

        setStatus("success");
        toast.success("Email verified successfully!", {
          position: "bottom-right",
          duration: 3000,
        });

        setTimeout(() => router.push("/dashboard"), 2000);
      } catch (error: any) {
        console.error("[verifyEmail] Error:", error);
        setStatus("error");
        setErrorMessage(error.message || "An unexpected error occurred.");
        toast.error("Verification failed", { position: "bottom-right" });
      }
    };

    handleVerification();
  }, [params.token, searchParams, router]);

  if (status === "verifying") {
    return (
      <AuthFormWrapper>
        <div className="text-center animate-in fade-in-50 duration-300">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-semibold">Verifying Your Email</h1>
          <p className="text-sm text-muted-foreground">
            Please wait while we verify your email address...
          </p>
        </div>
      </AuthFormWrapper>
    );
  }

  if (status === "success") {
    return (
      <AuthFormWrapper>
        <div className="text-center animate-in fade-in-50 slide-in-from-top-4 duration-500">
          <AuthHeader
            title="Email Verified!"
            description="Your email has been successfully verified. Redirecting you to the dashboard..."
            icon={
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            }
            iconBgColor="bg-green-100 dark:bg-green-950"
          />
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-6">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting...</span>
          </div>
        </div>
      </AuthFormWrapper>
    );
  }

  if (status === "error") {
    return (
      <AuthFormWrapper>
        <div className="animate-in fade-in-50 slide-in-from-top-4 duration-300">
          <AuthHeader
            title="Verification Failed"
            description={errorMessage}
            icon={<XCircle className="w-12 h-12 text-destructive" />}
            iconBgColor="bg-destructive/10"
          />

          <div className="space-y-3 mt-6">
            <Button asChild className="w-full">
              <Link href="/verify-email">Request New Verification Email</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/sign-in">Back to Sign In</Link>
            </Button>
          </div>
        </div>
      </AuthFormWrapper>
    );
  }

  return (
    <AuthFormWrapper>
      <div className="animate-in fade-in-50 slide-in-from-top-4 duration-300">
        <AuthHeader
          title="Link Expired"
          description={errorMessage}
          icon={
            <Mail className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
          }
          iconBgColor="bg-yellow-100 dark:bg-yellow-950"
        />

        <InfoBox variant="warning" title="What to do:">
          <ol className="mt-2 space-y-1 list-decimal list-inside">
            <li>Request a new verification email</li>
            <li>Check your inbox and spam folder</li>
            <li>Click the new verification link</li>
          </ol>
        </InfoBox>

        <div className="space-y-3 mt-6">
          <Button asChild className="w-full">
            <Link href="/verify-email">Request New Verification Email</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/sign-in">Back to Sign In</Link>
          </Button>
        </div>
      </div>
    </AuthFormWrapper>
  );
}
