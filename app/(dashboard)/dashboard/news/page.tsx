import type { News } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { createNews } from "@/app/actions/news";
import { revalidatePath } from "next/cache";
import {
  NewsHeading,
  NewsFormFields,
  NewsList,
} from "@/components/news/news-page-client";

export default async function NewsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id ?? "")
    .maybeSingle();
  const isAdmin = profile?.role === "admin";

  const { data: newsData } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });

  const newsList = newsData ?? [];

  return (
    <div className="space-y-6">
      <NewsHeading />

      {isAdmin && (
        <form
          action={async (formData: FormData) => {
            "use server";
            const title = String(formData.get("title") ?? "");
            const content = String(formData.get("content") ?? "");
            if (!title || !content) return;
            await createNews({ title, content });
            revalidatePath("/dashboard/news");
          }}
          className="space-y-3 rounded-lg border bg-card p-4"
        >
          <NewsFormFields />
        </form>
      )}

      <NewsList newsList={newsList} />

      {newsList.length === 0 && (
        <div className="rounded-lg border bg-card">
          <div className="py-12 text-center text-muted-foreground">
            {/* Empty state text can be enhanced with translation if needed */}
          </div>
        </div>
      )}
    </div>
  );
}

