"use client";

import Link from "next/link";
import { Building2, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/language/i18n";

export default function AdminPage() {
  const t = useTranslations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("admin.dashboard.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("admin.dashboard.subtitle")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <Building2 className="h-6 w-6 text-primary-900" />
              </div>
              <div>
                <CardTitle>
                  {t("admin.dashboard.divisions.card.title")}
                </CardTitle>
                <CardDescription>
                  {t("admin.dashboard.divisions.card.description")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/admin/divisions">
              <Button className="w-full">
                {t("admin.dashboard.divisions.button")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                <Users className="h-6 w-6 text-primary-900" />
              </div>
              <div>
                <CardTitle>
                  {t("admin.dashboard.members.card.title")}
                </CardTitle>
                <CardDescription>
                  {t("admin.dashboard.members.card.description")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/admin/members">
              <Button className="w-full">
                {t("admin.dashboard.members.button")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

