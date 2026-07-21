"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ChevronDown, Globe, DollarSign, Sun, Moon, ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE, NAV_LINKS, CURRENCIES, LANGUAGES } from "@/lib/constants/site";
import { Button } from "@/components/ui/button";
import { useApp } from "@/providers/app-provider";
import { useCart } from "@/providers/cart-provider";
import { useTheme } from "next-themes";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);
  const { currency, language, setCurrency, setLanguage } = useApp();
  const { itemCount } = useCart();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setLangOpen(false);
    setCurrOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled || !isHome
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-20">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-bold text-black text-sm">
            FB
          </div>
          <div className="hidden sm:block">
            <span className={cn("font-display text-lg font-bold", !scrolled && isHome && "text-white")}>
              Fashion Bridge
            </span>
            <span className={cn("block text-[10px] uppercase tracking-[0.3em]", !scrolled && isHome ? "text-gold" : "text-gold")}>
              International
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors hover:text-gold",
                pathname === link.href
                  ? "text-gold"
                  : !scrolled && isHome
                    ? "text-white/90"
                    : "text-foreground/80"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-x-2 -bottom-0.5 h-0.5 bg-gold"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setLangOpen(!langOpen); setCurrOpen(false); }}
                className={cn("gap-1", !scrolled && isHome && "text-white hover:text-gold hover:bg-white/10")}
              >
                <Globe className="h-4 w-4" />
                {language.code.toUpperCase()}
                <ChevronDown className={cn("h-3 w-3 transition-transform", langOpen && "rotate-180")} />
              </Button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-1 w-40 rounded-lg border bg-popover p-1 shadow-lg"
                  >
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang); setLangOpen(false); }}
                        className={cn(
                          "w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent transition-colors",
                          language.code === lang.code && "bg-accent font-medium"
                        )}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setCurrOpen(!currOpen); setLangOpen(false); }}
                className={cn("gap-1", !scrolled && isHome && "text-white hover:text-gold hover:bg-white/10")}
              >
                <DollarSign className="h-4 w-4" />
                {currency.code}
                <ChevronDown className={cn("h-3 w-3 transition-transform", currOpen && "rotate-180")} />
              </Button>
              <AnimatePresence>
                {currOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-1 w-44 rounded-lg border bg-popover p-1 shadow-lg"
                  >
                    {CURRENCIES.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => { setCurrency(curr); setCurrOpen(false); }}
                        className={cn(
                          "w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent transition-colors",
                          currency.code === curr.code && "bg-accent font-medium"
                        )}
                      >
                        {curr.symbol} {curr.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(!scrolled && isHome && "text-white hover:text-gold hover:bg-white/10")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}
          </div>

          <Button
            asChild
            variant="ghost"
            size="icon"
            className={cn("relative", !scrolled && isHome && "text-white hover:text-gold hover:bg-white/10")}
            aria-label="Shopping cart"
          >
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-black">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </Button>

          <Button asChild variant="gold" size="sm" className="hidden sm:inline-flex">
            <Link href="/cart">Cart</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn("lg:hidden", !scrolled && isHome && "text-white")}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t bg-background overflow-hidden"
          >
            <nav className="container mx-auto flex flex-col px-4 py-4">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block py-3 text-base font-medium border-b border-border/50 last:border-0",
                      pathname === link.href ? "text-gold" : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Button asChild variant="gold" className="mt-4">
                <Link href="/cart">View Cart{itemCount > 0 ? ` (${itemCount})` : ""}</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
