import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllProjectsForAdmin, getAllMessagesForAdmin } from "@/lib/supabase/projects";
import { CvManagerCard } from "./cv-manager-card";
import {
  FolderGit2,
  Mail,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Database,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";

export default async function AdminOverviewPage() {
  const projects = await getAllProjectsForAdmin();
  const messages = await getAllMessagesForAdmin();

  const publishedCount = projects.filter((p) => p.is_published).length;
  const draftCount = projects.length - publishedCount;
  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <div className="space-y-8">
      {/* ============================================================ */}
      {/* 1. HERO BANNER                                               */}
      {/* ============================================================ */}
      <div className="comic-panel rounded-2xl p-6 sm:p-8 bg-white dark:bg-zinc-900 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-white uppercase">
              Welcome Back, Dimas! 👋
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Kelola portofolio, publikasi project baru, dan pantau pesan masuk dari klien langsung dari satu tempat yang terhubung ke Supabase.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/projects/new"
              className="comic-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[44px]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Project</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="comic-panel-sm inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[44px]"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Live Site</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. STATS & METRICS GRID                                      */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1: Total Projects */}
        <div className="comic-panel-sm rounded-xl p-5 bg-white dark:bg-zinc-900 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500">
              Total Projects
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white font-mono">
            {projects.length}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-500 font-medium">
            <span className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono font-bold text-zinc-700 dark:text-zinc-300">
              {featuredCount} Featured
            </span>
            <span>siap dipamerkan</span>
          </div>
        </div>

        {/* Metric 2: Published */}
        <div className="comic-panel-sm rounded-xl p-5 bg-white dark:bg-zinc-900 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Published
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/70 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
            {publishedCount}
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 font-medium">
            Aktif tampil di beranda utama
          </p>
        </div>

        {/* Metric 3: Drafts */}
        <div className="comic-panel-sm rounded-xl p-5 bg-white dark:bg-zinc-900 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Drafts / Hidden
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/70 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white font-mono">
            {draftCount}
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 font-medium">
            Belum dipublikasikan ke publik
          </p>
        </div>

        {/* Metric 4: Inbox Messages */}
        <div className="comic-panel-sm rounded-xl p-5 bg-white dark:bg-zinc-900 relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Inbox Messages
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/70 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white font-mono">
            {messages.length}
          </div>
          <p className="text-[11px] text-zinc-500 mt-2 font-medium">
            Pesan dari form kontak
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2.5 CV / RESUME MANAGER CARD                                 */}
      {/* ============================================================ */}
      <CvManagerCard />

      {/* ============================================================ */}
      {/* 3. MAIN DASHBOARD CONTENT (Two Columns)                      */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Projects (Spans 2 cols) */}
        <div className="lg:col-span-2 comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b-2 border-zinc-950 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-mono text-xs font-bold">
                  P
                </div>
                <div>
                  <h2 className="text-base font-black text-zinc-950 dark:text-white uppercase tracking-tight">
                    Recent Projects
                  </h2>
                  <p className="text-xs text-zinc-500">Daftar karya terbaru dalam database</p>
                </div>
              </div>

              <Link
                href="/admin/projects"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 min-h-[44px] flex items-center"
              >
                <span>Manage all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Project List Items */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 mt-2">
              {projects.length === 0 ? (
                <div className="py-12 text-center text-zinc-400 text-sm">
                  Belum ada project yang dibuat. Klik tombol di atas untuk membuat project pertama Anda!
                </div>
              ) : (
                projects.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    className="py-3.5 flex items-center justify-between gap-4 group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border-2 border-zinc-950 dark:border-zinc-700">
                        <Image
                          src={p.image_url}
                          alt={p.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-950 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {p.title}
                        </p>
                        <p className="text-[11px] text-zinc-400 font-mono truncate">
                          /{p.slug}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                          p.is_published
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700"
                        }`}
                      >
                        {p.is_published ? "LIVE" : "DRAFT"}
                      </span>

                      <Link
                        href={`/admin/projects/${p.id}/edit`}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 min-h-[36px] flex items-center"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-4 flex items-center justify-between text-xs text-zinc-500">
            <span>Menampilkan max 5 project terbaru</span>
            <Link
              href="/admin/projects"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Lihat semua ({projects.length}) →
            </Link>
          </div>
        </div>

        {/* Right Column: Messages & System Status */}
        <div className="space-y-6">
          {/* Quick Inbox Card */}
          <div className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-zinc-950 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-sm font-black text-zinc-950 dark:text-white uppercase tracking-tight">
                  Recent Messages
                </h2>
              </div>
              <Link
                href="/admin/messages"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5"
              >
                <span>Inbox</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 mt-2">
              {messages.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400">
                  Belum ada pesan kontak yang masuk.
                </div>
              ) : (
                messages.slice(0, 3).map((m) => (
                  <div key={m.id} className="py-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-zinc-950 dark:text-white truncate">
                        {m.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {new Date(m.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {m.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Environment Card */}
          <div className="comic-panel-sm rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 uppercase">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              <span>Stack Environment</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-500">Database</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Supabase PostgreSQL
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-500">Authentication</span>
                <span className="font-bold text-zinc-900 dark:text-white">
                  Active (dimasrizqy)
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-500">Deployment</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  Vercel Serverless
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
