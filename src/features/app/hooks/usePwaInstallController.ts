"use client";

import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Quản lý vòng đời lời mời cài đặt PWA do trình duyệt cung cấp. */
export function usePwaInstallController() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", capturePrompt);
    return () => window.removeEventListener("beforeinstallprompt", capturePrompt);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const dismiss = useCallback(() => setDeferredPrompt(null), []);

  return {
    showInstallPrompt: deferredPrompt !== null,
    install,
    dismiss,
  };
}
