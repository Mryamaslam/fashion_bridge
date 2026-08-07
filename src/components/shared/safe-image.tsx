"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { IMAGES } from "@/lib/constants/images";
import { IS_STATIC_EXPORT } from "@/lib/constants/static-export";
import { resolveAssetPath } from "@/lib/utils/asset-path";

interface SafeImageProps extends Omit<ImageProps, "src" | "onError"> {
  src?: string | null;
  fallback?: string;
}

export function SafeImage({
  src,
  fallback = IMAGES.placeholder,
  alt,
  className,
  fill,
  priority,
  sizes,
  ...props
}: SafeImageProps) {
  const resolved = resolveAssetPath(src || fallback);
  const resolvedFallback = resolveAssetPath(fallback);
  const [imgSrc, setImgSrc] = useState(resolved);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(resolveAssetPath(src || fallback));
    setHasError(false);
  }, [src, fallback]);

  const currentSrc = hasError ? resolvedFallback : imgSrc;

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(resolvedFallback);
    }
  };

  const imageClassName = cn(
    className,
    fill && "absolute inset-0 h-full w-full",
    hasError && "object-contain p-8 bg-muted"
  );

  // GitHub Pages static export: native img avoids next/image basePath conflicts
  if (IS_STATIC_EXPORT) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={currentSrc}
        alt={alt ?? ""}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        sizes={sizes}
        className={imageClassName}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      {...props}
      fill={fill}
      priority={priority}
      sizes={sizes}
      src={currentSrc}
      alt={alt ?? ""}
      className={imageClassName}
      onError={handleError}
    />
  );
}
