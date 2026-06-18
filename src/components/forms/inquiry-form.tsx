"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { inquirySchema, type InquiryFormData } from "@/lib/validations/schemas";
import { useCreateInquiry } from "@/hooks/use-data";
import { EXPORT_COUNTRIES } from "@/lib/constants/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface InquiryFormProps {
  defaultProduct?: string;
  defaultCountry?: string;
}

export function InquiryForm({ defaultProduct, defaultCountry }: InquiryFormProps) {
  const mutation = useCreateInquiry();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      product: defaultProduct || "",
      country: defaultCountry || "",
      quantity: undefined,
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    try {
      await mutation.mutateAsync({
        ...data,
        quantity: data.quantity && !Number.isNaN(data.quantity) ? Number(data.quantity) : null,
      });
      toast.success("Inquiry submitted successfully! We'll contact you soon.");
      reset({ product: defaultProduct || "", country: defaultCountry || "" });
    } catch {
      toast.error("Failed to submit inquiry. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" {...register("name")} placeholder="John Smith" />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" {...register("company")} placeholder="Your Company Ltd." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {EXPORT_COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email")} placeholder="john@company.com" />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} placeholder="+1 555 0100" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product">Product</Label>
          <Input id="product" {...register("product")} placeholder="Product name or SKU" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="quantity">Quantity (units)</Label>
          <Input id="quantity" type="number" {...register("quantity", { valueAsNumber: true })} placeholder="500" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" {...register("message")} placeholder="Tell us about your requirements..." rows={4} />
        </div>
      </div>
      <Button type="submit" variant="gold" size="lg" disabled={mutation.isPending} className="w-full md:w-auto">
        {mutation.isPending ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
        ) : (
          <><Send className="mr-2 h-4 w-4" /> Submit Inquiry</>
        )}
      </Button>
    </form>
  );
}
