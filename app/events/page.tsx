import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

const supabaseAdmin = getSupabaseAdminClient();

export default async function EventsPage() {
  const { data: events } = await supabaseAdmin
    .from("events")
    .select("id, title, description, location, event_date")
    .order("event_date", { ascending: true });

  const now = new Date();

  const upcomingEvents =
    events?.filter(
      (event) => new Date(event.event_date).getTime() >= now.getTime()
    ) ?? [];

  const pastEvents =
    events
      ?.filter(
        (event) => new Date(event.event_date).getTime() < now.getTime()
      )
      .reverse() ?? [];

  return (
    <main className="min-h-screen bg-linear-to-b from-[#0B1D3A] to-[#132E59] px-6 py-28 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <h1 className="text-5xl font-bold">Events</h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Discover upcoming workshops, hackathons, and community events
            organized by AWS Student Builder Group LPU.
          </p>
        </div>

        <section>
          <h2 className="mb-5 text-2xl font-semibold text-white">
            Upcoming Events
          </h2>

          {upcomingEvents.length ? (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <article
                  key={event.id}
                  className="rounded-lg border border-slate-700 bg-slate-900/40 p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-white">
                        {event.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-5 text-sm text-slate-400">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={15} />
                          {new Date(event.event_date).toLocaleString()}
                        </span>

                        <span className="flex items-center gap-2">
                          <MapPin size={15} />
                          {event.location || "TBA"}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/events/${event.id}`}
                      className="rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-white/10"
                    >
                      View
                    </Link>
                  </div>

                  {event.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-slate-300">
                      {event.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-slate-700 bg-slate-900/40 p-6 text-slate-400">
              No upcoming events.
            </p>
          )}
        </section>

        {/* Past Events */}
        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-semibold text-white">
            Past Events
          </h2>

          {pastEvents.length ? (
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <article
                  key={event.id}
                  className="rounded-lg border border-slate-700 bg-slate-900/40 p-5 opacity-80"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-white">
                        {event.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-5 text-sm text-slate-400">
                        <span className="flex items-center gap-2">
                          <CalendarDays size={15} />
                          {new Date(event.event_date).toLocaleString()}
                        </span>

                        <span className="flex items-center gap-2">
                          <MapPin size={15} />
                          {event.location || "TBA"}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/events/${event.id}`}
                      className="rounded-md border border-slate-600 px-4 py-2 text-sm hover:bg-white/10"
                    >
                      View
                    </Link>
                  </div>

                  {event.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-slate-300">
                      {event.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-slate-700 bg-slate-900/40 p-6 text-slate-400">
              No past events.
            </p>
          )}
        </section>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex rounded-lg border border-slate-600 px-5 py-3 font-medium text-white transition hover:bg-white/10"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}