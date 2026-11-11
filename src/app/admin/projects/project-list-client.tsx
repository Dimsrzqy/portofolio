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
} from "lucide-react";
import { useRouter } from "next/navigation";

export function ProjectListClient({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus project "${title}"?`)) {
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
      alert(`Gagal memperbarui: ${res.message}`);
    }
    setIsToggling(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Projects Manager
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Kelola karya, publikasikan, tampilkan di featured, atau ubah urutan tayang.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity min-h-[44px] sm:min-h-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-semibold uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Tech Stack</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-zinc-400">
                    Belum ada project yang ditambahkan.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700">
                          <Image
                            src={project.image_url}
                            alt={project.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-900 dark:text-white truncate">
                            {project.title}
                          </p>
                          <p className="text-[11px] text-zinc-400 font-mono truncate">
                            /projects/{project.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {project.tech_stack.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          >
                            {t}
                          </span>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <span className="text-[10px] text-zinc-400">
                            +{project.tech_stack.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

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
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer min-h-[44px] sm:min-h-auto ${
                          project.is_published
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200"
                        }`}
                      >
                        {project.is_published ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        disabled={isToggling === `${project.id}-featured`}
                        onClick={() =>
                          handleToggle(project.id, "featured", project.featured)
                        }
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-0 inline-flex items-center justify-center ${
                          project.featured
                            ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                            : "text-zinc-300 dark:text-zinc-600 hover:text-zinc-500"
                        }`}
                        title={
                          project.featured
                            ? "Remove from featured"
                            : "Mark as featured"
                        }
                      >
                        <Star
                          className={`w-4 h-4 ${
                            project.featured ? "fill-amber-400" : ""
                          }`}
                        />
                      </button>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-0 flex items-center justify-center"
                          title="View on site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-0 flex items-center justify-center"
                          title="Edit project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          disabled={isDeleting === project.id}
                          onClick={() => handleDelete(project.id, project.title)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-0 flex items-center justify-center"
                          title="Delete project"
                        >
                          {isDeleting === project.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
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
