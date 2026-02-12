"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { News } from "@/types";

async function ensureAdmin(): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "You must be logged in" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { ok: false, error: "Admin access required" };
  }
  return { ok: true };
}

export async function createNews(
  data: Pick<News, "title" | "content"> & { image_url?: string | null }
): Promise<{ success: boolean; error?: string }> {
  try {
    const authCheck = await ensureAdmin();
    if (!authCheck.ok) return { success: false, error: authCheck.error };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "User not authenticated" };

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("news").insert([
      {
        title: data.title,
        content: data.content,
        image_url: data.image_url ?? null,
        author_id: user.id,
      },
    ]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

