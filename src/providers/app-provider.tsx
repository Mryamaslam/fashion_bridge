"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { CURRENCIES, LANGUAGES } from "@/lib/constants/site";

type Currency = (typeof CURRENCIES)[number];
type Language = (typeof LANGUAGES)[number];

interface AppContextValue {
  currency: Currency;
  language: Language;
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: Language) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES[0]);
  const [language, setLanguageState] = useState<Language>(LANGUAGES[0]);

  const setCurrency = useCallback((c: Currency) => setCurrencyState(c), []);
  const setLanguage = useCallback((l: Language) => setLanguageState(l), []);

  return (
    <AppContext.Provider value={{ currency, language, setCurrency, setLanguage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
