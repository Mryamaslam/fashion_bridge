"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { collectionSchema, type CollectionFormData } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Collection } from "@/types";

interface CollectionFormProps {
  onSubmit: (data: CollectionFormData) => Promise<void>;
  initialData?: Collection;
}

export function CollectionForm({ onSubmit, initialData }: CollectionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CollectionFormData>({
    resolver: zodResolver(collectionSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || "",
          banner_url: initialData.banner_url || "",
          thumbnail_url: initialData.thumbnail_url || "",
          season: initialData.season || "",
          is_featured: initialData.is_featured,
          is_seasonal: initialData.is_seasonal,
          status: initialData.status,
          sort_order: initialData.sort_order,
        }
      : {
          is_featured: false,
          is_seasonal: false,
          status: "draft",
          sort_order: 0,
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Collection Name *</Label>
        <Input {...register("name")} placeholder="Summer Collection 2024" />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea {...register("description")} rows={3} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Season</Label>
          <Input {...register("season")} placeholder="Summer, Winter, All Season" />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select defaultValue={initialData?.status || "draft"} onValueChange={(v) => setValue("status", v as CollectionFormData["status"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Banner Image URL</Label>
          <Input {...register("banner_url")} placeholder="https://..." />
        </div>
        <div className="space-y-2">
          <Label>Thumbnail URL</Label>
          <Input {...register("thumbnail_url")} placeholder="https://..." />
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={watch("is_featured")}
            onCheckedChange={(v) => setValue("is_featured", v)}
          />
          <Label>Featured Collection</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={watch("is_seasonal")}
            onCheckedChange={(v) => setValue("is_seasonal", v)}
          />
          <Label>Seasonal Collection</Label>
        </div>
      </div>
      <Button type="submit" variant="gold" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : initialData ? "Save Changes" : "Create Collection"}
      </Button>
    </form>
  );
}
