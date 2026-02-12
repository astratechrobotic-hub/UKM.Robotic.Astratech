import { createClient } from "@/lib/supabase/server";
import type { Profile, Division } from "@/types";
import { MembersPageClient } from "@/components/members/members-page-client";

export default async function MembersPage() {
  const supabase = await createClient();

  const { data: members = [] } = await supabase
    .from("profiles")
    .select("*")
    .order("full_name", { ascending: true });

  const { data: divisions = [] } = await supabase
    .from("divisions")
    .select("*")
    .order("name", { ascending: true });

  return (
    <MembersPageClient
      members={members as Profile[]}
      divisions={divisions as Division[]}
    />
  );
}

