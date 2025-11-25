"use client";

import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Provider } from "@/types";
import { GitHub, Google } from "@/icons";
import { Loader2 } from "lucide-react";
import { providerConfig } from "@/lib/config";

interface SocialSignInButtonProps {
  provider: Provider;
  onSignIn: (provider: Provider) => void;
  isLoading?: boolean;
}

const iconMap = {
  google: Google,
  github: GitHub,
} as const;

const SocialSignInButton = memo<SocialSignInButtonProps>(
  ({ provider, onSignIn, isLoading = false }) => {
    const { label, ariaLabel } = providerConfig[provider];
    const Icon = iconMap[provider];

    const handleClick = useCallback(() => {
      onSignIn(provider);
    }, [provider, onSignIn]);

    return (
      <Button
        onClick={handleClick}
        type="button"
        variant="outline"
        aria-label={ariaLabel}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon />}

        <span>{label}</span>
      </Button>
    );
  }
);

export default SocialSignInButton;
