"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatBytes } from "@/lib/utils/image-compression";
import {
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileDown,
  Eye,
  ExternalLink,
} from "lucide-react";

export function CvManagerCard() {
  const [cvInfo, setCvInfo] = useState<{
    name: string;
    size: number;
    updatedAt: string;
    url: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch current CV status from Supabase Storage
  const loadCvStatus = async () => {
    setIsLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: files, error } = await supabase.storage
        .from("files")
        .list("", { search: "cv.pdf" });

      if (error) throw error;

      const found = files?.find((f) => f.name === "cv.pdf");
      if (found) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("files").getPublicUrl("cv.pdf");

        setCvInfo({
          name: found.name,
          size: found.metadata?.size || 0,
          updatedAt: found.updated_at || found.created_at || new Date().toISOString(),
          url: publicUrl,
        });
      } else {
        setCvInfo(null);
      }
    } catch {
      setCvInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCvStatus();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate PDF
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setErrorMessage("File harus berformat PDF (.pdf).");
      return;
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Ukuran file maksimal adalah 10 MB.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const supabase = createClient();
    if (!supabase) {
      setErrorMessage("Supabase belum terkonfigurasi pada file .env.local");
      setIsUploading(false);
      return;
    }

    try {
      // Upload with upsert: true into 'files' bucket as 'cv.pdf'
      const { error } = await supabase.storage
        .from("files")
        .upload("cv.pdf", file, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (error) throw error;

      setSuccessMessage(
        `File CV "${file.name}" (${formatBytes(file.size)}) berhasil diunggah! Tombol "Download CV" di landing page kini otomatis mengunduh file ini.`
      );

      await loadCvStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah file CV.";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-zinc-950 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_#6366f1] shrink-0">
            <FileDown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-zinc-950 dark:text-white uppercase tracking-tight">
                Curriculum Vitae (CV) Manager
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                PDF
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono">
              Kelola dokumen CV yang dapat diunduh oleh pengunjung pada tombol hero beranda.
            </p>
          </div>
        </div>

        {/* Live Status / Show CV Button */}
        <div>
          {isLoading ? (
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Memeriksa...</span>
            </span>
          ) : cvInfo ? (
            <a
              href="/api/cv"
              target="_blank"
              rel="noopener noreferrer"
              className="comic-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[38px] cursor-pointer"
              title="Buka dan lihat file CV Anda"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Show CV</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          ) : (
            <span className="px-2.5 py-1 rounded-full border text-[11px] font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700">
              ○ CV Belum Diunggah
            </span>
          )}
        </div>
      </div>

      {/* Success / Error Banners */}
      {successMessage && (
        <div className="p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Upload Drop Area */}
      <div>
        <input
          type="file"
          id="cv-upload-input"
          accept="application/pdf,.pdf"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
        />
        <label
          htmlFor="cv-upload-input"
          className={`comic-panel-sm flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-zinc-950 dark:border-zinc-700 bg-indigo-50/40 dark:bg-indigo-950/20 text-center cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-950/40 active:translate-x-0.5 active:translate-y-0.5 ${
            isUploading ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-7 h-7 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 font-mono">
                Mengunggah file PDF ke Supabase Storage...
              </p>
            </div>
          ) : (
            <>
              <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_#6366f1]">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-tight">
                  {cvInfo ? "Upload & Ganti CV Baru (PDF)" : "Upload File CV (PDF)"}
                </p>
                <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                  Klik untuk memilih file .pdf dari komputer Anda (Maksimal 10 MB)
                </p>
              </div>
            </>
          )}
        </label>
      </div>
    </div>
  );
}
