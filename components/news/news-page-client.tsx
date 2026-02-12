"use client";

import { useFormStatus } from "react-dom";
import { Calendar, User } from "lucide-react";
import type { News } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "@/components/language/i18n";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function NewsHeading() {
  const t = useTranslations();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        {t("news.title")}
      </h1>
      <p className="text-muted-foreground">
        {t("news.subtitle")}
      </p>
    </div>
  );
}

export function NewsFormFields() {
  const t = useTranslations();
  const { pending } = useFormStatus();

  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <input
          name="title"
          placeholder={t("news.form.title.placeholder")}
          className="flex-1 rounded-md border px-3 py-2 text-sm bg-background"
        />
      </div>
      <textarea
        name="content"
        placeholder={t("news.form.content.placeholder")}
        className="mt-2 w-full rounded-md border px-3 py-2 text-sm bg-background"
        rows={3}
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? t("news.button.loading") : t("news.button.add")}
      </button>
    </>
  );
}

interface NewsListProps {
  newsList: News[];
}

export function NewsList({ newsList }: NewsListProps) {
  const t = useTranslations();

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsList.map((news) => (
          <Card key={news.id} className="hover:shadow-lg transition-shadow">
            {news.image_url && (
              <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(news.created_at)}</span>
                <span className="mx-1">•</span>
                <User className="h-3 w-3" />
                <span>{t("news.card.author")}</span>
              </div>
              <CardTitle className="text-xl">{news.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-3">
                {news.content}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

