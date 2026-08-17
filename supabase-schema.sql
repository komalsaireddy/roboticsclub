-- ============================================================
-- ROBOTICS CLUB GCET
-- SUPABASE DATABASE SCHEMA
-- ============================================================

create extension if not exists "pgcrypto";


-- ============================================================
-- 1. ROLES
-- ============================================================

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  rank integer not null,
  color text default '#e24b4a',
  created_at timestamptz not null default now()
);


-- ============================================================
-- 2. PERMISSIONS
-- ============================================================

create table if not exists public.permissions (
  key text primary key,
  description text
);


-- ============================================================
-- 3. ROLE PERMISSIONS
-- ============================================================

create table if not exists public.role_permissions (
  role_id uuid not null
    references public.roles(id)
    on delete cascade,

  permission_key text not null
    references public.permissions(key)
    on delete cascade,

  primary key (role_id, permission_key)
);


-- ============================================================
-- 4. PROFILES
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key
    references auth.users(id)
    on delete cascade,

  full_name text,
  avatar_url text,

  role_id uuid
    references public.roles(id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ============================================================
-- 5. PERMISSIONS SEED
-- ============================================================

insert into public.permissions (key, description)
values
  (
    'manage_events',
    'Create, edit, delete and publish events'
  ),
  (
    'manage_team',
    'Create, edit, delete and publish team members'
  ),
  (
    'manage_gallery',
    'Upload, edit and remove gallery images'
  ),
  (
    'manage_projects',
    'Create, edit, delete and publish projects'
  ),
  (
    'manage_updates',
    'Create, edit, delete and publish website updates'
  ),
  (
    'manage_members',
    'Manage admin users and assign roles'
  ),
  (
    'manage_roles',
    'Create and manage roles and permissions'
  ),
  (
    'manage_website',
    'Full website administration'
  )
on conflict (key) do nothing;


-- ============================================================
-- 6. ROLES SEED
-- ============================================================

insert into public.roles (name, rank, color)
values
  ('Owner', 100, '#e24b4a'),
  ('Admin', 80, '#378add'),
  ('Event Manager', 50, '#ef9f27'),
  ('Content Editor', 30, '#639922'),
  ('Member', 10, '#888780')
on conflict (name) do nothing;


-- ============================================================
-- 7. ROLE PERMISSIONS
-- ============================================================

-- OWNER: EVERYTHING

insert into public.role_permissions (role_id, permission_key)
select
  r.id,
  p.key
from public.roles r
cross join public.permissions p
where r.name = 'Owner'
on conflict do nothing;


-- ADMIN: EVERYTHING EXCEPT ROLE MANAGEMENT

insert into public.role_permissions (role_id, permission_key)
select
  r.id,
  p.key
from public.roles r
cross join public.permissions p
where r.name = 'Admin'
  and p.key <> 'manage_roles'
on conflict do nothing;


-- EVENT MANAGER

insert into public.role_permissions (role_id, permission_key)
select
  r.id,
  'manage_events'
from public.roles r
where r.name = 'Event Manager'
on conflict do nothing;


-- CONTENT EDITOR

insert into public.role_permissions (role_id, permission_key)
select
  r.id,
  p.key
from public.roles r
cross join public.permissions p
where r.name = 'Content Editor'
  and p.key in (
    'manage_gallery',
    'manage_projects',
    'manage_team',
    'manage_updates'
  )
on conflict do nothing;


-- ============================================================
-- 8. PERMISSION HELPER
-- ============================================================

-- IMPORTANT:
-- Keep the parameter name "perm".
-- Your existing Supabase function uses this name.
-- Do NOT drop this function because existing RLS policies
-- depend on it.

create or replace function public.has_permission(
  perm text
)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join public.role_permissions rp
      on rp.role_id = p.role_id
    where p.id = auth.uid()
      and rp.permission_key = perm
  );
$$;


-- ============================================================
-- 9. PROJECTS
-- ============================================================

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),

  number text,

  title text not null,

  description text,

  category text,

  image_url text,

  document_url text,

  document_status text not null default 'available'
    check (
      document_status in (
        'available',
        'document-missing'
      )
    ),

  sort_order integer not null default 0,

  is_published boolean not null default true,

  created_by uuid
    references public.profiles(id)
    on delete set null,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- 10. EVENTS
-- ============================================================

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),

  slug text unique not null,

  number text,

  title text not null,

  type text,

  chapter text,

  description text,

  cover_image_url text,

  rules_url text,

  event_date date,

  event_end_date date,

  register_url text,

  featured boolean not null default false,

  is_published boolean not null default false,

  created_by uuid
    references public.profiles(id)
    on delete set null,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- 11. TEAM MEMBERS
-- ============================================================

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),

  year text not null,

  name text not null,

  position text not null,

  category text not null default 'student'
    check (
      category in (
        'student',
        'faculty'
      )
    ),

  photo_url text,

  linkedin_url text,

  instagram_url text,

  github_url text,

  email text,

  sort_order integer not null default 0,

  is_published boolean not null default true,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- 12. GALLERY
-- ============================================================

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),

  image_url text not null,

  caption text,

  alt_text text,

  event_id uuid
    references public.events(id)
    on delete set null,

  sort_order integer not null default 0,

  is_published boolean not null default true,

  created_by uuid
    references public.profiles(id)
    on delete set null,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- 13. UPDATES
-- ============================================================

create table if not exists public.updates (
  id uuid primary key default gen_random_uuid(),

  date_label text not null,

  category text not null,

  title text not null,

  description text,

  featured boolean not null default false,

  is_published boolean not null default true,

  created_by uuid
    references public.profiles(id)
    on delete set null,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- ============================================================
-- 14. UPDATED AT FUNCTION
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- 15. UPDATED AT TRIGGERS
-- ============================================================

drop trigger if exists projects_updated_at
on public.projects;

create trigger projects_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();


drop trigger if exists events_updated_at
on public.events;

create trigger events_updated_at
before update on public.events
for each row
execute function public.set_updated_at();


drop trigger if exists team_members_updated_at
on public.team_members;

create trigger team_members_updated_at
before update on public.team_members
for each row
execute function public.set_updated_at();


drop trigger if exists gallery_images_updated_at
on public.gallery_images;

create trigger gallery_images_updated_at
before update on public.gallery_images
for each row
execute function public.set_updated_at();


drop trigger if exists updates_updated_at
on public.updates;

create trigger updates_updated_at
before update on public.updates
for each row
execute function public.set_updated_at();


drop trigger if exists profiles_updated_at
on public.profiles;

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();



-- ============================================================
-- 16. UPGRADE EXISTING TABLES
-- ============================================================
--
-- IMPORTANT:
-- CREATE TABLE IF NOT EXISTS does not add columns to an
-- existing table. These ALTER statements make the schema
-- compatible with tables created by earlier versions.
-- ============================================================


-- ------------------------------------------------------------
-- PROJECTS
-- ------------------------------------------------------------

alter table public.projects
  add column if not exists number text;

alter table public.projects
  add column if not exists category text;

alter table public.projects
  add column if not exists image_url text;

alter table public.projects
  add column if not exists document_url text;

alter table public.projects
  add column if not exists document_status text
    default 'available';

alter table public.projects
  add column if not exists sort_order integer
    default 0;

alter table public.projects
  add column if not exists is_published boolean
    default true;

alter table public.projects
  add column if not exists created_by uuid;

alter table public.projects
  add column if not exists updated_at timestamptz
    default now();


-- ------------------------------------------------------------
-- EVENTS
-- ------------------------------------------------------------

alter table public.events
  add column if not exists number text;

alter table public.events
  add column if not exists type text;

alter table public.events
  add column if not exists chapter text;

alter table public.events
  add column if not exists cover_image_url text;

alter table public.events
  add column if not exists rules_url text;

alter table public.events
  add column if not exists event_date date;

alter table public.events
  add column if not exists event_end_date date;

alter table public.events
  add column if not exists register_url text;

alter table public.events
  add column if not exists featured boolean
    default false;

alter table public.events
  add column if not exists is_published boolean
    default false;

alter table public.events
  add column if not exists created_by uuid;

alter table public.events
  add column if not exists updated_at timestamptz
    default now();


-- ------------------------------------------------------------
-- TEAM MEMBERS
-- ------------------------------------------------------------

alter table public.team_members
  add column if not exists category text
    default 'student';

alter table public.team_members
  add column if not exists photo_url text;

alter table public.team_members
  add column if not exists linkedin_url text;

alter table public.team_members
  add column if not exists instagram_url text;

alter table public.team_members
  add column if not exists github_url text;

alter table public.team_members
  add column if not exists email text;

alter table public.team_members
  add column if not exists sort_order integer
    default 0;

alter table public.team_members
  add column if not exists is_published boolean
    default true;

alter table public.team_members
  add column if not exists updated_at timestamptz
    default now();


-- ------------------------------------------------------------
-- GALLERY
-- ------------------------------------------------------------

alter table public.gallery_images
  add column if not exists caption text;

alter table public.gallery_images
  add column if not exists alt_text text;

alter table public.gallery_images
  add column if not exists event_id uuid;

alter table public.gallery_images
  add column if not exists sort_order integer
    default 0;

alter table public.gallery_images
  add column if not exists is_published boolean
    default true;

alter table public.gallery_images
  add column if not exists created_by uuid;

alter table public.gallery_images
  add column if not exists updated_at timestamptz
    default now();


-- ------------------------------------------------------------
-- UPDATES
-- ------------------------------------------------------------

alter table public.updates
  add column if not exists date_label text;

alter table public.updates
  add column if not exists category text;

alter table public.updates
  add column if not exists title text;

alter table public.updates
  add column if not exists description text;

alter table public.updates
  add column if not exists featured boolean
    default false;

alter table public.updates
  add column if not exists is_published boolean
    default true;

alter table public.updates
  add column if not exists created_by uuid;

alter table public.updates
  add column if not exists updated_at timestamptz
    default now();


-- ------------------------------------------------------------
-- PROFILES
-- ------------------------------------------------------------

alter table public.profiles
  add column if not exists updated_at timestamptz
    default now();


-- ============================================================
-- 17. BACKFILL NULL VALUES
-- ============================================================

update public.projects
set
  sort_order = 0
where sort_order is null;

update public.projects
set
  is_published = true
where is_published is null;

update public.projects
set
  document_status = 'available'
where document_status is null;


update public.events
set
  featured = false
where featured is null;

update public.events
set
  is_published = false
where is_published is null;


update public.team_members
set
  category = 'student'
where category is null;

update public.team_members
set
  sort_order = 0
where sort_order is null;

update public.team_members
set
  is_published = true
where is_published is null;


update public.gallery_images
set
  sort_order = 0
where sort_order is null;

update public.gallery_images
set
  is_published = true
where is_published is null;


update public.updates
set
  is_published = true
where is_published is null;

update public.updates
set
  featured = false
where featured is null;


-- ============================================================
-- 18. SET DEFAULTS
-- ============================================================

alter table public.projects
  alter column sort_order set default 0;

alter table public.projects
  alter column is_published set default true;

alter table public.projects
  alter column document_status set default 'available';


alter table public.events
  alter column featured set default false;

alter table public.events
  alter column is_published set default false;


alter table public.team_members
  alter column category set default 'student';

alter table public.team_members
  alter column sort_order set default 0;

alter table public.team_members
  alter column is_published set default true;


alter table public.gallery_images
  alter column sort_order set default 0;

alter table public.gallery_images
  alter column is_published set default true;


alter table public.updates
  alter column featured set default false;

alter table public.updates
  alter column is_published set default true;


-- ============================================================
-- 19. INDEXES
-- ============================================================

create index if not exists projects_published_idx
on public.projects(is_published);

create index if not exists projects_sort_idx
on public.projects(sort_order);


create index if not exists events_published_idx
on public.events(is_published);

create index if not exists events_featured_idx
on public.events(featured);

create index if not exists events_date_idx
on public.events(event_date);


create index if not exists team_year_idx
on public.team_members(year);

create index if not exists team_sort_idx
on public.team_members(sort_order);

create index if not exists team_published_idx
on public.team_members(is_published);


create index if not exists gallery_event_idx
on public.gallery_images(event_id);

create index if not exists gallery_sort_idx
on public.gallery_images(sort_order);

create index if not exists gallery_published_idx
on public.gallery_images(is_published);


create index if not exists updates_published_idx
on public.updates(is_published);

create index if not exists updates_featured_idx
on public.updates(featured);

create index if not exists updates_created_idx
on public.updates(created_at desc);


-- ============================================================
-- 17. ROW LEVEL SECURITY
-- ============================================================

alter table public.roles enable row level security;

alter table public.permissions enable row level security;

alter table public.role_permissions enable row level security;

alter table public.profiles enable row level security;

alter table public.projects enable row level security;

alter table public.events enable row level security;

alter table public.team_members enable row level security;

alter table public.gallery_images enable row level security;

alter table public.updates enable row level security;


-- ============================================================
-- 18. PUBLIC PROJECTS
-- ============================================================

drop policy if exists "Public can read published projects"
on public.projects;

create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (
  is_published = true
);


-- ============================================================
-- 19. PUBLIC EVENTS
-- ============================================================

drop policy if exists "Public can read published events"
on public.events;

create policy "Public can read published events"
on public.events
for select
to anon, authenticated
using (
  is_published = true
);


-- ============================================================
-- 20. PUBLIC TEAM
-- ============================================================

drop policy if exists "Public can read published team"
on public.team_members;

create policy "Public can read published team"
on public.team_members
for select
to anon, authenticated
using (
  is_published = true
);


-- ============================================================
-- 21. PUBLIC GALLERY
-- ============================================================

drop policy if exists "Public can read published gallery"
on public.gallery_images;

create policy "Public can read published gallery"
on public.gallery_images
for select
to anon, authenticated
using (
  is_published = true
);


-- ============================================================
-- 22. PUBLIC UPDATES
-- ============================================================

drop policy if exists "Public can read published updates"
on public.updates;

create policy "Public can read published updates"
on public.updates
for select
to anon, authenticated
using (
  is_published = true
);


-- ============================================================
-- 23. ADMIN PROJECTS
-- ============================================================

drop policy if exists "Manage projects"
on public.projects;

create policy "Manage projects"
on public.projects
for all
to authenticated
using (
  public.has_permission('manage_projects')
)
with check (
  public.has_permission('manage_projects')
);


-- ============================================================
-- 24. ADMIN EVENTS
-- ============================================================

drop policy if exists "Manage events"
on public.events;

create policy "Manage events"
on public.events
for all
to authenticated
using (
  public.has_permission('manage_events')
)
with check (
  public.has_permission('manage_events')
);


-- ============================================================
-- 25. ADMIN TEAM
-- ============================================================

drop policy if exists "Manage team"
on public.team_members;

create policy "Manage team"
on public.team_members
for all
to authenticated
using (
  public.has_permission('manage_team')
)
with check (
  public.has_permission('manage_team')
);


-- ============================================================
-- 26. ADMIN GALLERY
-- ============================================================

drop policy if exists "Manage gallery"
on public.gallery_images;

create policy "Manage gallery"
on public.gallery_images
for all
to authenticated
using (
  public.has_permission('manage_gallery')
)
with check (
  public.has_permission('manage_gallery')
);


-- ============================================================
-- 27. ADMIN UPDATES
-- ============================================================

drop policy if exists "Manage updates"
on public.updates;

create policy "Manage updates"
on public.updates
for all
to authenticated
using (
  public.has_permission('manage_updates')
)
with check (
  public.has_permission('manage_updates')
);


-- ============================================================
-- 28. PROFILE READ
-- ============================================================

drop policy if exists "Users can read own profile"
on public.profiles;

create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (
  auth.uid() = id
  or public.has_permission('manage_members')
);


-- ============================================================
-- 29. PROFILE UPDATE
-- ============================================================

drop policy if exists "Users can update own profile"
on public.profiles;

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (
  auth.uid() = id
)
with check (
  auth.uid() = id
);


-- ============================================================
-- 30. ADMIN PROFILES
-- ============================================================

drop policy if exists "Admins can manage profiles"
on public.profiles;

create policy "Admins can manage profiles"
on public.profiles
for all
to authenticated
using (
  public.has_permission('manage_members')
)
with check (
  public.has_permission('manage_members')
);


-- ============================================================
-- 31. ROLE READ
-- ============================================================

drop policy if exists "Authenticated users can read roles"
on public.roles;

create policy "Authenticated users can read roles"
on public.roles
for select
to authenticated
using (true);


-- ============================================================
-- 32. PERMISSION READ
-- ============================================================

drop policy if exists "Authenticated users can read permissions"
on public.permissions;

create policy "Authenticated users can read permissions"
on public.permissions
for select
to authenticated
using (true);


-- ============================================================
-- 33. ROLE PERMISSION READ
-- ============================================================

drop policy if exists "Authenticated users can read role permissions"
on public.role_permissions;

create policy "Authenticated users can read role permissions"
on public.role_permissions
for select
to authenticated
using (true);


-- ============================================================
-- 34. MANAGE ROLES
-- ============================================================

drop policy if exists "Manage roles"
on public.roles;

create policy "Manage roles"
on public.roles
for all
to authenticated
using (
  public.has_permission('manage_roles')
)
with check (
  public.has_permission('manage_roles')
);


-- ============================================================
-- 35. MANAGE ROLE PERMISSIONS
-- ============================================================

drop policy if exists "Manage role permissions"
on public.role_permissions;

create policy "Manage role permissions"
on public.role_permissions
for all
to authenticated
using (
  public.has_permission('manage_roles')
)
with check (
  public.has_permission('manage_roles')
);


-- ============================================================
-- 36. STORAGE BUCKETS
-- ============================================================

insert into storage.buckets (
  id,
  name,
  public
)
values
  ('project-images', 'project-images', true),
  ('event-images', 'event-images', true),
  ('gallery', 'gallery', true),
  ('team', 'team', true),
  ('documents', 'documents', true)
on conflict (id) do nothing;


-- ============================================================
-- 37. PUBLIC STORAGE READ
-- ============================================================

drop policy if exists "Public can read project images"
on storage.objects;

create policy "Public can read project images"
on storage.objects
for select
to public
using (
  bucket_id = 'project-images'
);


drop policy if exists "Public can read event images"
on storage.objects;

create policy "Public can read event images"
on storage.objects
for select
to public
using (
  bucket_id = 'event-images'
);


drop policy if exists "Public can read gallery"
on storage.objects;

create policy "Public can read gallery"
on storage.objects
for select
to public
using (
  bucket_id = 'gallery'
);


drop policy if exists "Public can read team"
on storage.objects;

create policy "Public can read team"
on storage.objects
for select
to public
using (
  bucket_id = 'team'
);


drop policy if exists "Public can read documents"
on storage.objects;

create policy "Public can read documents"
on storage.objects
for select
to public
using (
  bucket_id = 'documents'
);


-- ============================================================
-- 38. PROJECT IMAGE UPLOAD
-- ============================================================

drop policy if exists "Admins upload project images"
on storage.objects;

create policy "Admins upload project images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'project-images'
  and public.has_permission('manage_projects')
);


drop policy if exists "Admins update project images"
on storage.objects;

create policy "Admins update project images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'project-images'
  and public.has_permission('manage_projects')
)
with check (
  bucket_id = 'project-images'
  and public.has_permission('manage_projects')
);


drop policy if exists "Admins delete project images"
on storage.objects;

create policy "Admins delete project images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'project-images'
  and public.has_permission('manage_projects')
);


-- ============================================================
-- 39. EVENT IMAGE UPLOAD
-- ============================================================

drop policy if exists "Admins upload event images"
on storage.objects;

create policy "Admins upload event images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'event-images'
  and public.has_permission('manage_events')
);


-- ============================================================
-- 40. GALLERY UPLOAD
-- ============================================================

drop policy if exists "Admins upload gallery"
on storage.objects;

create policy "Admins upload gallery"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'gallery'
  and public.has_permission('manage_gallery')
);


drop policy if exists "Admins delete gallery"
on storage.objects;

create policy "Admins delete gallery"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'gallery'
  and public.has_permission('manage_gallery')
);


-- ============================================================
-- 41. TEAM UPLOAD
-- ============================================================

drop policy if exists "Admins upload team"
on storage.objects;

create policy "Admins upload team"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'team'
  and public.has_permission('manage_team')
);


drop policy if exists "Admins delete team"
on storage.objects;

create policy "Admins delete team"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'team'
  and public.has_permission('manage_team')
);


-- ============================================================
-- 42. DOCUMENT UPLOAD
-- ============================================================

drop policy if exists "Admins upload documents"
on storage.objects;

create policy "Admins upload documents"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'documents'
  and (
    public.has_permission('manage_projects')
    or public.has_permission('manage_events')
    or public.has_permission('manage_website')
  )
);


drop policy if exists "Admins delete documents"
on storage.objects;

create policy "Admins delete documents"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'documents'
  and (
    public.has_permission('manage_projects')
    or public.has_permission('manage_events')
    or public.has_permission('manage_website')
  )
);


-- ============================================================
-- COMPLETE
-- ============================================================