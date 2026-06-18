import type { Metadata } from "next";
import Link from "next/link";
import { Award, Target, Eye, CheckCircle } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/motion";
import { SectionHeader } from "@/components/shared/section-header";
import { CTASection } from "@/components/shared/cta-section";
import { SafeImage } from "@/components/shared/safe-image";
import { Card, CardContent } from "@/components/ui/card";
import {
  CERTIFICATIONS, EXPORT_COUNTRIES, MANUFACTURING_STEPS, SITE,
} from "@/lib/constants/site";
import { IMAGES } from "@/lib/constants/images";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE.name} — our story, mission, manufacturing process, and global export capabilities.`,
};

export default function AboutPage() {
  return (
    <>
      <section className="relative flex h-[50vh] min-h-[400px] items-center bg-primary">
        <div className="absolute inset-0 hero-pattern opacity-20" />
        <div className="container relative mx-auto px-4 pt-20">
          <FadeIn>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">About Us</span>
            <h1 className="mt-4 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Our Story
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/70">
              {SITE.name} has been connecting global fashion buyers with premium manufacturing
              for over 15 years.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeIn direction="left">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <SafeImage
                  src={IMAGES.about.manufacturing}
                  alt="Fashion manufacturing"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <SectionHeader
                label="Company"
                title="Building Bridges in Fashion"
                description="Founded with a vision to make premium apparel accessible to retailers worldwide, Fashion Bridge International has grown into a trusted B2B export partner serving buyers across 80+ countries."
                align="left"
                className="mb-0"
              />
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Our state-of-the-art manufacturing facilities produce export-grade T-Shirts, Polo Shirts,
                Hoodies, Denim, Footwear, and Accessories. We combine traditional craftsmanship with
                modern production technology to deliver consistent quality at competitive wholesale prices.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <FadeIn>
              <Card className="h-full border-gold/20">
                <CardContent className="p-8">
                  <Target className="mb-4 h-10 w-10 text-gold" />
                  <h3 className="font-display text-2xl font-bold">Our Mission</h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    To empower global fashion retailers and brands with premium, export-ready apparel
                    through reliable manufacturing, competitive pricing, and exceptional B2B service.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Card className="h-full border-gold/20">
                <CardContent className="p-8">
                  <Eye className="mb-4 h-10 w-10 text-gold" />
                  <h3 className="font-display text-2xl font-bold">Our Vision</h3>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    To become the world&apos;s most trusted B2B fashion export partner, recognized for
                    quality, innovation, and sustainable manufacturing practices across all markets.
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeader label="Process" title="Manufacturing Process" description="Six stages of excellence from concept to global delivery." />
          <div className="relative">
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gold/30 md:block" />
            <div className="space-y-8">
              {MANUFACTURING_STEPS.map((step, i) => (
                <FadeIn key={step.step} delay={i * 0.1}>
                  <div className={`flex flex-col gap-4 md:flex-row ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                    <div className="flex-1" />
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold font-bold text-black mx-auto md:mx-0">
                      {step.step}
                    </div>
                    <Card className="flex-1 border-border/50">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <SectionHeader label="Quality" title="Certifications & Compliance" dark align="center" />
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CERTIFICATIONS.map((cert) => (
              <StaggerItem key={cert}>
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                  <Award className="h-6 w-6 shrink-0 text-gold" />
                  <span className="font-medium">{cert}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeIn>
              <SectionHeader label="Factory" title="Factory Overview" align="left" className="mb-0" />
              <ul className="mt-6 space-y-3">
                {[
                  "50,000 sq ft manufacturing facility",
                  "500+ skilled production workers",
                  "Monthly capacity: 100,000+ units",
                  "In-house quality control laboratory",
                  "Automated cutting and sewing lines",
                  "Sustainable and ethical production",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 shrink-0 text-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn direction="right">
              <div className="relative aspect-video overflow-hidden rounded-2xl">
                <SafeImage
                  src={IMAGES.about.factory}
                  alt="Factory floor"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="border-t bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <SectionHeader label="Global" title="Export Countries" description="Serving buyers across six continents." />
          <div className="flex flex-wrap justify-center gap-3">
            {EXPORT_COUNTRIES.map((country) => (
              <Link
                key={country}
                href={`/inquiry?country=${encodeURIComponent(country)}`}
                className="rounded-full border bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
              >
                {country}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Partner With Us" description="Join hundreds of global retailers who trust Fashion Bridge International." />
    </>
  );
}
