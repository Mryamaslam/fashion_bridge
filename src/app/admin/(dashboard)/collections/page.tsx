"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/sidebar";
import { CollectionForm } from "@/components/admin/collection-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { mockCollections } from "@/lib/data/mock";
import { slugify } from "@/lib/utils";
import type { Collection } from "@/types";
import type { CollectionFormData } from "@/lib/validations/schemas";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreate = async (data: CollectionFormData) => {
    const newCollection: Collection = {
      id: String(Date.now()),
      name: data.name,
      slug: slugify(data.name),
      description: data.description || null,
      banner_url: data.banner_url || null,
      thumbnail_url: data.thumbnail_url || null,
      is_featured: data.is_featured,
      is_seasonal: data.is_seasonal,
      season: data.season || null,
      status: data.status,
      sort_order: data.sort_order,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCollections((prev) => [newCollection, ...prev]);
    mockCollections.unshift(newCollection);
    toast.success("Collection created");
    setDialogOpen(false);
  };

  return (
    <>
      <AdminHeader title="Collection Management" />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Collection</DialogTitle>
              </DialogHeader>
              <CollectionForm onSubmit={handleCreate} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <div key={col.id} className="rounded-xl border p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-2 mb-3">
                {col.is_featured && <Badge variant="gold">Featured</Badge>}
                <Badge variant="outline">{col.status}</Badge>
              </div>
              <h3 className="font-semibold text-lg">{col.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{col.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">Season: {col.season}</p>
              {col.status === "active" && (
                <Button asChild variant="link" className="mt-3 h-auto p-0 text-gold">
                  <Link href={`/collections/${col.slug}`}>
                    View on site <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
