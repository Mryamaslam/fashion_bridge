import { SITE } from "@/lib/constants/site";

export interface SiteSettings {
  companyName: string;
  email: string;
  phone: string;
  emailNotifications: boolean;
  whatsappNotifications: boolean;
  lowStockAlerts: boolean;
}

const STORAGE_KEY = "fbi_site_settings";

export const DEFAULT_SETTINGS: SiteSettings = {
  companyName: SITE.name,
  email: SITE.email,
  phone: SITE.phone,
  emailNotifications: true,
  whatsappNotifications: true,
  lowStockAlerts: true,
};

export function loadSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: SiteSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export const DEFAULT_MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007!5e0!3m2!1sen!2sus!4v1644951234567!5m2!1sen!2sus";
