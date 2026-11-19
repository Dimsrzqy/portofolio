"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AboutData } from "@/types";
import { AboutPanels } from "@/components/sections/about";
import {
  updateAboutAction,
  uploadProfilePhotoAction,
} from "@/app/actions/about";
import { convertAndCompressToWebP, formatBytes } from "@/lib/utils/image-compression";
import {
  User,
  Sparkles,
  Upload,
  Link2,
  Loader2,
  Check,
  CheckCircle2,
  AlertCircle,
  Eye,
  Bookmark,
  ArrowLeft,
  FileCheck,
} from "lucide-react";

interface AboutClientProps {
  initialData: AboutData;
}

export function AboutClient({ initialData }: AboutClientProps) {
  const [formData, setFormData] = useState<AboutData>(() => {
    // Gabungkan paragraf jika sebelumnya terpisah
    const bio1 = initialData.bioParagraph1?.trim() || "";
    const bio2 = initialData.bioParagraph2?.trim() || "";
    const combinedBio = bio1 && bio2 ? `${bio1}\n\n${bio2}` : bio1 || bio2;

    return {
      ...initialData,
      bioParagraph1: combinedBio,
      bioParagraph2: "",
    };
  });

  // Upload & Compression State
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoProcessStatus, setPhotoProcessStatus] = useState<string | null>(null);
  const [compressionResult, setCompressionResult] = useState<{
    original: string;
    compressed: string;
    reduction: number;
  } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deletedOldPhoto, setDeletedOldPhoto] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

  // Save State
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active view on mobile: edit or preview
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  // Handle Photo Selection, 5MB Check, WebP Conversion & Compression, and Supabase Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset feedback
    setUploadError(null);
    setCompressionResult(null);
    setDeletedOldPhoto(false);

    const oldPhotoUrl = formData.photoUrl;

    // 1. Validation: Max 5MB
    const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError(
        `Ukuran file (${formatBytes(file.size)}) melebihi batas maksimal 5 MB. Harap pilih gambar dengan ukuran di bawah 5 MB.`
      );
      return;
    }

    // 2. Validation: Image type
    const isImage =
      file.type.startsWith("image/") ||
      file.name.match(/\.(jpg|jpeg|png|webp|avif|bmp|tiff|heic)$/i);
    if (!isImage) {
      setUploadError(
        "File yang dipilih bukan gambar yang valid. Harap pilih file JPG, PNG, WebP, AVIF, atau format gambar lainnya."
      );
      return;
    }

    setIsProcessingPhoto(true);

    try {
      // 3. Convert & Compress to WebP (max ~1MB for web speed)
      setPhotoProcessStatus("Mengonversi ke WebP & mengompres ukuran...");
      const {
        file: webpFile,
        originalSize,
        compressedSize,
        reductionPercentage,
      } = await convertAndCompressToWebP(file, 1024 * 1024);

      // 4. Upload to Supabase Storage via Server Action (Server-side upload & automatic old photo cleanup)
      setPhotoProcessStatus("Mengunggah foto & menghapus foto lama...");
      const uploadFormData = new FormData();
      uploadFormData.append("file", webpFile);
      if (oldPhotoUrl) {
        uploadFormData.append("oldPhotoUrl", oldPhotoUrl);
      }

      const uploadResult = await uploadProfilePhotoAction(uploadFormData);
      if (!uploadResult.success || !uploadResult.publicUrl) {
        throw new Error(uploadResult.message || "Gagal mengunggah foto ke Supabase Storage.");
      }

      setDeletedOldPhoto(Boolean(oldPhotoUrl && oldPhotoUrl.includes("/storage/v1/object/public/")));
      setFormData((prev) => ({ ...prev, photoUrl: uploadResult.publicUrl }));
      setCompressionResult({
        original: formatBytes(originalSize),
        compressed: formatBytes(compressedSize),
        reduction: reductionPercentage,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses atau mengunggah foto.";
      setUploadError(msg);
    } finally {
      setIsProcessingPhoto(false);
      setPhotoProcessStatus(null);
    }
  };

  // Handle Save All Changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const payload: AboutData = {
      ...formData,
      bioParagraph2: "",
    };

    try {
      const res = await updateAboutAction(payload, initialData.photoUrl);
      setIsSaving(false);

      if (res.success) {
        setSuccessMsg("Perubahan bagian About / Bio berhasil disimpan dan langsung tayang!");
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        setErrorMsg(res.message || "Gagal menyimpan perubahan. Silakan coba lagi.");
      }
    } catch (err: unknown) {
      setIsSaving(false);
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes("failed-to-find-server-action") ||
        msg.includes("was not found on the server")
      ) {
        setErrorMsg(
          "Kode server telah diperbarui saat tab browser ini terbuka. Silakan muat ulang halaman (tekan F5 / Refresh), lalu klik 'Simpan Perubahan' kembali."
        );
      } else {
        setErrorMsg("Gagal menyimpan perubahan. Silakan muat ulang halaman dan coba lagi.");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-zinc-950 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Overview</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_#ffffff]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white uppercase">
                Edit About & Origin Profile
              </h1>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Edit foto profil, judul, dan biografi.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button & Live Link */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/#about"
            target="_blank"
            className="comic-panel-sm inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors min-h-[44px]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Lihat di Web</span>
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isProcessingPhoto}
            className="comic-btn inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 min-h-[44px] cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="comic-panel-sm p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-bold">{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="comic-panel-sm p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border-2 border-red-500 text-red-900 dark:text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-xs font-bold">{errorMsg}</p>
        </div>
      )}

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden rounded-xl border-2 border-zinc-950 dark:border-zinc-800 p-1 bg-zinc-100 dark:bg-zinc-900">
        <button
          type="button"
          onClick={() => setMobileTab("edit")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all min-h-[40px] ${
            mobileTab === "edit"
              ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm border border-zinc-300 dark:border-zinc-700"
              : "text-zinc-500 hover:text-zinc-900"
          }`}
        >
          Form Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all min-h-[40px] ${
            mobileTab === "preview"
              ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm border border-zinc-300 dark:border-zinc-700"
              : "text-zinc-500 hover:text-zinc-900"
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* Grid: Left Editor & Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================== */}
        {/* LEFT COLUMN (7 Cols): Form Controls                        */}
        {/* ========================================================== */}
        <div
          className={`lg:col-span-7 space-y-6 ${
            mobileTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Panel 1: Photo & Media Upload */}
          <div className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-wider font-mono">
                  1. Foto Profil / Origin Card
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold">
                Auto WebP (Maks 5MB)
              </span>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Pilih foto asli dari perangkat Anda (semua format gambar). Sistem akan otomatis memvalidasi batas maksimal 5 MB, mengonversi ke format <strong>WebP modern</strong>, dan mengompres ukuran file agar situs memuat instan.
            </p>

            {/* Upload Area */}
            <div className="space-y-3">
              <input
                type="file"
                id="photo-file-upload"
                accept="image/*,.*"
                onChange={handlePhotoUpload}
                disabled={isProcessingPhoto}
                className="hidden"
              />
              <label
                htmlFor="photo-file-upload"
                className={`comic-panel-sm flex flex-col items-center justify-center gap-2.5 p-6 rounded-xl border-2 border-zinc-950 dark:border-zinc-700 bg-indigo-50/40 dark:bg-indigo-950/20 text-center cursor-pointer transition-all hover:bg-indigo-50 dark:hover:bg-indigo-950/40 active:translate-x-0.5 active:translate-y-0.5 ${
                  isProcessingPhoto ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                {isProcessingPhoto ? (
                  <div className="flex flex-col items-center gap-2 py-2">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                    <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 font-mono">
                      {photoProcessStatus || "Sedang memproses gambar..."}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-11 h-11 rounded-xl bg-white dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_#ffffff]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-950 dark:text-white">
                        Pilih Foto dari Komputer / Perangkat
                      </p>
                      <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                        Semua file gambar didukung • Otomatis WebP • Maks. 5 MB
                      </p>
                    </div>
                  </>
                )}
              </label>

              {/* Upload Error */}
              {uploadError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Compression Success Card */}
              {compressionResult && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 font-mono">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Gambar Berhasil Dikonversi & Dikompres!</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1 text-zinc-700 dark:text-zinc-300">
                    <div className="p-2 rounded bg-white dark:bg-zinc-800 border border-emerald-200 dark:border-emerald-900/60">
                      <span className="text-zinc-400 block text-[9px] uppercase">Ukuran Asli</span>
                      <span className="font-bold">{compressionResult.original}</span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-zinc-800 border border-emerald-200 dark:border-emerald-900/60">
                      <span className="text-zinc-400 block text-[9px] uppercase">Format WebP</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {compressionResult.compressed}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-white dark:bg-zinc-800 border border-emerald-200 dark:border-emerald-900/60">
                      <span className="text-zinc-400 block text-[9px] uppercase">Efisiensi</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        -{compressionResult.reduction}%
                      </span>
                    </div>
                  </div>

                  {deletedOldPhoto && (
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-300 font-mono pt-1.5 border-t border-emerald-200 dark:border-emerald-900/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Foto lama di Supabase Storage otomatis dihapus untuk menghemat ruang.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Option to toggle manual URL */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowManualUrl(!showManualUrl)}
                  className="text-[11px] font-mono text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1 transition-colors"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>{showManualUrl ? "Sembunyikan URL manual" : "Atau masukkan URL gambar secara manual"}</span>
                </button>
                {showManualUrl && (
                  <div className="mt-2">
                    <input
                      type="url"
                      value={formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-zinc-950 dark:text-white text-xs font-mono focus:border-indigo-600 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sticker & Photo Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Sticker Label (Pojok Kanan Atas)
                </label>
                <input
                  type="text"
                  value={formData.stickerText}
                  onChange={(e) => setFormData({ ...formData, stickerText: e.target.value })}
                  placeholder="ORIGIN FILE"
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-zinc-950 dark:text-white text-xs font-mono font-bold focus:border-indigo-600 focus:outline-none min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Tag Badge Foto
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="ENGINEER PROFILE"
                  className="w-full px-3.5 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-zinc-950 dark:text-white text-xs font-mono font-bold focus:border-indigo-600 focus:outline-none min-h-[44px]"
                />
              </div>
            </div>
          </div>

          {/* Panel 2: Personal Identity & Section Header */}
          <div className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-wider font-mono">
                2. Identitas & Header Section
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Dimas Rizqy Ilhami"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-zinc-950 dark:text-white text-xs font-bold focus:border-indigo-600 focus:outline-none min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Jember, Indonesia"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-zinc-950 dark:text-white text-xs focus:border-indigo-600 focus:outline-none min-h-[44px]"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Chapter Badge (Header Kecil Atas)
              </label>
              <input
                type="text"
                value={formData.chapterLabel}
                onChange={(e) => setFormData({ ...formData, chapterLabel: e.target.value })}
                placeholder="CHAPTER 01 // ORIGIN & PHILOSOPHY"
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-zinc-950 dark:text-white text-xs font-mono font-bold focus:border-indigo-600 focus:outline-none min-h-[44px]"
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Judul Filosofi / Heading Utama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Engineering with purpose, precision, and simplicity."
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-zinc-950 dark:text-white text-sm font-bold focus:border-indigo-600 focus:outline-none min-h-[44px]"
              />
            </div>
          </div>

          {/* Panel 3: Bio Paragraph (Single Paragraph) */}
          <div className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <Bookmark className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xs font-black text-zinc-950 dark:text-white uppercase tracking-wider font-mono">
                3. Narasi Bio & Filosofi
              </h2>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Narasi Bio & Filosofi Diri <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {formData.bioParagraph1?.split(/\n+/).filter((p) => p.trim().length > 0).length || 0} Paragraf Terdeteksi
                </span>
              </div>
              <textarea
                rows={7}
                required
                value={formData.bioParagraph1}
                onChange={(e) =>
                  setFormData({ ...formData, bioParagraph1: e.target.value, bioParagraph2: "" })
                }
                placeholder="Tulis narasi profil & filosofi Anda. Tekan Enter untuk membuat paragraf baru..."
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-zinc-950 dark:text-white text-xs leading-relaxed focus:border-indigo-600 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-500 leading-normal">
                💡 <strong>Tips Paragraf:</strong> Tekan tombol <strong>Enter</strong> untuk membuat paragraf kedua, ketiga, dst. Di website utama dan di Live Preview sebelah kanan, baris baru otomatis dijadikan paragraf terpisah dengan jarak rapi.
              </p>
            </div>
          </div>

          {/* Bottom Save Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isProcessingPhoto}
              className="comic-btn w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 min-h-[48px] cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Menyimpan Perubahan...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Simpan Perubahan Bio & Origin</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================== */}
        {/* RIGHT COLUMN (5 Cols): Real-Time Live Preview             */}
        {/* ========================================================== */}
        <div
          className={`min-w-0 lg:col-span-5 space-y-4 lg:sticky lg:top-20 ${
            mobileTab === "edit" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                Pratinjau About
              </span>
            </div>
          </div>

          <AboutPanels data={formData} preview />
        </div>
      </div>
    </div>
  );
}
