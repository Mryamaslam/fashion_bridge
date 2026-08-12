"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { CURRENCIES } from "@/lib/constants/site";

type Currency = (typeof CURRENCIES)[number];

interface AppContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES[0]);

  const setCurrency = useCallback((c: Currency) => setCurrencyState(c), []);

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
