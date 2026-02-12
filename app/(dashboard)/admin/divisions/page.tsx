"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Code, Wrench, Zap, Users, Cpu } from "lucide-react";
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
import { createDivision, updateDivision, deleteDivision } from "@/app/actions/divisions";
import type { Division } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "@/components/language/i18n";

const iconOptions = [
  { value: "code", label: "Code", icon: Code },
  { value: "wrench", label: "Wrench", icon: Wrench },
  { value: "zap", label: "Zap", icon: Zap },
  { value: "users", label: "Users", icon: Users },
  { value: "cpu", label: "CPU", icon: Cpu },
];

export default function AdminDivisionsPage() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDivision, setEditingDivision] = useState<Division | null>(null);
  const [formData, setFormData] = useState({ name: "", icon_name: "code" });
  const t = useTranslations();

  useEffect(() => {
    const loadDivisions = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("divisions")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        setDivisions(data);
      }
    };

    void loadDivisions();
  }, []);

  const handleOpenDialog = (division?: Division) => {
    if (division) {
      setEditingDivision(division);
      setFormData({ name: division.name, icon_name: division.icon_name });
    } else {
      setEditingDivision(null);
      setFormData({ name: "", icon_name: "code" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingDivision(null);
    setFormData({ name: "", icon_name: "code" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDivision) {
      const result = await updateDivision(editingDivision.id, formData);
      if (result.success) {
        setDivisions(
          divisions.map((d) =>
            d.id === editingDivision.id ? { ...d, ...formData } : d,
          ),
        );
        handleCloseDialog();
      } else {
        alert(result.error || "Failed to update division");
      }
    } else {
      const result = await createDivision(formData);
      if (result.success && result.data) {
        setDivisions([...divisions, result.data]);
        handleCloseDialog();
      } else {
        alert(result.error || "Failed to create division");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.divisions.confirm.delete"))) return;
    
    const result = await deleteDivision(id);
    if (result.success) {
      setDivisions(divisions.filter(d => d.id !== id));
    } else {
      alert(result.error || "Failed to delete division");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("admin.divisions.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("admin.divisions.subtitle")}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              {t("admin.divisions.button.add")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingDivision
                    ? t("admin.divisions.dialog.edit.title")
                    : t("admin.divisions.dialog.create.title")}
                </DialogTitle>
                <DialogDescription>
                  {editingDivision
                    ? t("admin.divisions.dialog.edit.description")
                    : t("admin.divisions.dialog.create.description")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    {t("admin.divisions.form.name.label")}
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder={t("admin.divisions.form.name.placeholder")}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="icon" className="text-sm font-medium">
                    {t("admin.divisions.form.icon.label")}
                  </label>
                  <Select
                    value={formData.icon_name}
                    onValueChange={(value) =>
                      setFormData({ ...formData, icon_name: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("admin.divisions.form.icon.placeholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {option.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  {t("admin.divisions.button.cancel")}
                </Button>
                <Button type="submit">
                  {editingDivision
                    ? t("admin.divisions.button.update")
                    : t("admin.divisions.button.create")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {divisions.map((division) => {
          const iconOption = iconOptions.find((opt) => opt.value === division.icon_name);
          const Icon = iconOption?.icon || Cpu;

          return (
            <Card key={division.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                      <Icon className="h-5 w-5 text-primary-900" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{division.name}</CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(division)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(division.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

