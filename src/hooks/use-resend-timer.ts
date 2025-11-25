import { useState, useEffect, useCallback } from "react";

export function useResendTimer(initialSeconds: number = 60) {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const startTimer = useCallback(() => {
    setCountdown(initialSeconds);
  }, [initialSeconds]);

  const canResend = countdown === 0;

  return { countdown, canResend, startTimer };
}
