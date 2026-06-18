import type { Metadata } from "next";
import Link from "next/link";
import {
  Factory, Tag, Package, Ship, Palette, ArrowRight,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/motion";
import { SectionHeader } from "@/components/shared/section-header";
import { CTASection } from "@/components/shared/cta-section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EXPORT_SERVICES, SITE } from "@/lib/constants/site";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Factory, Tag, Package, Ship, Palette,
};

export const metadata: Metadata = {
  title: "Export Services",
  description: `OEM manufacturing, private label, wholesale supply, and international shipping from ${SITE.name}.`,
};

export default function ExportServicesPage() {
  return (
    <>
      <section className="bg-primary pt-28 pb-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Export Services</h1>
            <p className="mt-4 max-w-2xl text-white/70">
              Comprehensive B2B export solutions from manufacturing to global delivery.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Services"
            title="What We Offer"
            description="End-to-end export services tailored for international fashion buyers and brands."
          />
          <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {EXPORT_SERVICES.map((service) => {
              const Icon = iconMap[service.icon] || Package;
              return (
                <StaggerItem key={service.title}>
                  <Card className="group h-full border-border/50 transition-all hover:border-gold/50 hover:shadow-xl">
                    <CardContent className="p-8">
                      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-black">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl font-semibold group-hover:text-gold transition-colors">
                        {service.title}
                      </h3>
                      <p className="mt-3 text-muted-foreground leading-relaxed">{service.description}</p>
                      <Button asChild variant="link" className="mt-4 p-0 text-gold">
                        <Link href="/inquiry">
                          Learn More <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <FadeIn direction="left">
              <SectionHeader
                label="Process"
                title="How It Works"
                align="left"
                className="mb-8"
              />
              <ol className="space-y-6">
                {[
                  { step: "01", title: "Submit Inquiry", desc: "Tell us about your product requirements, quantities, and target market." },
                  { step: "02", title: "Receive Quote", desc: "Our export team provides detailed pricing, MOQ, and lead time estimates." },
                  { step: "03", title: "Sample Approval", desc: "Review and approve product samples before bulk production begins." },
                  { step: "04", title: "Production & QC", desc: "Manufacturing with quality control at every stage of production." },
                  { step: "05", title: "Global Delivery", desc: "Export-ready packaging and shipping to your destination worldwide." },
                ].map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <span className="font-display text-2xl font-bold text-gold">{item.step}</span>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </FadeIn>
            <FadeIn direction="right">
              <Card className="border-gold/20 bg-primary text-primary-foreground">
                <CardContent className="p-8">
                  <h3 className="font-display text-2xl font-bold">Ready to Export?</h3>
                  <p className="mt-4 text-primary-foreground/70 leading-relaxed">
                    Whether you need OEM manufacturing, private label products, or wholesale supply —
                    our team is ready to support your business growth globally.
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-primary-foreground/80">
                    <li>✓ Competitive factory-direct pricing</li>
                    <li>✓ Flexible MOQs starting from 50 units</li>
                    <li>✓ Custom branding and packaging</li>
                    <li>✓ Shipping to 80+ countries</li>
                    <li>✓ Dedicated account manager</li>
                  </ul>
                  <Button asChild variant="gold" size="lg" className="mt-8">
                    <Link href="/inquiry">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      <CTASection
        title="Start Your Export Journey"
        description="Contact our export specialists for a personalized quote and product catalog."
      />
    </>
  );
}
