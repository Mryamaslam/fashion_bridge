"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/sidebar";
import { CollectionForm } from "@/components/admin/collection-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useAdminCollections, useCollectionMutations } from "@/hooks/use-data";
import type { Collection } from "@/types";
import type { CollectionFormData } from "@/lib/validations/schemas";

export default function AdminCollectionsPage() {
  const { data: collections, isLoading } = useAdminCollections();
  const { create, update, remove } = useCollectionMutations();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);

  const handleCreate = async (data: CollectionFormData) => {
    try {
      await create.mutateAsync(data);
      toast.success("Collection created");
      setDialogOpen(false);
    } catch {
      toast.error("Failed to create collection");
    }
  };

  const handleUpdate = async (data: CollectionFormData) => {
    if (!editing) return;
    try {
      await update.mutateAsync({ id: editing.id, ...data });
      toast.success("Collection updated");
      setEditing(null);
    } catch {
      toast.error("Failed to update collection");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this collection? This cannot be undone.")) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Collection deleted");
    } catch {
      toast.error("Failed to delete collection");
    }
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

        <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Collection</DialogTitle>
            </DialogHeader>
            {editing && <CollectionForm onSubmit={handleUpdate} initialData={editing} />}
          </DialogContent>
        </Dialog>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))
          ) : (collections || []).map((col) => (
            <div key={col.id} className="rounded-xl border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex gap-2 mb-3">
                  {col.is_featured && <Badge variant="gold">Featured</Badge>}
                  <Badge variant="outline">{col.status}</Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(col)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleDelete(col.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
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
          {!isLoading && !collections?.length && (
            <p className="col-span-full py-12 text-center text-muted-foreground">No collections yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
