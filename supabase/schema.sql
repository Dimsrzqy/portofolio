-- ==============================================================================
-- PERSONAL PORTFOLIO DATABASE SCHEMA & POLICIES (FULL SCRIPT)
-- Target: Supabase (PostgreSQL)
-- Aman dijalankan berulang kali (Idempotent / Drop If Exists)
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. CREATE TABLES
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  content text,
  tech_stack text[] not null default '{}',
  image_url text not null,
  demo_url text,
  github_url text,
  featured boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.projects enable row level security;
alter table public.messages enable row level security;

-- 4. POLICIES FOR 'projects' TABLE
drop policy if exists "Public can view published projects" on public.projects;
create policy "Public can view published projects"
  on public.projects
  for select
  using (is_published = true);

drop policy if exists "Authenticated users can view all projects" on public.projects;
create policy "Authenticated users can view all projects"
  on public.projects
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can insert projects" on public.projects;
create policy "Authenticated users can insert projects"
  on public.projects
  for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update projects" on public.projects;
create policy "Authenticated users can update projects"
  on public.projects
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete projects" on public.projects;
create policy "Authenticated users can delete projects"
  on public.projects
  for delete
  to authenticated
  using (true);

-- 5. POLICIES FOR 'messages' TABLE
drop policy if exists "Public can insert contact messages" on public.messages;
create policy "Public can insert contact messages"
  on public.messages
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated users can view messages" on public.messages;
create policy "Authenticated users can view messages"
  on public.messages
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can delete messages" on public.messages;
create policy "Authenticated users can delete messages"
  on public.messages
  for delete
  to authenticated
  using (true);

-- 6. STORAGE BUCKETS SETUP & COMPLETE STORAGE POLICIES
-- Pastikan bucket storage terdaftar dan berstatus publik
insert into storage.buckets (id, name, public)
values 
  ('project-images', 'project-images', true),
  ('files', 'files', true),
  ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

-- Bersihkan policy storage lama jika ada untuk mencegah konflik nama
drop policy if exists "Public can view project images" on storage.objects;
drop policy if exists "Authenticated users can upload project images" on storage.objects;
drop policy if exists "Authenticated users can update project images" on storage.objects;
drop policy if exists "Authenticated users can delete project images" on storage.objects;

drop policy if exists "Public can view files" on storage.objects;
drop policy if exists "Authenticated users can upload files" on storage.objects;
drop policy if exists "Authenticated users can update files" on storage.objects;
drop policy if exists "Authenticated users can delete files" on storage.objects;

drop policy if exists "Allow public select on portfolio buckets" on storage.objects;
drop policy if exists "Allow upload on portfolio buckets" on storage.objects;
drop policy if exists "Allow update on portfolio buckets" on storage.objects;
drop policy if exists "Allow delete on portfolio buckets" on storage.objects;

-- 6.1. SELECT (Public read access untuk semua bucket portfolio)
create policy "Allow public select on portfolio buckets"
  on storage.objects
  for select
  using (bucket_id in ('project-images', 'files', 'portfolio-assets'));

-- 6.2. INSERT (Upload file untuk anon & authenticated)
create policy "Allow upload on portfolio buckets"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id in ('project-images', 'files', 'portfolio-assets'));

-- 6.3. UPDATE (Ganti / Upsert file)
create policy "Allow update on portfolio buckets"
  on storage.objects
  for update
  to anon, authenticated
  using (bucket_id in ('project-images', 'files', 'portfolio-assets'))
  with check (bucket_id in ('project-images', 'files', 'portfolio-assets'));

-- 6.4. DELETE (Hapus foto lama untuk hemat storage)
create policy "Allow delete on portfolio buckets"
  on storage.objects
  for delete
  to anon, authenticated
  using (bucket_id in ('project-images', 'files', 'portfolio-assets'));

-- 7. INITIAL SAMPLE SEED DATA
insert into public.projects (title, slug, description, content, tech_stack, image_url, demo_url, github_url, featured, is_published, sort_order)
values
(
  'Aetheria — Cloud Operations Platform',
  'aetheria-cloud-platform',
  'A high-throughput dashboard designed for distributed infrastructure monitoring, real-time metrics streaming, and multi-tenant team management.',
  '### Overview\nAetheria is an engineering-first dashboard engineered for software reliability teams. It delivers live cluster diagnostics, latency heatmaps, and customizable alerting policies with zero layout shifts.\n\n### Key Highlights\n- **Real-Time Telemetry:** Powered by Supabase Realtime subscriptions and lightweight WebSockets.\n- **Micro-Interactions:** Custom subtle gestures and transitions built with Framer Motion.\n- **Enterprise Access Control:** Granular Row Level Security (RLS) guaranteeing per-tenant data isolation.',
  array['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Framer Motion'],
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  'https://demo.example.com/aetheria',
  'https://github.com/example/aetheria',
  true,
  true,
  1
),
(
  'Polije Student Resource Hub',
  'polije-student-resource-hub',
  'An integrated web portal for Informatics Management students featuring academic schedules, resource sharing, and lab reservation management.',
  '### Overview\nBuilt specifically to address the daily academic workflow at Politeknik Negeri Jember, this portal brings course syllabi, lab equipment schedules, and peer study groups into one cohesive interface.\n\n### Key Highlights\n- **Role-Based Workflows:** Distinct privileges for students, teaching assistants, and faculty members.\n- **Automated Notifications:** Email triggers for timetable adjustments and lab slot bookings.',
  array['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Supabase Auth'],
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
  'https://demo.example.com/polije-hub',
  'https://github.com/example/polije-hub',
  true,
  true,
  2
),
(
  'Verve — Minimalist E-Commerce Studio',
  'verve-minimalist-store',
  'A lightning-fast headless commerce storefront with instant filter search, dynamic cart state, and Stripe payment gateway integration.',
  '### Overview\nVerve strips away all typical e-commerce clutter to present an ultra-clean product catalog inspired by Dieter Rams and modern Scandinavian architecture.\n\n### Key Highlights\n- **Sub-100ms Page Loads:** Optimized image loading via Next.js Image with WebP/AVIF compression.\n- **Optimistic UI:** Instant cart additions and badge updates without server roundtrips.',
  array['Next.js', 'React 19', 'Tailwind CSS', 'Stripe API', 'Zod'],
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  'https://demo.example.com/verve',
  'https://github.com/example/verve',
  false,
  true,
  3
)
on conflict (slug) do nothing;
