"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile } from "@/types";

async function ensureAdmin(): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "You must be logged in" };
  }

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

export async function updateMember(
  id: string,
  data: Partial<Omit<Profile, "id" | "created_at">>
): Promise<{ success: boolean; error?: string; data?: Profile }> {
  try {
    const authCheck = await ensureAdmin();
    if (!authCheck.ok) {
      return { success: false, error: authCheck.error };
    }

    const supabase = createAdminClient();

    // Convert empty division_id to null (UUID column rejects empty string)
    const updateData = {
      ...data,
      division_id: data.division_id === "" ? null : data.division_id,
      updated_at: new Date().toISOString(),
    };

    const { data: member, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!member) {
      return { success: false, error: "Member not found or update had no effect" };
    }

    return { success: true, data: member };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteMember(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const authCheck = await ensureAdmin();
    if (!authCheck.ok) {
      return { success: false, error: authCheck.error };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

