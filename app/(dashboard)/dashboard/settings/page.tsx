import { createClient } from "@/lib/supabase/server";
import { SettingsPageClient } from "@/components/settings/settings-page-client";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, nim, role, division_id")
    .eq("id", user?.id ?? "")
    .single();

  const { data: division } = await supabase
    .from("divisions")
    .select("name")
    .eq("id", profile?.division_id ?? "")
    .single();

  return (
    <SettingsPageClient
      fullName={profile?.full_name ?? null}
      email={user?.email ?? null}
      nim={profile?.nim ?? null}
      role={profile?.role ?? null}
      divisionName={division?.name ?? null}
    />
  );
}

