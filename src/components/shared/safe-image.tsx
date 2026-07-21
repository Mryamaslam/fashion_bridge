"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { IMAGES } from "@/lib/constants/images";

interface SafeImageProps extends Omit<ImageProps, "src" | "onError"> {
  src?: string | null;
  fallback?: string;
}

export function SafeImage({
  src,
  fallback = IMAGES.placeholder,
  alt,
  className,
  ...props
}: SafeImageProps) {
  const resolved = src || fallback;
  const [imgSrc, setImgSrc] = useState(resolved);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src || fallback);
    setHasError(false);
  }, [src, fallback]);

  return (
    <Image
      {...props}
      src={hasError ? fallback : imgSrc}
      alt={alt}
      className={cn(className, hasError && "object-contain p-8 bg-muted")}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallback);
        }
      }}
    />
  );
}
