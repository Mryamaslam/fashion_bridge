import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { SITE, NAV_LINKS, CATEGORIES } from "@/lib/constants/site";
import { getWhatsAppLink } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-bold text-black">
                FB
              </div>
              <div>
                <span className="font-display text-lg font-bold">Fashion Bridge</span>
                <span className="block text-[10px] uppercase tracking-[0.3em] text-gold">International</span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Premium B2B apparel and fashion products exporter serving buyers in 80+ countries worldwide.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-gold">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/inquiry" className="text-sm text-primary-foreground/70 hover:text-gold transition-colors">
                  Buyer Inquiry
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-gold">Product Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-gold">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-primary-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
                {SITE.address}
              </li>
              <li>
                <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-gold transition-colors">
                  <Phone className="h-4 w-4 text-gold" />
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-gold transition-colors">
                  <Mail className="h-4 w-4 text-gold" />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={getWhatsAppLink(SITE.whatsapp, "Hello Fashion Bridge International")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-gold" />
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 md:flex-row">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/50">
            <Link href="/admin/login" className="hover:text-gold transition-colors">Admin</Link>
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
