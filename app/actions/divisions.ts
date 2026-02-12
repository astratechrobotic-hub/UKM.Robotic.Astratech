"use server";

import { createClient } from "@/lib/supabase/server";
import type { Division } from "@/types";

export async function createDivision(data: Omit<Division, "id" | "created_at" | "updated_at">): Promise<{ success: boolean; error?: string; data?: Division }> {
  try {
    const supabase = await createClient();
    
    const { data: division, error } = await supabase
      .from("divisions")
      .insert([data])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: division };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateDivision(
  id: string,
  data: Partial<Omit<Division, "id" | "created_at">>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("divisions")
      .update(data)
      .eq("id", id)

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function deleteDivision(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from("divisions")
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

