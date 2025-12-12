"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Provider } from "@/lib/types";
import SocialSignInButton from "./SocialSignInButton";
import { PROVIDERS } from "@/lib/constants";

const SocialSignInButtons = () => {
  const { handleSignInSocial } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = useCallback(
    async (provider: Provider) => {
      try {
        setIsLoading(true);
        console.log(provider);
        await handleSignInSocial(provider);
      } catch (error) {
        console.error("Sign in error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [handleSignInSocial]
  );

  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      {PROVIDERS.map((provider) => (
        <SocialSignInButton
          key={provider}
          provider={provider}
          onSignIn={handleSignIn}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default SocialSignInButtons;
