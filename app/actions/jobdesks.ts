"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { JobDesk } from "@/types";

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

export async function createJobDesk(
  data: Pick<JobDesk, "title" | "description" | "priority"> & {
    assigned_to: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const authCheck = await ensureAdmin();
    if (!authCheck.ok) return { success: false, error: authCheck.error };

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("jobdesks").insert([
      {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: "todo",
        assigned_to: data.assigned_to,
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

