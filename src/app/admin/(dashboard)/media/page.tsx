"use client";

import { useState, useRef } from "react";
import { Upload, Search, FolderOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SafeImage } from "@/components/shared/safe-image";
import { useMedia, useMediaMutations } from "@/hooks/use-data";

function formatSize(bytes: number) {
  return bytes > 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

export default function AdminMediaPage() {
  const { data: media, isLoading } = useMedia();
  const { upload, remove } = useMediaMutations();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = (media || []).filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.folder.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      await Promise.all(
        Array.from(files).map((file) => upload.mutateAsync({ file, folder: "uploads" }))
      );
      toast.success(`${files.length} file(s) uploaded`);
    } catch {
      toast.error("Upload failed");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove.mutateAsync(id);
      if (selected === id) setSelected(null);
      toast.success("File removed");
    } catch {
      toast.error("Failed to remove file");
    }
  };

  return (
    <>
      <AdminHeader title="Media Library" />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
            <Button
              variant="gold"
              size="sm"
              disabled={upload.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" /> {upload.isPending ? "Uploading..." : "Upload Images"}
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))
          ) : filtered.map((item) => (
            <Card
              key={item.id}
              className={`overflow-hidden transition-shadow cursor-pointer ${selected === item.id ? "ring-2 ring-gold" : "hover:shadow-md"}`}
              onClick={() => setSelected(selected === item.id ? null : item.id)}
            >
              <div className="relative aspect-square bg-muted flex items-center justify-center overflow-hidden">
                {item.url ? (
                  <SafeImage src={item.url} alt={item.name} fill className="object-cover" sizes="200px" />
                ) : (
                  <FolderOpen className="h-12 w-12 text-muted-foreground/30" />
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{item.folder} · {formatSize(item.size_bytes)}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    aria-label="Delete file"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {!isLoading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No media files found.</p>
        )}
      </div>
    </>
  );
}
