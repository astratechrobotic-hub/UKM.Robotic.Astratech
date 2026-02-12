"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { updateMember, deleteMember } from "@/app/actions/members";
import type { Profile, Division } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "@/components/language/i18n";

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Profile[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    role: "member" as "admin" | "member",
    division_id: "",
    nim: "",
  });
  const t = useTranslations();

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();

      const { data: membersData } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name", { ascending: true });

      if (membersData) {
        setMembers(membersData);
      }

      const { data: divisionsData } = await supabase
        .from("divisions")
        .select("*")
        .order("name", { ascending: true });

      if (divisionsData) {
        setDivisions(divisionsData);
      }
    };

    void loadData();
  }, []);

  const handleOpenDialog = (member: Profile) => {
    setEditingMember(member);
    setFormData({
      role: member.role,
      division_id: member.division_id,
      nim: member.nim ?? "",
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMember(null);
    setFormData({ role: "member", division_id: "", nim: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const result = await updateMember(editingMember.id, formData);
    if (result.success && result.data) {
      setMembers(members.map((m) => (m.id === editingMember.id ? result.data! : m)));
      handleCloseDialog();
    } else {
      alert(result.error || "Failed to update member");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.members.confirm.delete"))) return;

    const result = await deleteMember(id);
    if (result.success) {
      setMembers(members.filter((m) => m.id !== id));
    } else {
      alert(result.error || "Failed to delete member");
    }
  };

  const getDivisionName = (divisionId: string): string => {
    return divisions.find((d) => d.id === divisionId)?.name || "Unknown";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("admin.members.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("admin.members.subtitle")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.members.card.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    {t("admin.members.table.header.name")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    {t("admin.members.table.header.nim")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    {t("admin.members.table.header.division")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    {t("admin.members.table.header.role")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    {t("admin.members.table.header.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm">{member.full_name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {member.nim}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{getDivisionName(member.division_id)}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={member.role === "admin" ? "default" : "secondary"}
                      >
                        {member.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(member)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{t("admin.members.dialog.title")}</DialogTitle>
              <DialogDescription>
                {t("admin.members.dialog.description")}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="nim" className="text-sm font-medium">
                  NIM
                </label>
                <Input
                  id="nim"
                  value={formData.nim}
                  onChange={(e) =>
                    setFormData({ ...formData, nim: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="role" className="text-sm font-medium">
                  {t("admin.members.form.role.label")}
                </label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "admin" | "member") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">
                      {t("admin.members.form.role.member")}
                    </SelectItem>
                    <SelectItem value="admin">
                      {t("admin.members.form.role.admin")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="division" className="text-sm font-medium">
                  {t("admin.members.form.division.label")}
                </label>
                <Select
                  value={formData.division_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, division_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        "admin.members.form.division.placeholder",
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((division) => (
                      <SelectItem key={division.id} value={division.id}>
                        {division.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                {t("admin.members.button.cancel")}
              </Button>
              <Button type="submit">
                {t("admin.members.button.update")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

