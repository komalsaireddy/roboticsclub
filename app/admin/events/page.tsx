import { redirect } from "next/navigation";

import AccessDenied from "@/components/admin/AccessDenied";
import DeleteEventButton from "@/components/admin/DeleteEventButton";
import EditEventModal from "@/components/admin/EditEventModal";
import EventImageUploader from "@/components/admin/EventImageUploader";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { createEvent } from "./actions";

interface PageProps {
  searchParams: Promise<{
    edit?: string;
  }>;
}

interface EventRow {
  id: string;
  number: string | null;
  title: string;
  type: string | null;
  description: string | null;
  cover_image_url: string | null;
  cover_storage_path: string | null;
  rules_url: string | null;
  register_url: string | null;
  event_date: string | null;
  event_end_date: string | null;
  chapter: string | null;
  featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default async function AdminEventsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const editId =
    typeof params.edit === "string"
      ? params.edit.trim()
      : "";

  const supabase =
    await createSupabaseServerClient();

  /* ============================================================
     AUTHENTICATION
  ============================================================ */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  /* ============================================================
     PERMISSION
  ============================================================ */

  const {
    data: allowed,
    error: permissionError,
  } = await supabase.rpc(
    "has_permission",
    {
      perm: "manage_events",
    }
  );

  if (permissionError) {
    console.error(
      "Event permission check failed:",
      permissionError
    );

    return <AccessDenied />;
  }

  if (!allowed) {
    return <AccessDenied />;
  }

  /* ============================================================
     LOAD EVENTS
  ============================================================ */

  const {
    data: events,
    error: eventsError,
  } = await supabase
    .from("events")
    .select(`
      id,
      number,
      title,
      type,
      description,
      cover_image_url,
      cover_storage_path,
      rules_url,
      register_url,
      event_date,
      event_end_date,
      chapter,
      featured,
      is_published,
      created_at,
      updated_at
    `)
    .order(
      "event_date",
      {
        ascending: false,
        nullsFirst: false,
      }
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  /* ============================================================
     SAFE EVENT LIST
  ============================================================ */

  const eventList: EventRow[] =
    (events ?? []).filter(
      (
        event
      ): event is EventRow =>
        Boolean(
          event &&
          typeof event.id === "string" &&
          typeof event.title === "string"
        )
    );

  /* ============================================================
     EDITING EVENT
  ============================================================ */

  const editingEvent =
    editId
      ? eventList.find(
          (event) =>
            event.id === editId
        ) ?? null
      : null;

  return (
    <main className="min-h-screen bg-[#030303] text-white">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-white/[0.08]">

        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-10">

          <div className="flex items-center gap-4">

            <a
              href="/admin"
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/[0.12]"
            >
              <img
                src="/robotics-club-logo.jpg"
                alt="Robotics Club GCET"
                className="h-full w-full object-cover"
              />
            </a>

            <div>

              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/80">
                Robotics Club
              </p>

              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">
                Events / Management
              </p>

            </div>

          </div>

          <a
            href="/admin"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 transition-colors hover:text-cyan-300"
          >
            ← Dashboard
          </a>

        </div>

      </header>

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="mx-auto max-w-[1600px] px-6 py-10 lg:px-10 lg:py-14">

        {/* ====================================================
            TITLE
        ==================================================== */}

        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>

            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/70">
              Content Management
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Events
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/35">
              Manage competitions, workshops,
              seminars and other Robotics Club
              events.
            </p>

          </div>

          <a
            href="#add-event"
            className="inline-flex h-11 items-center justify-center border border-white/[0.1] bg-white px-6 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition-all hover:bg-cyan-300"
          >
            + Add Event
          </a>

        </div>

        {/* ====================================================
            ERROR
        ==================================================== */}

        {eventsError && (

          <div className="mb-8 border border-red-400/20 bg-red-400/[0.04] p-4">

            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-red-300/60">
              Database Error
            </p>

            <p className="mt-2 text-sm text-red-300">
              {eventsError.message}
            </p>

          </div>

        )}

        {/* ====================================================
            EVENT LIST
        ==================================================== */}

        <section className="border-t border-white/[0.08]">

          {eventList.length === 0 ? (

            <div className="border-b border-white/[0.08] py-20 text-center">

              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                No events
              </p>

              <p className="mt-3 text-sm text-white/30">
                Add your first event below.
              </p>

            </div>

          ) : (

            eventList.map(
              (event) => (

                <article
                  key={event.id}
                  className="border-b border-white/[0.08] py-9"
                >

                  <div className="grid gap-7 lg:grid-cols-[60px_1fr_250px_auto] lg:items-center lg:gap-8">

                    {/* NUMBER */}

                    <div>

                      <span className="font-mono text-[11px] tracking-[0.2em] text-white/25">
                        {event.number ??
                          "--"}
                      </span>

                    </div>

                    {/* EVENT INFO */}

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400/60">
                          {event.type ??
                            "Event"}
                        </span>

                        {event.featured && (

                          <span className="border border-yellow-400/20 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.15em] text-yellow-300/60">
                            Featured
                          </span>

                        )}

                      </div>

                      <h2 className="mt-2 text-xl font-medium tracking-[-0.025em] text-white/85">
                        {event.title}
                      </h2>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
                        {event.description ??
                          "No description."}
                      </p>

                    </div>

                    {/* DATE / STATUS */}

                    <div className="space-y-3">

                      <div>

                        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
                          Date
                        </p>

                        <p className="mt-1 text-xs text-white/45">

                          {event.event_date ??
                            "Not scheduled"}

                          {event.event_end_date &&
                          event.event_end_date !==
                            event.event_date
                            ? ` → ${event.event_end_date}`
                            : ""}

                        </p>

                      </div>

                      <div>

                        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
                          Status
                        </p>

                        <span
                          className={`mt-2 inline-flex border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.15em] ${
                            event.is_published
                              ? "border-cyan-400/20 text-cyan-300/70"
                              : "border-white/10 text-white/25"
                          }`}
                        >
                          {event.is_published
                            ? "Published"
                            : "Draft"}
                        </span>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-2 lg:justify-end">

                      <a
                        href={`/admin/events?edit=${encodeURIComponent(
                          event.id
                        )}`}
                        className="inline-flex items-center gap-2 border border-white/[0.1] px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/50 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:text-cyan-300"
                      >
                        ✎ Edit
                      </a>

                      <DeleteEventButton
                        eventId={event.id}
                      />

                    </div>

                  </div>

                </article>

              )
            )

          )}

        </section>

        {/* ====================================================
            CREATE EVENT
        ==================================================== */}

        <section
          id="add-event"
          className="mt-16 border border-white/[0.08] bg-white/[0.015]"
        >

          <div className="border-b border-white/[0.07] px-6 py-5">

            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400/60">
              New Event
            </p>

            <h2 className="mt-2 text-xl font-medium text-white/80">
              Add event
            </h2>

          </div>

          <form
            action={createEvent}
            className="grid gap-5 p-6 md:grid-cols-2"
          >

            {/* NUMBER */}

            <Field
              label="Number"
              name="number"
              placeholder="01"
            />

            {/* TITLE */}

            <Field
              label="Title"
              name="title"
              placeholder="ROBOTICA Chapter 4"
              required
            />

            {/* TYPE */}

            <Field
              label="Type"
              name="type"
              placeholder="Competition / Workshop / Seminar"
            />

            {/* CHAPTER */}

            <Field
              label="Chapter"
              name="chapter"
              placeholder="Chapter 4"
            />

            {/* EVENT DATE */}

            <DateField
              label="Event Date"
              name="event_date"
            />

            {/* END DATE */}

            <DateField
              label="End Date"
              name="event_end_date"
            />

            {/* COVER */}

            <div className="md:col-span-2">

              <label className="mb-3 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                Cover Image
              </label>

              <EventImageUploader
                inputName="cover_image_url"
                pathInputName="cover_storage_path"
              />

            </div>

            {/* REGISTER */}

            <Field
              label="Registration URL"
              name="register_url"
              placeholder="https://..."
            />

            {/* RULES */}

            <Field
              label="Rules URL"
              name="rules_url"
              placeholder="https://..."
            />

            {/* DESCRIPTION */}

            <div className="md:col-span-2">

              <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                Description
              </label>

              <textarea
                name="description"
                rows={5}
                placeholder="Describe the event..."
                className="w-full resize-y border border-white/[0.1] bg-[#070707] px-3 py-3 text-sm leading-6 text-white/70 outline-none placeholder:text-white/15 focus:border-cyan-400/40"
              />

            </div>

            {/* FEATURED */}

            <label className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">

              <input
                type="checkbox"
                name="featured"
                className="h-4 w-4 accent-cyan-400"
              />

              Featured event

            </label>

            {/* PUBLISHED */}

            <label className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">

              <input
                type="checkbox"
                name="is_published"
                defaultChecked
                className="h-4 w-4 accent-cyan-400"
              />

              Publish immediately

            </label>

            {/* CREATE */}

            <div className="flex justify-end md:col-span-2">

              <button
                type="submit"
                className="bg-white px-7 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-black transition-all hover:bg-cyan-300"
              >
                Create Event
              </button>

            </div>

          </form>

        </section>

      </div>

      {/* ======================================================
          EDIT MODAL
      ====================================================== */}

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
        />
      )}

    </main>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>

      <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
        {label}
      </label>

      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full border border-white/[0.1] bg-[#070707] px-3 text-sm text-white/70 outline-none placeholder:text-white/15 focus:border-cyan-400/40"
      />

    </div>
  );
}

/* ============================================================
   DATE FIELD
============================================================ */

function DateField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <div>

      <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
        {label}
      </label>

      <input
        type="date"
        name={name}
        defaultValue={defaultValue}
        className="h-11 w-full border border-white/[0.1] bg-[#070707] px-3 text-sm text-white/70 outline-none focus:border-cyan-400/40"
      />

    </div>
  );
}