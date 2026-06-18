import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

export function CTASection({
  title,
  description,
  primaryLabel = "Get Started",
  primaryHref = "/inquiry",
  secondaryLabel,
  secondaryHref,
  className,
}: CTASectionProps) {
  return (
    <section className={cn("relative overflow-hidden bg-primary py-20 md:py-28", className)}>
      <div className="absolute inset-0 hero-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10" />
      <div className="container relative mx-auto px-4 text-center">
        <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/70">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button asChild variant="gold" size="lg">
            <Link href={primaryHref}>{primaryLabel}</Link>
          </Button>
          {secondaryLabel && secondaryHref && (
            <Button asChild variant="gold-outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
