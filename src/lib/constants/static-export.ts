/** True when building/running the GitHub Pages static preview */
export const IS_STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export const DEMO_ADMIN_EMAIL = "admin@fashionbridge.com";
export const DEMO_ADMIN_PASSWORD = "admin123";
export const DEMO_AUTH_KEY = "demo_admin_auth";

export function isDemoAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEMO_AUTH_KEY) === "true";
}

export function setDemoAdminAuth(authenticated: boolean): void {
  localStorage.setItem(DEMO_AUTH_KEY, authenticated ? "true" : "false");
}

export function clearDemoAdminAuth(): void {
  localStorage.removeItem(DEMO_AUTH_KEY);
}
