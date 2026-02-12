import { createClient } from "@/lib/supabase/server";
import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { count: membersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: divisionsCount } = await supabase
    .from("divisions")
    .select("*", { count: "exact", head: true });

  let activeProjectsCount = 0;
  let winRate = 0;

  const { count: activeCount, error: activeError } = await supabase
    .from("competitions")
    .select("*", { count: "exact", head: true })
    .eq("status", "ongoing");

  if (!activeError) {
    activeProjectsCount = activeCount ?? 0;

    const { data: completedCompetitions } = await supabase
      .from("competitions")
      .select("result")
      .eq("status", "completed");

    const totalCompleted = completedCompetitions?.length ?? 0;
    const wins = completedCompetitions?.filter((c) => c.result === "win").length ?? 0;
    winRate = totalCompleted > 0 ? Math.round((wins / totalCompleted) * 100) : 0;
  }

  return (
    <DashboardPageClient
      membersCount={membersCount ?? 0}
      divisionsCount={divisionsCount ?? 0}
      activeProjectsCount={activeProjectsCount ?? 0}
      winRate={winRate}
    />
  );
}

