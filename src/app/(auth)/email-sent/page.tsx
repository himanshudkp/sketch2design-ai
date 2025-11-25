"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { requestPasswordReset, sendVerificationEmail } from "@/actions/auth";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { EmailSent } from "@/components/auth/EmailSent";

export default function EmailSentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const type = searchParams.get("type") as
    | "password-reset"
    | "verification"
    | null;
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (
      !email ||
      !type ||
      (type !== "password-reset" && type !== "verification")
    ) {
      router.push("/sign-in");
    }
  }, [email, type, router]);

  if (!email || !type) {
    return null;
  }

  const handleResend = async () => {
    setIsResending(true);
    try {
      const result =
        type === "password-reset"
          ? await requestPasswordReset(email)
          : await sendVerificationEmail(email);

      if (result.success) {
        const message =
          type === "password-reset"
            ? "Password reset email sent!"
            : "Verification email sent!";
        toast.success(message, {
          position: "bottom-right",
        });
      } else {
        toast.error(result.error || "Failed to send email", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "bottom-right",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <EmailSent
      email={email}
      type={type}
      onResend={handleResend}
      isResending={isResending}
    />
  );
}
