"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { FadeIn } from "@/components/animations/motion";
import { contactSchema, type ContactFormData } from "@/lib/validations/schemas";
import { SITE } from "@/lib/constants/site";
import { getWhatsAppLink } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

import { DEFAULT_MAPS_EMBED } from "@/lib/utils/settings-storage";
import { IS_STATIC_EXPORT } from "@/lib/constants/static-export";
import { submitClientContact } from "@/lib/services/client-data";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      if (IS_STATIC_EXPORT) {
        await submitClientContact(data);
        toast.success("Message sent! (Demo preview — we'll respond within 24 hours.)");
        reset();
        return;
      }
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send");
      toast.success("Message sent! We'll respond within 24 hours.");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const mapsUrl =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL || DEFAULT_MAPS_EMBED;

  return (
    <>
      <section className="bg-primary pt-28 pb-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Contact Us</h1>
            <p className="mt-4 max-w-2xl text-white/70">
              Get in touch with our export team for inquiries, quotes, and partnerships.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <FadeIn direction="left">
              <h2 className="font-display text-2xl font-bold">Send a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" {...register("subject")} />
                  {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" rows={5} {...register("message")} />
                  {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                </div>
                <Button type="submit" variant="gold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="mr-2 h-4 w-4" /> Send Message</>
                  )}
                </Button>
              </form>
            </FadeIn>

            <FadeIn direction="right">
              <div className="space-y-6">
                <Card>
                  <CardContent className="flex items-start gap-4 p-6">
                    <MapPin className="h-6 w-6 shrink-0 text-gold" />
                    <div>
                      <h3 className="font-semibold">Address</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{SITE.address}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-start gap-4 p-6">
                    <Phone className="h-6 w-6 shrink-0 text-gold" />
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <a href={`tel:${SITE.phone}`} className="mt-1 text-sm text-muted-foreground hover:text-gold">
                        {SITE.phone}
                      </a>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-start gap-4 p-6">
                    <Mail className="h-6 w-6 shrink-0 text-gold" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <a href={`mailto:${SITE.email}`} className="mt-1 text-sm text-muted-foreground hover:text-gold">
                        {SITE.email}
                      </a>
                    </div>
                  </CardContent>
                </Card>
                <Button asChild variant="gold" className="w-full" size="lg">
                  <a
                    href={getWhatsAppLink(SITE.whatsapp, "Hello Fashion Bridge International")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="overflow-hidden rounded-2xl border">
              <iframe
                src={mapsUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Fashion Bridge International Location"
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
