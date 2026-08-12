/** Maps a visitor's detected country to one of our supported currency codes. */
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  PK: "PKR",
  GB: "GBP",
  AE: "AED",
  // Eurozone
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", PT: "EUR",
  IE: "EUR", BE: "EUR", AT: "EUR", FI: "EUR", GR: "EUR",
};

/**
 * Best-effort IP based country lookup (free, no API key, CORS enabled).
 * Falls back silently to null on any network/parse failure so the caller
 * can keep the existing default currency.
 */
export async function detectCurrencyCode(): Promise<string | null> {
  try {
    const res = await fetch("https://ipwho.is/", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    const countryCode: string | undefined = data?.country_code;
    if (!countryCode) return null;
    return COUNTRY_CURRENCY_MAP[countryCode] ?? null;
  } catch {
    return null;
  }
}
