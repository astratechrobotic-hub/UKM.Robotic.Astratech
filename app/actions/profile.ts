"use server";

import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export async function updateProfile(
  id: string,
  data: Partial<Pick<Profile, "experience" | "avatar_url" | "full_name">>
): Promise<{ success: boolean; error?: string; data?: Profile }> {
  try {
    const supabase = await createClient();
    
    const { data: profile, error } = await supabase
      .from("profiles")
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: profile };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

