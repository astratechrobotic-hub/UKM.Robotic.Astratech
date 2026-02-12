"use client";

import { useEffect, useState } from "react";
import { Trophy, Plus, Check, X } from "lucide-react";
import type { Competition } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import {
  createCompetition,
  updateCompetitionResult,
  deleteCompetition,
} from "@/app/actions/competitions";
import { useTranslations } from "@/components/language/i18n";

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [resultDialog, setResultDialog] = useState<Competition | null>(null);
  const [newComp, setNewComp] = useState({ title: "", description: "" });
  const [selectedResult, setSelectedResult] = useState<"win" | "lose">("win");
  const t = useTranslations();

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id ?? "")
        .maybeSingle();
      setIsAdmin(profile?.role === "admin");

      const { data } = await supabase
        .from("competitions")
        .select("*")
        .order("event_date", { ascending: false });

      setCompetitions((data as Competition[]) ?? []);
    };
    void load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComp.title.trim()) return;
    const result = await createCompetition(newComp);
    if (!result.success) {
      alert(result.error);
      return;
    }
    setIsAddOpen(false);
    setNewComp({ title: "", description: "" });
    const supabase = createClient();
    const { data } = await supabase
      .from("competitions")
      .select("*")
      .order("event_date", { ascending: false });
    setCompetitions((data as Competition[]) ?? []);
  };

  const handleSetResult = async () => {
    if (!resultDialog) return;
    const result = await updateCompetitionResult(resultDialog.id, {
      status: "completed",
      result: selectedResult,
    });
    if (!result.success) {
      alert(result.error);
      return;
    }
    setResultDialog(null);
    const supabase = createClient();
    const { data } = await supabase
      .from("competitions")
      .select("*")
      .order("event_date", { ascending: false });
    setCompetitions((data as Competition[]) ?? []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("competitions.confirm.delete"))) return;
    const result = await deleteCompetition(id);
    if (!result.success) {
      alert(result.error);
      return;
    }
    setCompetitions(competitions.filter((c) => c.id !== id));
  };

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "-";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("competitions.title")}</h1>
          <p className="text-muted-foreground">{t("competitions.subtitle")}</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("competitions.button.add")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("competitions.card.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {competitions.map((c) => (
              <Card key={c.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      <CardTitle className="text-lg">{c.title}</CardTitle>
                    </div>
                    <Badge
                      variant={c.status === "ongoing" ? "default" : "secondary"}
                    >
                      {c.status === "ongoing"
                        ? t("competitions.status.ongoing")
                        : t("competitions.status.completed")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatDate(c.event_date)}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {c.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    {c.status === "completed" ? (
                      <Badge
                        variant={c.result === "win" ? "default" : "destructive"}
                      >
                        {c.result === "win"
                          ? t("competitions.result.win")
                          : t("competitions.result.lose")}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {t("competitions.result.pending")}
                      </span>
                    )}
                    {isAdmin && (
                      <div className="flex gap-1">
                        {c.status === "ongoing" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setResultDialog(c);
                              setSelectedResult("win");
                            }}
                          >
                            {t("competitions.button.setResult")}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(c.id)}
                        >
                          {t("competitions.button.delete")}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {competitions.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              {t("competitions.empty")}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <form onSubmit={handleAdd}>
            <DialogHeader>
              <DialogTitle>{t("competitions.button.add")}</DialogTitle>
              <DialogDescription>
                {t("competitions.subtitle")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">{t("competitions.form.title.placeholder")}</label>
                <Input
                  value={newComp.title}
                  onChange={(e) => setNewComp((p) => ({ ...p, title: e.target.value }))}
                  placeholder={t("competitions.form.title.placeholder")}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newComp.description}
                  onChange={(e) => setNewComp((p) => ({ ...p, description: e.target.value }))}
                  placeholder={t("competitions.form.description.placeholder")}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                {t("admin.members.button.cancel")}
              </Button>
              <Button type="submit">{t("competitions.button.add")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!resultDialog} onOpenChange={() => setResultDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("competitions.button.setResult")}</DialogTitle>
            <DialogDescription>
              {resultDialog && `"${resultDialog.title}"`} — {t("competitions.result.win")} / {t("competitions.result.lose")}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 py-4">
            <Button
              variant={selectedResult === "win" ? "default" : "outline"}
              onClick={() => setSelectedResult("win")}
              className="flex-1"
            >
              <Check className="mr-2 h-4 w-4" />
              {t("competitions.result.win")}
            </Button>
            <Button
              variant={selectedResult === "lose" ? "destructive" : "outline"}
              onClick={() => setSelectedResult("lose")}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              {t("competitions.result.lose")}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResultDialog(null)}>
              {t("admin.members.button.cancel")}
            </Button>
            <Button onClick={handleSetResult}>
              {t("competitions.button.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
