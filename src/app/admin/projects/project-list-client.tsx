"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/types";
import {
  deleteProjectAction,
  toggleProjectFieldAction,
} from "@/app/actions/admin";
import {
  Edit,
  Trash2,
  ExternalLink,
  Star,
  Eye,
  EyeOff,
  Plus,
  Loader2,
  Search,
  FolderGit2,
  Filter,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

export function ProjectListClient({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "published" | "draft" | "featured">("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus project "${title}"? Tindakan ini juga akan membersihkan file cover di Supabase Storage.`)) {
      return;
    }
    setIsDeleting(id);
    const res = await deleteProjectAction(id);
    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } else {
      alert(`Gagal menghapus: ${res.message}`);
    }
    setIsDeleting(null);
  };

  const handleToggle = async (
    id: string,
    field: "is_published" | "featured",
    currentVal: boolean
  ) => {
    setIsToggling(`${id}-${field}`);
    const res = await toggleProjectFieldAction(id, field, currentVal);
    if (res.success) {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: !currentVal } : p))
      );
      router.refresh();
    } else {
      alert(`Gagal memperbarui status: ${res.message}`);
    }
    setIsToggling(null);
  };

  // Filter and search logic
  const filteredProjects = projects.filter((project) => {
    // 1. Tab filter
    if (filterTab === "published" && !project.is_published) return false;
    if (filterTab === "draft" && project.is_published) return false;
    if (filterTab === "featured" && !project.featured) return false;

    // 2. Search query filter
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    return (
      project.title.toLowerCase().includes(q) ||
      project.slug.toLowerCase().includes(q) ||
      project.tech_stack.some((t) => t.toLowerCase().includes(q))
    );
  });

  const publishedCount = projects.filter((p) => p.is_published).length;
  const draftCount = projects.length - publishedCount;
  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ============================================================ */}
      {/* 1. TOP HEADER                                                */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-zinc-950/10 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300 mb-1.5">
            <FolderGit2 className="w-3 h-3 text-indigo-500" />
            <span>PORTFOLIO CMS</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
            Projects Manager
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Kelola karya, publikasikan, tampilkan di featured, atau ubah urutan tayang.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="comic-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Project</span>
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 2. SEARCH & FILTER CONTROLS                                  */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari project, slug, atau tech stack..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-950 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400 transition-colors shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              filterTab === "all"
                ? "comic-panel-sm bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-2 border-zinc-950 dark:border-white"
                : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            Semua ({projects.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("published")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              filterTab === "published"
                ? "comic-panel-sm bg-emerald-600 text-white border-2 border-zinc-950 dark:border-emerald-400"
                : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            Live ({publishedCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("draft")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              filterTab === "draft"
                ? "comic-panel-sm bg-zinc-700 text-white border-2 border-zinc-950 dark:border-zinc-400"
                : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            Draft ({draftCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("featured")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
              filterTab === "featured"
                ? "comic-panel-sm bg-amber-500 text-zinc-950 border-2 border-zinc-950 dark:border-amber-300"
                : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            Featured ⭐ ({featuredCount})
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. PROJECTS TABLE                                            */}
      {/* ============================================================ */}
      <div className="comic-panel-sm rounded-2xl border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 font-mono font-bold uppercase tracking-wider border-b-2 border-zinc-950/10 dark:border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Tech Stack</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-400 font-mono">
                    {searchQuery ? (
                      <div>
                        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                          Tidak ditemukan project dengan kata kunci &quot;{searchQuery}&quot;
                        </p>
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="text-xs text-indigo-600 dark:text-indigo-400 underline mt-2 cursor-pointer"
                        >
                          Reset Pencarian
                        </button>
                      </div>
                    ) : (
                      "Belum ada project yang cocok dengan filter ini."
                    )}
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors group"
                  >
                    {/* Column 1: Thumbnail & Title */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border-2 border-zinc-950 dark:border-zinc-700 shadow-[1.5px_1.5px_0px_0px_#09090b] dark:shadow-[1.5px_1.5px_0px_0px_#ffffff]">
                          <Image
                            src={project.image_url}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/projects/${project.id}/edit`}
                            className="font-black text-sm text-zinc-950 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate block"
                          >
                            {project.title}
                          </Link>
                          <p className="text-[11px] text-zinc-400 font-mono truncate mt-0.5">
                            /projects/{project.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Tech Stack Badges */}
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                        {project.tech_stack.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          >
                            {t}
                          </span>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                            +{project.tech_stack.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Column 3: Live / Draft Toggle Button */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        disabled={isToggling === `${project.id}-is_published`}
                        onClick={() =>
                          handleToggle(
                            project.id,
                            "is_published",
                            project.is_published
                          )
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold border transition-all cursor-pointer min-h-[36px] ${
                          project.is_published
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200"
                        }`}
                        title="Klik untuk ubah status tayang"
                      >
                        {isToggling === `${project.id}-is_published` ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : project.is_published ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-zinc-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Column 4: Featured Star Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        disabled={isToggling === `${project.id}-featured`}
                        onClick={() =>
                          handleToggle(project.id, "featured", project.featured)
                        }
                        className={`w-9 h-9 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center ${
                          project.featured
                            ? "bg-amber-50 dark:bg-amber-950/50 text-amber-500 border border-amber-300 dark:border-amber-800 shadow-xs"
                            : "text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                        title={
                          project.featured
                            ? "Project Unggulan (Klik untuk hapus)"
                            : "Tandai sebagai Featured"
                        }
                      >
                        <Star
                          className={`w-4 h-4 ${
                            project.featured ? "fill-amber-400 stroke-amber-500" : ""
                          }`}
                        />
                      </button>
                    </td>

                    {/* Column 5: Action Buttons */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          className="comic-panel-sm w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 text-zinc-500 hover:text-zinc-950 dark:hover:text-white border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center transition-colors"
                          title="Lihat di live website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="comic-panel-sm inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 border-2 border-zinc-950 dark:border-zinc-700 transition-colors"
                          title="Edit project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">Edit</span>
                        </Link>

                        <button
                          type="button"
                          disabled={isDeleting === project.id}
                          onClick={() => handleDelete(project.id, project.title)}
                          className="comic-panel-sm w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border-2 border-zinc-950 dark:border-zinc-700 transition-colors cursor-pointer flex items-center justify-center"
                          title="Hapus project"
                        >
                          {isDeleting === project.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
