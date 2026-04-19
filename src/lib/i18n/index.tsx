"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { es } from "./es";
import { en } from "./en";
import { ca } from "./ca";

export type Lang = "es" | "en" | "ca";
export type Translations = typeof es;

const dicts: Record<Lang, Translations> = { es, en, ca };

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}>({ lang: "es", setLang: () => {}, t: es });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const saved = localStorage.getItem("barberos-lang") as Lang | null;
    if (saved === "es" || saved === "en" || saved === "ca") {
      setLangState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("barberos-lang", l);
    document.documentElement.lang = l;
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: dicts[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useT() {
  return useContext(LangContext);
}
