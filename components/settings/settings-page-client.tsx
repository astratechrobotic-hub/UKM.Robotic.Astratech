"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SettingsPreferences } from "@/components/settings/preferences";
import { useTranslations } from "@/components/language/i18n";

interface SettingsPageClientProps {
  fullName: string | null;
  email: string | null;
  nim: string | null;
  role: string | null;
  divisionName: string | null;
}

export function SettingsPageClient({
  fullName,
  email,
  nim,
  role,
  divisionName,
}: SettingsPageClientProps) {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("app.settings")}
        </h1>
        <p className="text-muted-foreground">
          {t("app.settings.description")}
        </p>
      </div>

      {/* Account overview */}
      <Card>
        <CardHeader>
          <CardTitle>{t("app.settings.account")}</CardTitle>
          <CardDescription>
            {t("app.settings.account.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">
              Full Name
            </p>
            <p className="font-medium text-foreground">
              {fullName ?? email ?? "-"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">Email</p>
            <p className="font-medium text-foreground">{email ?? "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">NIM</p>
            <p className="font-medium text-foreground">{nim ?? "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">Role</p>
            <p className="font-medium text-foreground">
              {role ?? "MEMBER"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">
              Division
            </p>
            <p className="font-medium text-foreground">
              {divisionName ?? "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* App preferences with interactive client component */}
      <Card>
        <CardHeader>
          <CardTitle>{t("app.settings.application")}</CardTitle>
          <CardDescription>
            {t("app.settings.application.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsPreferences />
        </CardContent>
      </Card>
    </div>
  );
}

