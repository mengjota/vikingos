"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaManager() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {});
    }

    // Capture install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Show banner after 30s if user hasn't dismissed it
      const dismissed = sessionStorage.getItem("pwa-banner-dismissed");
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 30_000);
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setShowBanner(false);
    setInstallPrompt(null);
  }

  function dismiss() {
    setShowBanner(false);
    sessionStorage.setItem("pwa-banner-dismissed", "1");
  }

  if (!showBanner || !installPrompt) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 48px)",
        maxWidth: "460px",
        backgroundColor: "#0e0b07",
        border: "1px solid rgba(200,146,26,0.4)",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        zIndex: 1000,
        boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 20px rgba(200,146,26,0.1)",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: "1.4rem",
          fontWeight: 900,
          color: "#080604",
        }}
      >
        B
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "2px" }}>
          Instala BarberOS
        </p>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", color: "rgba(184,168,138,0.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          Acceso rápido desde tu pantalla de inicio
        </p>
      </div>
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button
          onClick={handleInstall}
          style={{
            background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)",
            color: "#080604",
            border: "none",
            padding: "8px 16px",
            fontFamily: "var(--font-barlow)",
            fontSize: "0.7rem",
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Instalar
        </button>
        <button
          onClick={dismiss}
          style={{
            background: "none",
            border: "1px solid rgba(92,58,30,0.4)",
            color: "rgba(184,168,138,0.4)",
            padding: "8px 10px",
            fontFamily: "var(--font-barlow)",
            fontSize: "0.75rem",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
