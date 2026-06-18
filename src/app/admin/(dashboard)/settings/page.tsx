"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AdminHeader } from "@/components/admin/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  loadSettings,
  saveSettings,
  type SiteSettings,
  DEFAULT_SETTINGS,
} from "@/lib/utils/settings-storage";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      saveSettings(settings);
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <AdminHeader title="Settings" />
      <div className="p-6 lg:p-8 max-w-2xl space-y-6">
        <Card>
          <CardHeader><CardTitle>Site Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => update("companyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotif">Email Notifications</Label>
              <Switch
                id="emailNotif"
                checked={settings.emailNotifications}
                onCheckedChange={(v) => update("emailNotifications", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="whatsappNotif">WhatsApp Notifications</Label>
              <Switch
                id="whatsappNotif"
                checked={settings.whatsappNotifications}
                onCheckedChange={(v) => update("whatsappNotifications", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="lowStock">Low Stock Alerts</Label>
              <Switch
                id="lowStock"
                checked={settings.lowStockAlerts}
                onCheckedChange={(v) => update("lowStockAlerts", v)}
              />
            </div>
          </CardContent>
        </Card>
        <Button variant="gold" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </>
  );
}
