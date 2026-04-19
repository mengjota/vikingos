"use client";

import { useT, type Lang } from "@/lib/i18n";

const LANGS: { code: Lang; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "ca", label: "CA" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useT();

  return (
    <div className="flex items-center gap-1" style={{ fontFamily: "var(--font-barlow)" }}>
      {LANGS.map((l, i) => (
        <span key={l.code} className="flex items-center gap-1">
          <button
            onClick={() => setLang(l.code)}
            className="text-[10px] tracking-[0.2em] uppercase transition-colors duration-200"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: lang === l.code ? "#c8921a" : "rgba(184,168,138,0.4)",
              fontFamily: "var(--font-barlow)",
              fontWeight: lang === l.code ? 700 : 400,
              padding: "2px 0",
            }}
          >
            {l.label}
          </button>
          {i < LANGS.length - 1 && (
            <span style={{ color: "rgba(92,58,30,0.5)", fontSize: "10px" }}>·</span>
          )}
        </span>
      ))}
    </div>
  );
}
