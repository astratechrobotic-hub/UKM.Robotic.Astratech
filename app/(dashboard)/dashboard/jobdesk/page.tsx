"use client";

import { useEffect, useState } from "react";
import type { JobDesk, Division, Profile } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { createJobDesk } from "@/app/actions/jobdesks";
import { useTranslations } from "@/components/language/i18n";

export default function JobDeskPage() {
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [members, setMembers] = useState<Profile[]>([]);
  const [jobDesks, setJobDesks] = useState<JobDesk[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "low" as "low" | "high",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const t = useTranslations();

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id ?? "")
        .maybeSingle();
      setIsAdmin(profile?.role === "admin");

      const { data: divisionsData } = await supabase
        .from("divisions")
        .select("*")
        .order("name", { ascending: true });

      if (divisionsData && divisionsData.length > 0) {
        setDivisions(divisionsData);
        setSelectedDivision(divisionsData[0].id);
      }

      const { data: membersData } = await supabase
        .from("profiles")
        .select("id, full_name, division_id")
        .order("full_name", { ascending: true });

      if (membersData && membersData.length > 0) {
        setMembers(membersData as Profile[]);
        setSelectedMember(membersData[0].id);
      }

      let query = supabase.from("jobdesks").select("*").order("created_at", { ascending: true });

      if (user && profile?.role !== "admin") {
        query = query.eq("assigned_to", user.id);
      }

      const { data: jobDesksData } = await query;

      if (jobDesksData) {
        setJobDesks(jobDesksData);
      }
    };

    void loadData();
  }, []);

  const getJobDesksByDivision = (divisionId: string): JobDesk[] => {
    return jobDesks.filter((j) => {
      const assignee = members.find((m) => m.id === j.assigned_to);
      return assignee?.division_id === divisionId;
    });
  };

  const myTasks = userId ? jobDesks.filter((j) => j.assigned_to === userId) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("tasks.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("tasks.subtitle")}
        </p>
      </div>

      {isAdmin && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!selectedMember || !newTask.title) return;

            setIsSubmitting(true);
            try {
              const result = await createJobDesk({
                title: newTask.title,
                description: newTask.description,
                priority: newTask.priority,
                assigned_to: selectedMember,
              });

              if (!result.success) {
                alert(result.error ?? "Failed to create task");
                return;
              }

              const supabase = createClient();
              const { data: jobDesksData } = await supabase
                .from("jobdesks")
                .select("*")
                .order("created_at", { ascending: true });

              if (jobDesksData) {
                setJobDesks(jobDesksData);
              }

              setNewTask({ title: "", description: "", priority: "low" });
            } finally {
              setIsSubmitting(false);
            }
          }}
          className="space-y-3 rounded-lg border bg-card p-4"
        >
          <div className="grid gap-3 md:grid-cols-3">
            <input
              name="title"
              placeholder={t("tasks.form.title.placeholder")}
              className="rounded-md border px-3 py-2 text-sm bg-background"
              value={newTask.title}
              onChange={(e) => setNewTask((t) => ({ ...t, title: e.target.value }))}
            />
            <select
              className="rounded-md border px-3 py-2 text-sm bg-background"
              value={newTask.priority}
              onChange={(e) =>
                setNewTask((t) => ({ ...t, priority: e.target.value as "low" | "high" }))
              }
            >
              <option value="low">{t("tasks.form.priority.low")}</option>
              <option value="high">{t("tasks.form.priority.high")}</option>
            </select>
            <select
              className="rounded-md border px-3 py-2 text-sm bg-background"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              required
            >
              <option value="">{t("tasks.form.assign.placeholder")}</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name}
                  {member.division_id
                    ? ` (${divisions.find((d) => d.id === member.division_id)?.name ?? ""})`
                    : ""}
                </option>
              ))}
            </select>
          </div>
          <textarea
            name="description"
            placeholder={t("tasks.form.description.placeholder")}
            className="mt-2 w-full rounded-md border px-3 py-2 text-sm bg-background"
            rows={3}
            value={newTask.description}
            onChange={(e) =>
              setNewTask((t) => ({ ...t, description: e.target.value }))
            }
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t("tasks.button.loading") : t("tasks.button.add")}
          </button>
        </form>
      )}

      {isAdmin ? (
      <Tabs value={selectedDivision} onValueChange={setSelectedDivision}>
        <TabsList>
          {divisions.map((division) => (
            <TabsTrigger key={division.id} value={division.id}>
              {division.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {divisions.map((division) => {
          const divisionJobDesks = getJobDesksByDivision(division.id);
          return (
            <TabsContent key={division.id} value={division.id}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {divisionJobDesks.map((jobDesk) => (
                  <Card key={jobDesk.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{jobDesk.title}</CardTitle>
                        <StatusBadge status={jobDesk.status} />
                      </div>
                      <CardDescription>{jobDesk.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            jobDesk.priority === "high" ? "destructive" : "secondary"
                          }
                        >
                          {jobDesk.priority === "high"
                            ? t("tasks.badge.priority.high")
                            : t("tasks.badge.priority.low")}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {divisionJobDesks.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      {t("tasks.empty")}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t("tasks.myTasks")}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myTasks.map((jobDesk) => (
              <Card key={jobDesk.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{jobDesk.title}</CardTitle>
                    <StatusBadge status={jobDesk.status} />
                  </div>
                  <CardDescription>{jobDesk.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant={
                      jobDesk.priority === "high" ? "destructive" : "secondary"
                    }
                  >
                    {jobDesk.priority === "high"
                      ? t("tasks.badge.priority.high")
                      : t("tasks.badge.priority.low")}
                  </Badge>
                </CardContent>
              </Card>
            ))}
            {myTasks.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="py-8 text-center text-muted-foreground">
                  {t("tasks.empty.myTasks")}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

