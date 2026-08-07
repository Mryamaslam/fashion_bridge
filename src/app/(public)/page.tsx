import Link from "next/link";
import {
  ArrowRight, Award, Globe, Factory, Package, Ship,
  Tag, Settings, Headphones, DollarSign, Clock,
} from "lucide-react";
import { HeroSlideshow } from "@/components/animations/hero-slideshow";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/motion";
import { SectionHeader } from "@/components/shared/section-header";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { ProductCard } from "@/components/shared/product-card";
import { CollectionCard } from "@/components/shared/collection-card";
import { SafeImage } from "@/components/shared/safe-image";
import { TestimonialCarousel } from "@/components/shared/testimonial-carousel";
import { CTASection } from "@/components/shared/cta-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  STATS, CATEGORIES, WHY_CHOOSE_US, TESTIMONIALS, EXPORT_COUNTRIES, MANUFACTURING_STEPS,
} from "@/lib/constants/site";
import {
  getFeaturedProducts, getCollections, getCategoryName,
} from "@/lib/services/data";
import { IMAGES } from "@/lib/constants/images";
import { IS_STATIC_EXPORT } from "@/lib/constants/static-export";
import { FeaturedProductsSection } from "@/components/shared/featured-products-section";
import { HomeCollectionsSection } from "@/components/shared/collections-page-content";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award, Globe, Factory, Package, Ship, Tag, Settings, Headphones, DollarSign, Clock,
};

const heroSlides = IMAGES.hero;

export default async function HomePage() {
  const featuredProducts = IS_STATIC_EXPORT ? [] : await getFeaturedProducts(4);
  const collections = IS_STATIC_EXPORT ? [] : await getCollections();
  const featuredCollections = collections.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen min-h-[600px]">
        <HeroSlideshow slides={heroSlides} className="h-full">
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="container mx-auto px-4">
              <FadeIn delay={0.3}>
                <span className="mb-4 inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold backdrop-blur-sm">
                  International B2B Fashion Exporter
                </span>
              </FadeIn>
              <FadeIn delay={0.5}>
                <h1 className="font-display max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
                  Bridging Fashion to the{" "}
                  <span className="text-gradient-gold">World</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.7}>
                <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
                  Premium apparel and fashion products exported worldwide. T-Shirts, Polos, Hoodies,
                  Denim, Footwear &amp; Accessories for global retailers and brands.
                </p>
              </FadeIn>
              <FadeIn delay={0.9}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button asChild variant="gold" size="xl">
                    <Link href="/products">Explore Products <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <Button asChild variant="gold-outline" size="xl" className="border-white/30 text-white hover:bg-white hover:text-black">
                    <Link href="/inquiry">Request Quote</Link>
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>
        </HeroSlideshow>
      </section>

      {/* Stats */}
      <section className="border-b bg-secondary/50 py-16">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <StaggerItem key={stat.label} className="text-center">
                <p className="font-display text-4xl font-bold text-gold md:text-5xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Our Products"
            title="Featured Categories"
            description="Explore our comprehensive range of export-ready fashion products."
          />
          <StaggerContainer className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {CATEGORIES.map((cat) => {
              const image =
                IMAGES.categories[cat.slug as keyof typeof IMAGES.categories] ||
                IMAGES.placeholder;
              return (
                <StaggerItem key={cat.slug}>
                  <Link href={`/products?category=${cat.slug}`}>
                    <Card className="group relative overflow-hidden border-border/50 transition-all hover:border-gold/50 hover:shadow-lg">
                      <div className="relative aspect-square overflow-hidden bg-secondary/40">
                        <SafeImage
                          src={image}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <h3 className="font-display text-lg font-semibold text-white transition-colors group-hover:text-gold md:text-xl">
                            {cat.name}
                          </h3>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Products */}
      {IS_STATIC_EXPORT ? (
        <FeaturedProductsSection />
      ) : (
      <section className="bg-secondary/30 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <SectionHeader label="Catalog" title="Featured Products" description="Top wholesale products ready for export." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={getCategoryName(product.category_id ?? null)}
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="gold-outline" size="lg">
              <Link href="/products">View All Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
      )}

      {/* Manufacturing */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Capabilities"
            title="Manufacturing Excellence"
            description="From design to delivery — our end-to-end production process ensures quality at every step."
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MANUFACTURING_STEPS.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.1}>
                <Card className="relative overflow-hidden border-border/50">
                  <CardContent className="p-6">
                    <span className="font-display text-5xl font-bold text-gold/20">{String(step.step).padStart(2, "0")}</span>
                    <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-primary py-20 md:py-28 text-primary-foreground">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Why FBI"
            title="Why Choose Us"
            description="Trusted by retailers and brands across 80+ countries."
            dark
          />
          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {WHY_CHOOSE_US.map((item) => {
              const Icon = iconMap[item.icon] || Award;
              return (
                <StaggerItem key={item.title}>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-gold/30">
                    <Icon className="mb-4 h-8 w-8 text-gold" />
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-primary-foreground/70">{item.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Collections */}
      {IS_STATIC_EXPORT ? (
        <HomeCollectionsSection />
      ) : (
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <SectionHeader label="Collections" title="Seasonal Collections" description="Curated product lines for every season and style." />
          <div className="grid gap-6 md:grid-cols-3">
            {featuredCollections.map((col) => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Global Shipping */}
      <section className="border-y bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            label="Global Reach"
            title="Worldwide Shipping Coverage"
            description="We export to buyers in over 80 countries across all continents."
          />
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-3">
              {EXPORT_COUNTRIES.map((country) => (
                <Link
                  key={country}
                  href={`/inquiry?country=${encodeURIComponent(country)}`}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
                >
                  {country}
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <SectionHeader label="Testimonials" title="What Our Buyers Say" />
          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </div>
      </section>

      <CTASection
        title="Ready to Start Exporting?"
        description="Contact our export team today for wholesale pricing, samples, and custom manufacturing quotes."
        primaryLabel="Submit Buyer Inquiry"
        primaryHref="/inquiry"
        secondaryLabel="Contact Us"
        secondaryHref="/contact"
      />
    </>
  );
}
