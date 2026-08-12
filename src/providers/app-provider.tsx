"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CURRENCIES } from "@/lib/constants/site";
import { detectCurrencyCode } from "@/lib/utils/geo-currency";

type Currency = (typeof CURRENCIES)[number];

interface AppContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const AppContext = createContext<AppContextValue | null>(null);
const STORAGE_KEY = "fbi-currency";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES[0]);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c.code);
    } catch {
      // localStorage unavailable — non-fatal
    }
  }, []);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage unavailable — non-fatal
    }

    if (saved) {
      const match = CURRENCIES.find((c) => c.code === saved);
      if (match) setCurrencyState(match);
      return;
    }

    // No stored preference yet — default currency by visitor location once.
    detectCurrencyCode().then((code) => {
      if (!code) return;
      const match = CURRENCIES.find((c) => c.code === code);
      if (match) setCurrencyState(match);
    });
  }, []);

  return (
    <AppContext.Provider value={{ currency, setCurrency }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
