"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Competition } from "@/types";

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

export async function createCompetition(data: {
  title: string;
  description?: string;
  event_date?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "You must be logged in" };

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("competitions").insert([
      {
        title: data.title,
        description: data.description ?? null,
        event_date: data.event_date ?? null,
        status: "ongoing",
      },
    ]);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateCompetitionResult(
  id: string,
  data: { status: "completed"; result: "win" | "lose" }
): Promise<{ success: boolean; error?: string }> {
  try {
    const authCheck = await ensureAdmin();
    if (!authCheck.ok) return { success: false, error: authCheck.error };

    const adminClient = createAdminClient();
    const { error } = await adminClient
      .from("competitions")
      .update({ status: data.status, result: data.result })
      .eq("id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteCompetition(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const authCheck = await ensureAdmin();
    if (!authCheck.ok) return { success: false, error: authCheck.error };

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("competitions").delete().eq("id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
