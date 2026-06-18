import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/animations/motion";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  dark?: boolean;
}

export function SectionHeader({
  label,
  title,
  description,
  align = "center",
  className,
  dark = false,
}: SectionHeaderProps) {
  return (
    <FadeIn className={cn("mb-12 md:mb-16", align === "center" && "text-center", className)}>
      {label && (
        <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-gold">
          {label}
        </span>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl",
          dark ? "text-white" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-lg leading-relaxed",
            align === "center" && "mx-auto",
            dark ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      )}
      <div className={cn("mt-6 h-1 w-16 bg-gold", align === "center" && "mx-auto")} />
    </FadeIn>
  );
}
