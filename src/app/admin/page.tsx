import React from "react";
import Link from "next/link";
import { getAllProjectsForAdmin, getAllMessagesForAdmin } from "@/lib/supabase/projects";
import { FolderGit2, Mail, Plus, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

export default async function AdminOverviewPage() {
  const projects = await getAllProjectsForAdmin();
  const messages = await getAllMessagesForAdmin();

  const publishedCount = projects.filter((p) => p.is_published).length;
  const draftCount = projects.length - publishedCount;

  return (
    <div className="space-y-8">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Pantau dan kelola konten live portfolio, projects, dan pesan masuk.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity self-start sm:self-auto min-h-[44px] sm:min-h-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3 text-zinc-500">
            <span className="text-xs font-medium uppercase tracking-wider">Total Projects</span>
            <FolderGit2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white font-mono">
            {projects.length}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Dalam database</p>
        </div>

        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3 text-zinc-500">
            <span className="text-xs font-medium uppercase tracking-wider">Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
            {publishedCount}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Tampil di beranda</p>
        </div>

        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3 text-zinc-500">
            <span className="text-xs font-medium uppercase tracking-wider">Drafts</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-zinc-600 dark:text-zinc-300 font-mono">
            {draftCount}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Disembunyikan</p>
        </div>

        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3 text-zinc-500">
            <span className="text-xs font-medium uppercase tracking-wider">Inbox Messages</span>
            <Mail className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white font-mono">
            {messages.length}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Dari formulir kontak</p>
        </div>
      </div>

      {/* Quick Access Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects Quick List */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold tracking-tight text-zinc-950 dark:text-white">
              Recent Projects
            </h2>
            <Link
              href="/admin/projects"
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Manage all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {projects.slice(0, 4).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {p.title}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate">{p.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      p.is_published
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {p.is_published ? "Published" : "Draft"}
                  </span>
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white p-1"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Quick List */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold tracking-tight text-zinc-950 dark:text-white">
              Recent Messages
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <span>View inbox</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {messages.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">
              Belum ada pesan baru di inbox.
            </p>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {messages.slice(0, 4).map((m) => (
                <div key={m.id} className="py-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {m.name}
                    </p>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {new Date(m.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-1">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
