import { createClient } from "@/lib/supabase/server";
import type { Division, Profile } from "@/types";
import { DivisionsPageClient } from "@/components/divisions/divisions-page-client";

export default async function DivisionsPage() {
  const supabase = await createClient();

  const { data: divisionsData } = await supabase
    .from("divisions")
    .select("*")
    .order("name", { ascending: true });

  const { data: membersData } = await supabase
    .from("profiles")
    .select("*")
    .not("division_id", "is", null)
    .order("full_name", { ascending: true });

  const divisions: Division[] = (divisionsData ?? []) as Division[];
  const members: Profile[] = (membersData ?? []) as Profile[];

  return <DivisionsPageClient divisions={divisions} members={members} />;
}

