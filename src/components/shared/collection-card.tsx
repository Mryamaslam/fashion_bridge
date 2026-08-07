"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScaleOnHover } from "@/components/animations/motion";
import { SafeImage } from "@/components/shared/safe-image";
import { getCollectionImage } from "@/lib/constants/images";
import type { Collection } from "@/types";

interface CollectionCardProps {
  collection: Collection;
  className?: string;
}

export function CollectionCard({ collection, className }: CollectionCardProps) {
  const image = getCollectionImage(collection, "thumb");

  return (
    <ScaleOnHover>
      <Link href={`/collections/${collection.slug}`}>
        <Card className={cn("group relative overflow-hidden border-0", className)}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <SafeImage
              src={image}
              alt={collection.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                {collection.is_featured && <Badge variant="gold">Featured</Badge>}
                {collection.season && (
                  <Badge variant="secondary" className="bg-white/10 text-white border-0">
                    {collection.season}
                  </Badge>
                )}
              </div>
              <h3 className="font-display text-xl font-bold text-white md:text-2xl">
                {collection.name}
              </h3>
              {collection.description && (
                <p className="mt-2 text-sm text-white/70 line-clamp-2">{collection.description}</p>
              )}
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold group-hover:gap-2 transition-all">
                View Collection <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </ScaleOnHover>
  );
}
