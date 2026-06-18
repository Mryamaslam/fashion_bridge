"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Slide {
  image: string;
  title: string;
  subtitle?: string;
}

interface HeroSlideshowProps {
  slides: readonly Slide[];
  interval?: number;
  className?: string;
  overlay?: boolean;
  children?: React.ReactNode;
}

export function HeroSlideshow({
  slides,
  interval = 6000,
  className,
  overlay = true,
  children,
}: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval]);

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-black", className)}>
      {/* All slides stacked — crossfade, no blank gap between transitions */}
      {slides.map((slide, i) => (
        <motion.div
          key={slide.image}
          initial={false}
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="absolute inset-0"
          aria-hidden={i !== current}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            quality={85}
            className="object-cover"
            sizes="100vw"
          />
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
          )}
        </motion.div>
      ))}

      {children}

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === current ? "w-8 bg-gold" : "w-1.5 bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 text-white hover:bg-white/10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={next}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 text-white hover:bg-white/10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
