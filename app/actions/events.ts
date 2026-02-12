"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Event } from "@/types";

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

export async function createEvent(
  data: Pick<Event, "title" | "event_date" | "location" | "description">
): Promise<{ success: boolean; error?: string }> {
  try {
    const authCheck = await ensureAdmin();
    if (!authCheck.ok) return { success: false, error: authCheck.error };

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("events").insert([
      {
        title: data.title,
        event_date: data.event_date,
        location: data.location,
        description: data.description,
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

