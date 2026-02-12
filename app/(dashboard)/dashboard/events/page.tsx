import type { Event } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { createEvent } from "@/app/actions/events";
import { revalidatePath } from "next/cache";
import {
  EventsHeading,
  EventsFormFields,
  EventsLists,
} from "@/components/events/events-page-client";

const isUpcoming = (dateString: string): boolean => {
  return new Date(dateString) > new Date();
};

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id ?? "")
    .maybeSingle();
  const isAdmin = profile?.role === "admin";

  const { data: eventsData } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  const events = eventsData ?? [];
  const upcomingEvents = events.filter((event) => isUpcoming(event.event_date));
  const pastEvents = events.filter((event) => !isUpcoming(event.event_date));

  return (
    <div className="space-y-6">
      <EventsHeading />

      {isAdmin && (
        <form
          action={async (formData: FormData) => {
            "use server";
            const title = String(formData.get("title") ?? "");
            const date = String(formData.get("event_date") ?? "");
            const location = String(formData.get("location") ?? "");
            const description = String(formData.get("description") ?? "");
            if (!title || !date || !location) return;
            await createEvent({
              title,
              event_date: date,
              location,
              description,
            });
            revalidatePath("/dashboard/events");
          }}
          className="space-y-3 rounded-lg border bg-card p-4"
        >
          <EventsFormFields />
        </form>
      )}

      <EventsLists
        upcomingEvents={upcomingEvents as Event[]}
        pastEvents={pastEvents as Event[]}
      />

      {events.length === 0 && (
        <div className="rounded-lg border bg-card">
          <div className="py-12 text-center text-muted-foreground">
            {/* Fallback text akan tetap bisa diterjemahkan nanti jika dibutuhkan */}
          </div>
        </div>
      )}
    </div>
  );
}

