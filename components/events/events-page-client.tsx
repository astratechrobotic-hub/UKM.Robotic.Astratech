"use client";

import { useFormStatus } from "react-dom";
import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";
import type { Event } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/components/language/i18n";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function EventsHeading() {
  const t = useTranslations();
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        {t("events.title")}
      </h1>
      <p className="text-muted-foreground">
        {t("events.subtitle")}
      </p>
    </div>
  );
}

export function EventsFormFields() {
  const t = useTranslations();
  const { pending } = useFormStatus();

  return (
    <>
      <div className="grid gap-3 md:grid-cols-3">
        <input
          name="title"
          placeholder={t("events.form.title.placeholder")}
          className="rounded-md border px-3 py-2 text-sm bg-background"
        />
        <input
          type="datetime-local"
          name="event_date"
          className="rounded-md border px-3 py-2 text-sm bg-background"
        />
        <input
          name="location"
          placeholder={t("events.form.location.placeholder")}
          className="rounded-md border px-3 py-2 text-sm bg-background"
        />
      </div>
      <textarea
        name="description"
        placeholder={t("events.form.description.placeholder")}
        className="mt-2 w-full rounded-md border px-3 py-2 text-sm bg-background"
        rows={3}
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? t("events.button.loading") : t("events.button.add")}
      </button>
    </>
  );
}

interface EventsListsProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
}

export function EventsLists({ upcomingEvents, pastEvents }: EventsListsProps) {
  const t = useTranslations();

  return (
    <>
      {upcomingEvents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {t("events.section.upcoming")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      {event.title}
                    </CardTitle>
                    <Badge variant="default">
                      {t("events.badge.upcoming")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatDate(event.event_date)}</span>
                    <span className="mx-1">•</span>
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(event.event_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {t("events.section.past")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      {event.title}
                    </CardTitle>
                    <Badge variant="secondary">
                      {t("events.badge.past")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatDate(event.event_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

