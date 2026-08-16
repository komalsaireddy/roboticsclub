import { redirect } from "next/navigation";

import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import AccessDenied from "@/components/admin/AccessDenied";

import {
  createUpdate,
  updateUpdate,
  deleteUpdate,
} from "./actions";

export default async function AdminUpdatesPage() {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    data: allowed,
    error: permissionError,
  } = await supabase.rpc(
    "has_permission",
    {
      perm: "manage_updates",
    }
  );

  if (permissionError || !allowed) {
    return <AccessDenied />;
  }

  const {
    data: updates,
    error,
  } = await supabase
    .from("updates")
    .select(`
      id,
      date_label,
      category,
      title,
      description,
      featured,
      is_published,
      created_at
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to load updates:",
      error
    );
  }

  const updateList =
    updates ?? [];

  return (
    <main className="min-h-screen bg-[#030303] text-white">

      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6 lg:px-10">

          <div className="flex items-center gap-4">

            <div className="h-10 w-10 overflow-hidden rounded-full border border-white/[0.12]">
              <img
                src="/robotics-club-logo.jpg"
                alt="Robotics Club GCET"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/80">
                Robotics Club
              </p>

              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-white/25">
                Updates / Management
              </p>
            </div>

          </div>

          <a
            href="/admin"
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 hover:text-cyan-300"
          >
            ← Dashboard
          </a>

        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 py-10 lg:px-10">

        <div className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/60">
            Content
          </p>

          <h1 className="mt-2 text-4xl font-semibold">
            Updates
          </h1>

          <p className="mt-3 text-sm text-white/35">
            Publish announcements and club updates.
          </p>
        </div>

        {/* CREATE */}

        <section className="mb-10 border border-white/[0.08] p-6">

          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400/60">
            New Update
          </p>

          <form
            action={createUpdate}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >

            <Field
              label="Date"
              name="date_label"
              placeholder="17 AUG 2026"
            />

            <Field
              label="Category"
              name="category"
              placeholder="Announcement"
              required
            />

            <div className="md:col-span-2">
              <Field
                label="Title"
                name="title"
                placeholder="Update title"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                Description
              </label>

              <textarea
                name="description"
                rows={5}
                className="w-full resize-y border border-white/[0.1] bg-[#050505] px-3 py-3 text-sm text-white/70 outline-none focus:border-cyan-400/40"
              />
            </div>

            <label className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
              <input
                type="checkbox"
                name="featured"
                className="h-4 w-4 accent-cyan-400"
              />
              Featured
            </label>

            <label className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked
                className="h-4 w-4 accent-cyan-400"
              />
              Published
            </label>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-white px-7 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-black hover:bg-cyan-300"
              >
                Add Update
              </button>
            </div>

          </form>

        </section>

        {/* LIST */}

        <section className="border border-white/[0.08]">

          <div className="border-b border-white/[0.08] px-6 py-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
              {updateList.length} Updates
            </p>
          </div>

          <div className="divide-y divide-white/[0.06]">

            {updateList.map((item) => (
              <div
                key={item.id}
                className="p-6"
              >

                <form
                  action={updateUpdate}
                  className="grid gap-5 md:grid-cols-2"
                >

                  <input
                    type="hidden"
                    name="id"
                    value={item.id}
                  />

                  <Field
                    label="Date"
                    name="date_label"
                    defaultValue={
                      item.date_label ?? ""
                    }
                  />

                  <Field
                    label="Category"
                    name="category"
                    defaultValue={
                      item.category
                    }
                    required
                  />

                  <div className="md:col-span-2">
                    <Field
                      label="Title"
                      name="title"
                      defaultValue={
                        item.title
                      }
                      required
                    />
                  </div>

                  <div className="md:col-span-2">

                    <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                      Description
                    </label>

                    <textarea
                      name="description"
                      defaultValue={
                        item.description ?? ""
                      }
                      rows={4}
                      className="w-full resize-y border border-white/[0.1] bg-[#050505] px-3 py-3 text-sm text-white/70 outline-none focus:border-cyan-400/40"
                    />

                  </div>

                  <label className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
                    <input
                      type="checkbox"
                      name="featured"
                      defaultChecked={
                        item.featured
                      }
                      className="h-4 w-4 accent-cyan-400"
                    />
                    Featured
                  </label>

                  <label className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">
                    <input
                      type="checkbox"
                      name="is_published"
                      defaultChecked={
                        item.is_published
                      }
                      className="h-4 w-4 accent-cyan-400"
                    />
                    Published
                  </label>

                  <div className="flex gap-3 md:col-span-2">

                    <button
                      type="submit"
                      className="bg-white px-6 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-black hover:bg-cyan-300"
                    >
                      Save Changes
                    </button>

                  </div>

                </form>

                <form
                  action={deleteUpdate}
                  className="mt-3"
                >

                  <input
                    type="hidden"
                    name="id"
                    value={item.id}
                  />

                  <button
                    type="submit"
                    className="border border-red-400/20 px-5 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-red-300/60 hover:border-red-400/40 hover:text-red-300"
                  >
                    Delete Update
                  </button>

                </form>

              </div>
            ))}

            {updateList.length === 0 && (
              <div className="p-12 text-center text-white/25">
                No updates yet.
              </div>
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

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
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none placeholder:text-white/10 focus:border-cyan-400/40"
      />
    </div>
  );
}
