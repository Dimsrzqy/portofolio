"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createProjectAction, type AdminActionResult } from "@/app/actions/admin";
import { createClient } from "@/lib/supabase/client";
import { convertAndCompressToWebP, formatBytes } from "@/lib/utils/image-compression";
import {
  ArrowLeft,
  Upload,
  Link2,
  Loader2,
  Sparkles,
  AlertCircle,
  Eye,
  Star,
  Layers,
  FileText,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  FileCheck,
} from "lucide-react";

const SUGGESTED_TAGS = [
  "Next.js",
  "React 19",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "PostgreSQL",
  "Three.js",
  "Node.js",
  "Framer Motion",
];

export default function NewProjectPage() {
  const [state, formAction, isPending] = useActionState<AdminActionResult | null, FormData>(
    createProjectAction,
    null
  );

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [techStack, setTechStack] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState<string | null>(null);
  const [compressionResult, setCompressionResult] = useState<{
    original: string;
    compressed: string;
    reduction: number;
  } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showManualUrl, setShowManualUrl] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generated);
  };

  // Add tag suggestion to input
  const addTag = (tag: string) => {
    const currentTags = techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (!currentTags.includes(tag)) {
      const updated = currentTags.length > 0 ? `${techStack}, ${tag}` : tag;
      setTechStack(updated);
    }
  };

  // Handle Image Selection, Auto WebP Conversion & Compression, then Supabase Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadError(null);
    setCompressionResult(null);

    try {
      // 1. Auto-Convert to WebP and compress under 1MB
      setProcessStatus("Mengonversi gambar ke WebP & mengompres ukuran...");
      const {
        file: webpFile,
        originalSize,
        compressedSize,
        reductionPercentage,
      } = await convertAndCompressToWebP(file, 1024 * 1024); // max 1 MB

      setProcessStatus("Mengunggah file WebP ke Supabase Storage...");

      // 2. Upload WebP file to Supabase Storage
      const supabase = createClient();
      if (!supabase) {
        throw new Error(
          "Supabase belum terhubung. Periksa konfigurasi NEXT_PUBLIC_SUPABASE_URL."
        );
      }

      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 7);
      const cleanBaseName = slug || "cover";
      const filePath = `projects/${cleanBaseName}-${timestamp}-${randomStr}.webp`;

      // Upload to portfolio-assets (with fallback to project-images)
      let uploadRes = await supabase.storage
        .from("portfolio-assets")
        .upload(filePath, webpFile, {
          contentType: "image/webp",
          upsert: true,
        });

      let bucketName = "portfolio-assets";

      if (uploadRes.error) {
        bucketName = "project-images";
        uploadRes = await supabase.storage
          .from("project-images")
          .upload(filePath, webpFile, {
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadRes.error) {
          throw uploadRes.error;
        }
      }

      // 3. Get Public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(uploadRes.data.path);

      setImageUrl(publicUrl);
      setCompressionResult({
        original: formatBytes(originalSize),
        compressed: formatBytes(compressedSize),
        reduction: reductionPercentage,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses dan mengunggah gambar";
      setUploadError(msg);
    } finally {
      setIsProcessing(false);
      setProcessStatus(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-zinc-950/10 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="comic-panel-sm w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[44px] min-w-[44px] sm:min-h-9 sm:min-w-9"
            title="Kembali ke Daftar Projects"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
              Create New Project
            </h1>
            <p className="text-xs text-zinc-500 font-mono">
              Isi data karya untuk ditampilkan di portofolio live.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300">
            DRAFT MODE
          </span>
        </div>
      </div>

      {state && !state.success && (
        <div className="p-4 rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">{state.message}</p>
          </div>
        </div>
      )}

      {/* Main 2-Column Form */}
      <form action={formAction}>
        {/* Hidden Input to store Image URL from Upload */}
        <input type="hidden" name="image_url" value={imageUrl} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ========================================================== */}
          {/* LEFT COLUMN (2 Cols): Project Core Content                */}
          {/* ========================================================== */}
          <div className="lg:col-span-2 space-y-6">
            {/* Panel 1: Basic Information */}
            <div className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-wider font-mono">
                  1. Informasi Utama
                </h2>
              </div>

              {/* Title Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="title"
                  className="block text-xs font-bold text-zinc-800 dark:text-zinc-200"
                >
                  Judul Project <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Misal: Nexus Analytics Platform"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-zinc-950 dark:text-white text-sm focus:border-zinc-950 dark:focus:border-indigo-400 focus:outline-none transition-colors min-h-[44px]"
                />
                {state?.errors?.title && (
                  <p className="text-xs text-red-500">{state.errors.title[0]}</p>
                )}
              </div>

              {/* Slug Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="slug"
                  className="block text-xs font-bold text-zinc-800 dark:text-zinc-200"
                >
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 px-3 py-1.5 text-xs font-mono text-zinc-500 focus-within:border-zinc-950 dark:focus-within:border-indigo-400 transition-colors">
                  <span className="shrink-0 select-none opacity-60">/projects/</span>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="nexus-analytics-platform"
                    className="w-full bg-transparent px-1.5 py-1 text-zinc-950 dark:text-white focus:outline-none text-xs font-mono"
                  />
                </div>
                {state?.errors?.slug && (
                  <p className="text-xs text-red-500">{state.errors.slug[0]}</p>
                )}
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label
                  htmlFor="description"
                  className="block text-xs font-bold text-zinc-800 dark:text-zinc-200"
                >
                  Deskripsi Singkat <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  required
                  placeholder="Ringkasan 1-2 kalimat tentang apa yang dibuat dan masalah yang diselesaikan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-zinc-950 dark:text-white text-sm focus:border-zinc-950 dark:focus:border-indigo-400 focus:outline-none transition-colors"
                />
                {state?.errors?.description && (
                  <p className="text-xs text-red-500">{state.errors.description[0]}</p>
                )}
              </div>

              {/* Tech Stack with Chips */}
              <div className="space-y-2 pt-2">
                <label
                  htmlFor="tech_stack"
                  className="block text-xs font-bold text-zinc-800 dark:text-zinc-200"
                >
                  Tech Stack (Pisahkan dengan koma) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="tech_stack"
                  name="tech_stack"
                  required
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="Next.js, TypeScript, Tailwind CSS, Supabase"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-zinc-950 dark:text-white text-sm focus:border-zinc-950 dark:focus:border-indigo-400 focus:outline-none transition-colors min-h-[44px]"
                />

                {/* Quick Add Suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-zinc-400 font-mono">Klik tambah cepat:</span>
                  {SUGGESTED_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>

                {state?.errors?.tech_stack && (
                  <p className="text-xs text-red-500">{state.errors.tech_stack[0]}</p>
                )}
              </div>
            </div>

            {/* Panel 2: Case Study (Markdown) */}
            <div className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-wider font-mono">
                    2. Cerita / Studi Kasus Lengkap
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">Opsional (Markdown)</span>
              </div>

              <textarea
                id="content"
                name="content"
                rows={7}
                placeholder={`### Latar Belakang & Masalah\nJelaskan tantangan yang dihadapi...\n\n### Solusi & Arsitektur\nBagaimana project ini dibangun...\n\n### Hasil & Dampak\n- Peningkatan performa 40%\n- Digunakan oleh 500+ pengguna aktif`}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-zinc-950 dark:text-white text-xs font-mono focus:border-zinc-950 dark:focus:border-indigo-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* ========================================================== */}
          {/* RIGHT COLUMN (1 Col): Settings, Media & Publish           */}
          {/* ========================================================== */}
          <div className="space-y-6">
            {/* Publish Action Card */}
            <div className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-5 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-wider font-mono">
                  Publikasi
                </h3>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 cursor-pointer min-h-[44px]">
                  <div className="flex items-center gap-2.5">
                    <Eye className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">
                        Tampilkan di Website
                      </p>
                      <p className="text-[10px] text-zinc-400">Status Live Publik</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="is_published"
                    defaultChecked
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 cursor-pointer min-h-[44px]">
                  <div className="flex items-center gap-2.5">
                    <Star className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900 dark:text-white">
                        Project Unggulan
                      </p>
                      <p className="text-[10px] text-zinc-400">Featured badge</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="featured"
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </label>

                <div className="flex items-center justify-between px-3 py-2 text-xs">
                  <span className="text-zinc-500 font-mono">Urutan Tayang:</span>
                  <input
                    type="number"
                    id="sort_order"
                    name="sort_order"
                    defaultValue={0}
                    className="w-16 px-2 py-1 rounded-lg border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-center font-mono text-xs font-bold"
                  />
                </div>
              </div>

              {/* Big Primary Submit Button */}
              <button
                type="submit"
                disabled={isPending || isProcessing}
                className="comic-btn w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 min-h-[44px] cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan Project...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Simpan & Publikasikan</span>
                  </>
                )}
              </button>
            </div>

            {/* Media Upload Card with Auto-WebP & Auto-Compress */}
            <div className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-wider font-mono">
                    Cover Image <span className="text-red-500">*</span>
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold">
                  Auto WebP (≤1MB)
                </span>
              </div>

              {/* Upload Drop Button */}
              <div>
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className={`comic-panel-sm flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-zinc-950 dark:border-zinc-700 bg-indigo-50/50 dark:bg-indigo-950/20 text-center cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-950/40 active:translate-x-0.5 active:translate-y-0.5 ${
                    isProcessing ? "opacity-60 pointer-events-none" : ""
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-2 py-1">
                      <Loader2 className="w-7 h-7 animate-spin text-indigo-600 dark:text-indigo-400" />
                      <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 font-mono">
                        {processStatus || "Sedang memproses..."}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_#6366f1]">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-zinc-950 dark:text-white">
                          Pilih & Upload Gambar
                        </p>
                        <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                          JPG / PNG otomatis diconvert ke WebP ≤1MB
                        </p>
                      </div>
                    </>
                  )}
                </label>
              </div>

              {/* Compression Success Badge */}
              {compressionResult && (
                <div className="p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold">
                      Format WebP Aktif!
                    </p>
                    <p className="text-[11px] font-mono opacity-90">
                      {compressionResult.original} ➔ {compressionResult.compressed} (Hemat {compressionResult.reduction}%)
                    </p>
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="p-3 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <p>{uploadError}</p>
                </div>
              )}

              {/* Live Preview */}
              {imageUrl && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                      <FileCheck className="w-3.5 h-3.5" />
                      WebP Siap Dipakai
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl("");
                        setCompressionResult(null);
                      }}
                      className="text-red-500 hover:underline cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="relative w-full aspect-16/9 rounded-xl overflow-hidden border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shadow-sm">
                    <Image src={imageUrl} alt="Cover Preview" fill className="object-cover" />
                  </div>
                </div>
              )}

              {/* Option to view/input manual URL */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  className="text-[11px] font-mono text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline cursor-pointer"
                >
                  {showManualUrl ? "Sembunyikan URL Manual" : "Atau masukkan URL gambar manual"}
                </button>

                {showManualUrl && (
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full mt-1.5 px-3 py-1.5 rounded-lg border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-xs font-mono text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400"
                  />
                )}
              </div>
            </div>

            {/* External Links Card */}
            <div className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-5 space-y-3">
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-wider font-mono">
                  Tautan External (Opsional)
                </h3>
              </div>

              <div className="space-y-2">
                <div>
                  <label htmlFor="demo_url" className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                    Demo Live URL
                  </label>
                  <input
                    type="url"
                    id="demo_url"
                    name="demo_url"
                    placeholder="https://demo-project.com"
                    className="w-full px-3 py-2 rounded-lg border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-xs font-mono text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label htmlFor="github_url" className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                    GitHub Repo URL
                  </label>
                  <input
                    type="url"
                    id="github_url"
                    name="github_url"
                    placeholder="https://github.com/dimas/repo"
                    className="w-full px-3 py-2 rounded-lg border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-xs font-mono text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
