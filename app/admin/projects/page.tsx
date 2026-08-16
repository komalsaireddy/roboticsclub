import { redirect } from "next/navigation";
import ProjectCreateImageClient from "@/components/admin/ProjectCreateImageClient";
import {
  createSupabaseServerClient,
} from "@/lib/supabase/server";

import AccessDenied from "@/components/admin/AccessDenied";
import EditProjectModal from "@/components/admin/EditProjectModal";

import {
  createProject,
  deleteProject,
} from "./actions";

interface PageProps {
  searchParams: Promise<{
    edit?: string;
  }>;
}

export default async function AdminProjectsPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const editId =
    params.edit;

  const supabase =
    await createSupabaseServerClient();

  /* ==========================================================
     AUTHENTICATION
  ========================================================== */

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  /* ==========================================================
     PERMISSION
  ========================================================== */

  const {
    data: allowed,
    error:
      permissionError,
  } =
    await supabase.rpc(
      "has_permission",
      {
        perm: "manage_projects",
      }
    );

  if (
    permissionError ||
    !allowed
  ) {
    return <AccessDenied />;
  }

  /* ==========================================================
     LOAD PROJECTS
  ========================================================== */

  const {
    data: projects,
    error:
      projectsError,
  } =
    await supabase
      .from("projects")
      .select(`
        id,
        number,
        title,
        description,
        category,
        image_url,
        image_storage_path,
        document_url,
        document_status,
        is_published,
        sort_order,
        created_at
      `)
      .order(
        "sort_order",
        {
          ascending: true,
        }
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  const projectList =
    projects ?? [];

  /* ==========================================================
     EDITING
  ========================================================== */

  const editingProject =
    editId
      ? projectList.find(
          (project) =>
            project.id ===
            editId
        )
      : null;

  /* ==========================================================
     PAGE
  ========================================================== */

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
                Projects / Management
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

        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

          <div>

            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/70">
              Content Management
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Projects
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/35">
              Manage the projects
              displayed on the
              public Robotics
              Club website.
            </p>

          </div>

          <a
            href="#add-project"
            className="inline-flex h-11 items-center justify-center border border-white/[0.1] bg-white px-6 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-black transition-all hover:bg-cyan-300"
          >
            + Add Project
          </a>

        </div>

        {/* DATABASE ERROR */}

        {projectsError && (

          <div className="mb-8 border border-red-400/20 bg-red-400/[0.04] p-4">

            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-red-300/60">
              Database Error
            </p>

            <p className="mt-2 text-sm text-red-300">
              {projectsError.message}
            </p>

          </div>

        )}

        {/* ====================================================
            PROJECT LIST
        ==================================================== */}

        <section className="border-t border-white/[0.08]">

          {projectList.length ===
          0 ? (

            <div className="border-b border-white/[0.08] py-20 text-center">

              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
                No projects
              </p>

              <p className="mt-3 text-sm text-white/30">
                Add your first
                project below.
              </p>

            </div>

          ) : (

            projectList.map(
              (project) => (

                <article
                  key={
                    project.id
                  }
                  className="border-b border-white/[0.08] py-9"
                >

                  <div className="grid gap-7 lg:grid-cols-[60px_1fr_220px_auto] lg:items-center lg:gap-8">

                    {/* NUMBER */}

                    <div>

                      <span className="font-mono text-[11px] tracking-[0.2em] text-white/25">
                        {project.number ??
                          "--"}
                      </span>

                    </div>

                    {/* INFO */}

                    <div>

                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400/60">
                        {project.category ??
                          "Uncategorized"}
                      </span>

                      <h2 className="mt-2 text-xl font-medium tracking-[-0.025em] text-white/85">
                        {project.title}
                      </h2>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
                        {project.description ??
                          "No description."}
                      </p>

                    </div>

                    {/* STATUS */}

                    <div className="space-y-3">

                      <div>

                        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
                          Status
                        </p>

                        <span
                          className={`mt-2 inline-flex border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.15em] ${
                            project.is_published
                              ? "border-cyan-400/20 text-cyan-300/70"
                              : "border-white/10 text-white/25"
                          }`}
                        >
                          {project.is_published
                            ? "Published"
                            : "Draft"}
                        </span>

                      </div>

                      <div>

                        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
                          Documentation
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          {project.document_status ??
                            "Unknown"}
                        </p>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-2 lg:justify-end">

                      <a
                        href={`/admin/projects?edit=${project.id}`}
                        className="inline-flex items-center gap-2 border border-white/[0.1] px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/50 transition-all hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:text-cyan-300"
                      >
                        ✎ Edit
                      </a>

                      <form
                        action={
                          deleteProject
                        }
                      >

                        <input
                          type="hidden"
                          name="id"
                          value={
                            project.id
                          }
                        />

                        <button
                          type="submit"
                          className="border border-red-400/10 px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-red-300/40 transition-all hover:border-red-400/30 hover:bg-red-400/[0.04] hover:text-red-300"
                        >
                          Delete
                        </button>

                      </form>

                    </div>

                  </div>

                </article>

              )
            )

          )}

        </section>

        {/* ====================================================
            ADD PROJECT
        ==================================================== */}

        <section
          id="add-project"
          className="mt-16 border border-white/[0.08] bg-white/[0.015]"
        >

          <div className="border-b border-white/[0.07] px-6 py-5">

            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-400/60">
              New Project
            </p>

            <h2 className="mt-2 text-xl font-medium text-white/80">
              Add project
            </h2>

          </div>

          <form
            action={
              createProject
            }
            className="grid gap-5 p-6 md:grid-cols-2"
          >

            <Field
              label="Number"
              name="number"
              placeholder="07"
            />

            <Field
              label="Title"
              name="title"
              placeholder="Project title"
              required
            />

            <Field
              label="Category"
              name="category"
              placeholder="Mobile Robotics"
            />

            {/* ==================================================
                IMAGE UPLOAD
            ================================================== */}

            <div className="md:col-span-2">

              <label className="mb-3 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                Project Image
              </label>

              <ProjectCreateImageClient />

            </div>

            <Field
              label="Documentation URL"
              name="document_url"
              placeholder="/documents/projects/example.pdf"
            />

            {/* DOCUMENT STATUS */}

            <div>

              <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                Document Status
              </label>

              <select
                name="document_status"
                defaultValue="available"
                className="h-11 w-full border border-white/[0.1] bg-[#070707] px-3 text-sm text-white/70 outline-none focus:border-cyan-400/40"
              >

                <option value="available">
                  Available
                </option>

                <option value="document-missing">
                  Document Missing
                </option>

              </select>

            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">

              <label className="mb-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                Description
              </label>

              <textarea
                name="description"
                rows={5}
                placeholder="Describe the project..."
                className="w-full resize-y border border-white/[0.1] bg-[#070707] px-3 py-3 text-sm leading-6 text-white/70 outline-none placeholder:text-white/15 focus:border-cyan-400/40"
              />

            </div>

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

            <div className="flex justify-end">

              <button
                type="submit"
                className="bg-white px-7 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-black transition-all hover:bg-cyan-300"
              >
                Create Project
              </button>

            </div>

          </form>

        </section>

      </div>

      {/* ======================================================
          EDIT MODAL
      ====================================================== */}

      {editingProject && (

        <EditProjectModal
          project={{
            id:
              editingProject.id,

            number:
              editingProject.number,

            title:
              editingProject.title,

            description:
              editingProject.description,

            category:
              editingProject.category,

            image_url:
              editingProject.image_url,

            image_storage_path:
              editingProject.image_storage_path,

            document_url:
              editingProject.document_url,

            document_status:
              editingProject.document_status,

            is_published:
              editingProject.is_published,
          }}
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
        defaultValue={
          defaultValue
        }
        placeholder={
          placeholder
        }
        required={
          required
        }
        className="h-11 w-full border border-white/[0.1] bg-[#050505] px-3 text-sm text-white/70 outline-none placeholder:text-white/15 focus:border-cyan-400/40"
      />

    </div>
  );
}