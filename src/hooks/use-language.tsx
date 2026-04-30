import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LANGUAGES, t as translate, type LangCode } from "@/lib/i18n";

type Ctx = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: string) => string;
  speechCode: string;
};

const LanguageContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "kisan-mitra-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("hi");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved && LANGUAGES.some((l) => l.code === saved)) {
      setLangState(saved as LangCode);
    }
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l);
  };

  const speechCode = LANGUAGES.find((l) => l.code === lang)?.speech ?? "hi-IN";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: (k) => translate(lang, k), speechCode }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
