"use client";

import { useEffect, useState, useRef } from "react";
import { User, Mail, Hash, Building2, Save, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { updateProfile } from "@/app/actions/profile";
import type { Profile, Division } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "@/components/language/i18n";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [email, setEmail] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    experience: "",
    avatar_url: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations();

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      setEmail(user.email ?? "");

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // Sinkronisasi otomatis dari user_metadata ke profiles kalau nim/full_name kosong
      let finalProfile = profileData as Profile | null;
      const metadata = (user.user_metadata ?? {}) as {
        full_name?: string;
        nim?: string;
      };

      if (
        finalProfile &&
        (finalProfile.nim === null ||
          finalProfile.nim === "" ||
          finalProfile.full_name === null ||
          finalProfile.full_name === "") &&
        (metadata.nim || metadata.full_name)
      ) {
        const updates: Partial<Profile> = {};
        if (
          (finalProfile.nim === null || finalProfile.nim === "") &&
          metadata.nim
        ) {
          updates.nim = metadata.nim;
        }
        if (
          (finalProfile.full_name === null || finalProfile.full_name === "") &&
          metadata.full_name
        ) {
          updates.full_name = metadata.full_name;
        }

        if (Object.keys(updates).length > 0) {
          const { data: synced, error: syncError } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", user.id)
            .select("*")
            .single();

          if (!syncError && synced) {
            finalProfile = synced as Profile;
          }
        }
      }

      if (finalProfile) {
        setProfile(finalProfile);
        setFormData({
          full_name: finalProfile.full_name,
          experience: finalProfile.experience ?? "",
          avatar_url: finalProfile.avatar_url ?? "",
        });
      }

      const { data: divisionsData } = await supabase
        .from("divisions")
        .select("*")
        .order("name", { ascending: true });

      if (divisionsData) {
        setDivisions(divisionsData);
      }
    };

    void loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!profile) {
      setIsSaving(false);
      return;
    }

    const result = await updateProfile(profile.id, {
      full_name: formData.full_name,
      experience: formData.experience,
      avatar_url: formData.avatar_url || null,
    });

    if (result.success && result.data) {
      setProfile(result.data);
      setIsEditing(false);
    } else {
      alert(result.error || "Failed to update profile");
    }

    setIsSaving(false);
  };

  const getDivisionName = (divisionId: string): string => {
    return divisions.find((d) => d.id === divisionId)?.name || "Unknown";
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert(t("profile.avatar.error.type") ?? "Hanya file gambar (JPG, PNG, GIF, WebP) yang diizinkan.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert(t("profile.avatar.error.size") ?? "Ukuran maksimal 2 MB.");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${profile.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      alert(uploadError.message ?? t("profile.avatar.error.upload"));
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);

    const result = await updateProfile(profile.id, { avatar_url: publicUrl });
    if (result.success && result.data) {
      setProfile(result.data);
      setFormData((prev) => ({ ...prev, avatar_url: publicUrl }));
    } else {
      alert(result.error ?? t("profile.avatar.error.upload"));
    }

    setIsUploading(false);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("profile.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("profile.subtitle")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.section.info")}</CardTitle>
            <CardDescription>
              {t("profile.section.info.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={isUploading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="group relative rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {profile?.avatar_url ? (
                  <img
                    src={`${profile.avatar_url}?v=${profile.updated_at || ""}`}
                    alt={profile.full_name}
                    className="h-24 w-24 rounded-full object-cover ring-2 ring-background"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 ring-2 ring-background">
                    <User className="h-12 w-12 text-primary-900" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 group-disabled:opacity-100">
                  {isUploading ? (
                    <span className="text-xs font-medium text-white">...</span>
                  ) : (
                    <Camera className="h-8 w-8 text-white" />
                  )}
                </div>
              </button>
              <div>
                <h3 className="text-lg font-semibold">
                  {profile?.full_name ?? "Loading..."}
                </h3>
                {profile && (
                  <Badge variant={profile.role === "admin" ? "default" : "secondary"}>
                    {profile.role}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {t("profile.label.email")}
                </span>
                <span>{email || "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {t("profile.label.nim")}
                </span>
                <span>{profile?.nim ?? "-"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {t("profile.label.division")}
                </span>
                <Badge variant="outline">
                  {profile ? getDivisionName(profile.division_id) : "-"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("profile.section.experience")}</CardTitle>
                <CardDescription>
                  {t("profile.section.experience.description")}
                </CardDescription>
              </div>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  {t("profile.button.edit")}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditing && profile ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="full_name" className="text-sm font-medium">
                    {t("profile.form.full_name")}
                  </label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("profile.avatar.hint")}
                </p>
                <div className="space-y-2">
                  <label htmlFor="experience" className="text-sm font-medium">
                    {t("profile.form.experience")}
                  </label>
                  <Textarea
                    id="experience"
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData({ ...formData, experience: e.target.value })
                    }
                    placeholder={t("profile.form.experience.placeholder")}
                    rows={6}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving
                      ? t("profile.button.saving")
                      : t("profile.button.save")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        full_name: profile.full_name,
                        experience: profile.experience || "",
                        avatar_url: profile.avatar_url || "",
                      });
                    }}
                  >
                    {t("profile.button.cancel")}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {profile?.experience || t("profile.empty.experience")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

