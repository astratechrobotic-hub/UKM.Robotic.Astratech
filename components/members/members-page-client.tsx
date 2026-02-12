"use client";

import type { Profile, Division } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/components/language/i18n";

interface MembersPageClientProps {
  members: Profile[];
  divisions: Division[];
}

const getDivisionName = (
  divisionId: string,
  divisions: Division[],
): string => {
  return divisions.find((d) => d.id === divisionId)?.name || "Unknown";
};

export function MembersPageClient({
  members,
  divisions,
}: MembersPageClientProps) {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("members.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("members.subtitle")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("members.card.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    {t("members.table.header.name")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    {t("members.table.header.nim")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    {t("members.table.header.division")}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    {t("members.table.header.role")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 text-sm">
                      {member.full_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {member.nim}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">
                        {getDivisionName(member.division_id, divisions)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          member.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {member.role}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

