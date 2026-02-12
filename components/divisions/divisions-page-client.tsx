"use client";

import { useState } from "react";
import type { Division, Profile } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code, Wrench, Zap, Users, Cpu } from "lucide-react";
import { useTranslations } from "@/components/language/i18n";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  wrench: Wrench,
  zap: Zap,
  users: Users,
};

interface DivisionsPageClientProps {
  divisions: Division[];
  members: Profile[];
}

export function DivisionsPageClient({
  divisions,
  members,
}: DivisionsPageClientProps) {
  const t = useTranslations();
  const [expandedDivisionId, setExpandedDivisionId] = useState<string | null>(
    null,
  );

  const handleToggleDivision = (divisionId: string): void => {
    setExpandedDivisionId((current) =>
      current === divisionId ? null : divisionId,
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("divisions.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("divisions.subtitle")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {divisions.map((division) => {
          const Icon = iconMap[division.icon_name] || Cpu;
          const divisionMembers = members.filter(
            (member) => member.division_id === division.id,
          );
          const isExpanded = expandedDivisionId === division.id;

          return (
            <Card
              key={division.id}
              className="flex cursor-pointer flex-col hover:shadow-lg transition-shadow"
              onClick={() => handleToggleDivision(division.id)}
            >
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <Icon className="h-6 w-6 text-primary-900" />
                </div>
                <CardTitle className="text-xl">{division.name}</CardTitle>
                <CardDescription>
                  {t("divisions.card.description.prefix")}{" "}
                  {division.name.toLowerCase()}{" "}
                  {t("divisions.card.description.suffix")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-2 text-xs text-muted-foreground">
                  {divisionMembers.length} anggota
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-2 rounded-md bg-muted/60 p-3">
                    {divisionMembers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Belum ada anggota di divisi ini.
                      </p>
                    ) : (
                      <ul className="space-y-1 text-sm">
                        {divisionMembers.map((member) => (
                          <li
                            key={member.id}
                            className="flex items-center justify-between"
                          >
                            <span className="font-medium">
                              {member.full_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {member.nim}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

