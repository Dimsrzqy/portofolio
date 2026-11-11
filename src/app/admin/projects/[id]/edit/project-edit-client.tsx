"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { updateProjectAction, type AdminActionResult } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/client";
import { Project } from "@/types";
import {
  ArrowLeft,
  Upload,
  Loader2,
  AlertCircle,
} from "lucide-react";

export function ProjectEditClient({ project }: { project: Project }) {
  const updateWithId = updateProjectAction.bind(null, project.id);
  const [state, formAction, isPending] = useActionState<AdminActionResult | null, FormData>(
    updateWithId,
    null
  );

  const [imageUrl, setImageUrl] = useState(project.image_url);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const supabase = createClient();
    if (!supabase) {
      setUploadError("Supabase client belum terhubung. Silakan masukkan URL langsung.");
      setIsUploading(false);
      return;
    }

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { data, error } = await supabase.storage
        .from("project-images")
        .upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("project-images").getPublicUrl(data.path);

      setImageUrl(publicUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah gambar";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors min-h-[44px] flex items-center"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
          Edit Project: {project.title}
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Perbarui rincian, status tayang, atau tautan project.
        </p>
      </div>

      {state && !state.success && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-50/70 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p>{state.message}</p>
        </div>
      )}

      <form action={formAction} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Title & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="title"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={project.title}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
            />
            {state?.errors?.title && (
              <p className="text-[11px] text-red-500 mt-1">{state.errors.title[0]}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              URL Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              defaultValue={project.slug}
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs min-h-[44px]"
            />
            {state?.errors?.slug && (
              <p className="text-[11px] text-red-500 mt-1">{state.errors.slug[0]}</p>
            )}
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Short Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            required
            defaultValue={project.description}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {state?.errors?.description && (
            <p className="text-[11px] text-red-500 mt-1">{state.errors.description[0]}</p>
          )}
        </div>

        {/* Content (Markdown) */}
        <div>
          <label
            htmlFor="content"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Detailed Case Study (Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            defaultValue={project.content || ""}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
          />
        </div>

        {/* Tech Stack Tags */}
        <div>
          <label
            htmlFor="tech_stack"
            className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
          >
            Tech Stack Tags (Pisahkan dengan koma) *
          </label>
          <input
            type="text"
            id="tech_stack"
            name="tech_stack"
            required
            defaultValue={project.tech_stack.join(", ")}
            className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
          />
          {state?.errors?.tech_stack && (
            <p className="text-[11px] text-red-500 mt-1">{state.errors.tech_stack[0]}</p>
          )}
        </div>

        {/* Image Upload & Image URL */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Project Cover Image *
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Upload File to Supabase */}
            <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors">
              <input
                type="file"
                id="file-upload-edit"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="file-upload-edit"
                className="cursor-pointer flex flex-col items-center justify-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400"
              >
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                ) : (
                  <Upload className="w-5 h-5 text-indigo-500" />
                )}
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {isUploading ? "Mengunggah..." : "Upload ke Supabase Storage"}
                </span>
                <span className="text-[10px] text-zinc-400">Ganti file gambar</span>
              </label>
            </div>

            {/* Direct Image URL input */}
            <div>
              <span className="text-[11px] text-zinc-400 mb-1 block">Atau URL gambar:</span>
              <input
                type="url"
                id="image_url"
                name="image_url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
              />
            </div>
          </div>

          {uploadError && (
            <p className="text-xs text-amber-600 dark:text-amber-400">{uploadError}</p>
          )}

          {imageUrl && (
            <div className="relative w-full max-w-sm aspect-16/9 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800">
              <Image src={imageUrl} alt="Preview" fill className="object-cover" />
            </div>
          )}
        </div>

        {/* Demo & GitHub URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="demo_url"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              Demo URL (Opsional)
            </label>
            <input
              type="url"
              id="demo_url"
              name="demo_url"
              defaultValue={project.demo_url || ""}
              placeholder="https://demo.example.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
            />
          </div>

          <div>
            <label
              htmlFor="github_url"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              GitHub Repository (Opsional)
            </label>
            <input
              type="url"
              id="github_url"
              name="github_url"
              defaultValue={project.github_url || ""}
              placeholder="https://github.com/user/repo"
              className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
            />
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              name="is_published"
              defaultChecked={project.is_published}
              className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Publish ke live website</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project.featured}
              className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Tandai sebagai Featured</span>
          </label>

          <div className="flex items-center gap-2 ml-auto">
            <label htmlFor="sort_order" className="text-xs text-zinc-500">
              Sort Order:
            </label>
            <input
              type="number"
              id="sort_order"
              name="sort_order"
              defaultValue={project.sort_order}
              className="w-16 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 text-xs text-center font-mono"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex items-center justify-end gap-3">
          <Link
            href="/admin/projects"
            className="px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 min-h-[44px] flex items-center"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold text-xs hover:opacity-90 transition-opacity disabled:opacity-50 min-h-[44px] cursor-pointer"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Update Project</span>
          </button>
        </div>
      </form>
    </div>
  );
}
