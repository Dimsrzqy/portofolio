"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SkillsData, SkillCategory } from "@/types";
import { updateSkillsAction } from "@/app/actions/skills";
import { defaultSkillsData } from "@/data/profile";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
  Wrench,
  Code2,
  Server,
  Database,
  Shield,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  X,
  Eye,
  Edit3,
  Layers,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

interface SkillsClientProps {
  initialData: SkillsData;
}

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  frontend: Code2,
  backend: Server,
  database: Database,
  tools: Wrench,
};

const SUGGESTED_SKILLS = [
  "Next.js",
  "React 19",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Node.js",
  "Express.js",
  "REST APIs",
  "GraphQL",
  "PostgreSQL",
  "Supabase",
  "MySQL",
  "Prisma ORM",
  "Docker",
  "Git & GitHub",
  "Postman",
  "Vercel",
  "Figma",
  "Redis",
  "Linux",
];

export function SkillsClient({ initialData }: SkillsClientProps) {
  const [data, setData] = useState<SkillsData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // New Skill input state per category index
  const [newSkillInputs, setNewSkillInputs] = useState<Record<number, string>>({});
  // Mobile tab view
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");

  const getCategoryIcon = (categoryName: string) => {
    const key = categoryName.trim().toLowerCase();
    for (const [k, Icon] of Object.entries(CATEGORY_ICON_MAP)) {
      if (key.includes(k)) return Icon;
    }
    return Shield;
  };

  // 1. Header Details Handlers
  const handleHeaderChange = (field: "chapterLabel" | "title" | "description", value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  // 2. Category Handlers
  const handleAddCategory = () => {
    const newCategory: SkillCategory = {
      category: "New Category",
      skills: [],
    };
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
  };

  const handleUpdateCategoryName = (index: number, newName: string) => {
    setData((prev) => {
      const updated = [...prev.categories];
      updated[index] = { ...updated[index], category: newName };
      return { ...prev, categories: updated };
    });
  };

  const handleDeleteCategory = (index: number) => {
    setData((prev) => {
      const updated = prev.categories.filter((_, i) => i !== index);
      return { ...prev, categories: updated };
    });
  };

  const handleMoveCategory = (index: number, direction: "up" | "down") => {
    setData((prev) => {
      const updated = [...prev.categories];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return { ...prev, categories: updated };
    });
  };

  // 3. Skill Tag Handlers
  const handleAddSkill = (categoryIndex: number, skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;

    setData((prev) => {
      const updated = [...prev.categories];
      const category = updated[categoryIndex];
      // Prevent exact duplicates in the same category
      if (category.skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
        return prev;
      }
      updated[categoryIndex] = {
        ...category,
        skills: [...category.skills, { name: trimmed }],
      };
      return { ...prev, categories: updated };
    });

    // Clear input
    setNewSkillInputs((prev) => ({ ...prev, [categoryIndex]: "" }));
  };

  const handleRemoveSkill = (categoryIndex: number, skillIndex: number) => {
    setData((prev) => {
      const updated = [...prev.categories];
      const category = updated[categoryIndex];
      updated[categoryIndex] = {
        ...category,
        skills: category.skills.filter((_, i) => i !== skillIndex),
      };
      return { ...prev, categories: updated };
    });
  };

  // 4. Save and Reset Handlers
  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const result = await updateSkillsAction(data);
      if (result.success) {
        setSuccessMsg("Perubahan keahlian (skills) berhasil disimpan dan diperbarui di website!");
      } else {
        setErrorMsg(result.message || "Gagal menyimpan perubahan ke Supabase.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan sistem saat menyimpan.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setData(defaultSkillsData);
    setIsResetModalOpen(false);
    setSuccessMsg("Data keahlian berhasil dikembalikan ke pengaturan bawaan. Klik 'Save Changes' untuk menerapkan.");
  };

  const totalSkillsCount = data.categories.reduce((acc, cat) => acc + cat.skills.length, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* ============================================================ */}
      {/* 1. TOP HEADER & ACTION BAR                                   */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-zinc-950 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin"
              className="text-xs font-mono font-bold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold border-2 border-zinc-950 dark:border-zinc-700 shadow-[2.5px_2.5px_0px_0px_#09090b]">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
                Skills & Arsenal CMS
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Kelola kategori senjata teknologi, bahasa, framework, dan tools yang tampil di portfolio
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="comic-panel-sm inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-xs font-bold uppercase transition-all min-h-[44px] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-zinc-500" />
            <span className="hidden sm:inline">Reset Default</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="comic-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#09090b] dark:shadow-[3px_3px_0px_0px_#ffffff] transition-all min-h-[44px] disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. ALERTS (Success & Error Banners)                          */}
      {/* ============================================================ */}
      {successMsg && (
        <div className="p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 text-sm flex items-start justify-between gap-3 shadow-[2px_2px_0px_0px_#059669]">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Sukses!</p>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">{successMsg}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-700 dark:text-emerald-400 hover:opacity-75 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl border-2 border-red-600 bg-red-50 dark:bg-red-950/60 text-red-900 dark:text-red-200 text-sm flex items-start justify-between gap-3 shadow-[2px_2px_0px_0px_#dc2626]">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Error Terjadi</p>
              <p className="text-xs text-red-800 dark:text-red-300 mt-0.5">{errorMsg}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-red-700 dark:text-red-400 hover:opacity-75 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Tab Switcher */}
      <div className="flex lg:hidden rounded-xl border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 p-1">
        <button
          type="button"
          onClick={() => setMobileTab("edit")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${
            mobileTab === "edit"
              ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Editor</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 ${
            mobileTab === "preview"
              ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs"
              : "text-zinc-600 dark:text-zinc-400"
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Preview</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* 3. MAIN WORKSPACE (Split: Editor Left / Preview Right)       */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: EDITORS (Categories & Skills) */}
        <div
          className={`lg:col-span-7 space-y-6 ${
            mobileTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Section Header Controls */}
          <div className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-zinc-950/10 dark:border-zinc-800">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-black text-zinc-950 dark:text-white uppercase tracking-tight">
                Section Header Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Chapter Label
                </label>
                <input
                  type="text"
                  value={data.chapterLabel}
                  onChange={(e) => handleHeaderChange("chapterLabel", e.target.value)}
                  placeholder="CHAPTER 02 // ARSENAL"
                  className="w-full px-3.5 py-2.5 rounded-lg border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Section Title
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => handleHeaderChange("title", e.target.value)}
                  placeholder="Skills & Weaponry"
                  className="w-full px-3.5 py-2.5 rounded-lg border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs font-black focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Section Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={data.description}
                onChange={(e) => handleHeaderChange("description", e.target.value)}
                placeholder="A focused toolkit built around scalable web architectures..."
                className="w-full px-3.5 py-2.5 rounded-lg border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              />
            </div>
          </div>

          {/* Categories & Skill Tags List */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-zinc-950 dark:text-white uppercase tracking-tight flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Skill Categories & Toolkits</span>
                </h2>
                <p className="text-xs text-zinc-500">
                  {data.categories.length} kategori • {totalSkillsCount} total tools terdaftar
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddCategory}
                className="comic-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_#ffffff] min-h-[40px] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add Category</span>
              </button>
            </div>

            {data.categories.map((cat, catIdx) => {
              const Icon = getCategoryIcon(cat.category);
              const currentInput = newSkillInputs[catIdx] || "";

              return (
                <div
                  key={catIdx}
                  className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-5 sm:p-6 space-y-4"
                >
                  {/* Category Top Bar */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b-2 border-zinc-950/10 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5 flex-1 max-w-md">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-[1.5px_1.5px_0px_0px_#09090b]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={cat.category}
                        onChange={(e) => handleUpdateCategoryName(catIdx, e.target.value)}
                        placeholder="Nama Kategori (mis. Frontend, Backend...)"
                        className="w-full px-3 py-1.5 rounded-lg border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-white font-black font-mono text-sm uppercase tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[38px]"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Move Up */}
                      <button
                        type="button"
                        disabled={catIdx === 0}
                        onClick={() => handleMoveCategory(catIdx, "up")}
                        title="Geser ke atas"
                        className="comic-panel-sm p-1.5 rounded-lg bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        disabled={catIdx === data.categories.length - 1}
                        onClick={() => handleMoveCategory(catIdx, "down")}
                        title="Geser ke bawah"
                        className="comic-panel-sm p-1.5 rounded-lg bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 disabled:opacity-30 disabled:pointer-events-none min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      {/* Delete Category */}
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(catIdx)}
                        title="Hapus Kategori ini"
                        className="comic-panel-sm p-1.5 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ml-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Skills Pills in Category */}
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 mb-2">
                      Tools & Skills Terdaftar ({cat.skills.length})
                    </label>

                    {cat.skills.length === 0 ? (
                      <p className="text-xs text-zinc-400 italic py-2">
                        Belum ada skill yang ditambahkan pada kategori ini. Gunakan input di bawah untuk menambahkan.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {cat.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 border-2 border-zinc-950 dark:border-zinc-700 shadow-[1.5px_1.5px_0px_0px_#09090b] dark:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.15)] text-xs font-bold group"
                          >
                            <span>{skill.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(catIdx, sIdx)}
                              className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-0.5 rounded cursor-pointer"
                              title={`Hapus ${skill.name}`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add New Tool / Skill input */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddSkill(catIdx, currentInput);
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={currentInput}
                        onChange={(e) =>
                          setNewSkillInputs((prev) => ({
                            ...prev,
                            [catIdx]: e.target.value,
                          }))
                        }
                        placeholder={`Ketik nama tool baru (lalu tekan Enter)...`}
                        className="flex-1 px-3 py-2 rounded-lg border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[40px]"
                      />
                      <button
                        type="submit"
                        disabled={!currentInput.trim()}
                        className="comic-btn inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white text-xs font-bold uppercase tracking-wider disabled:opacity-40 min-h-[40px] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Add</span>
                      </button>
                    </form>

                    {/* Quick Suggestion Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold mr-1">
                        Quick Add:
                      </span>
                      {SUGGESTED_SKILLS.filter(
                        (suggested) =>
                          !cat.skills.some(
                            (s) => s.name.toLowerCase() === suggested.toLowerCase()
                          )
                      )
                        .slice(0, 5)
                        .map((suggested) => (
                          <button
                            key={suggested}
                            type="button"
                            onClick={() => handleAddSkill(catIdx, suggested)}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 border border-zinc-300 dark:border-zinc-700 transition-colors cursor-pointer"
                          >
                            + {suggested}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE COMIC PREVIEW */}
        <div
          className={`lg:col-span-5 sticky top-20 space-y-4 ${
            mobileTab === "edit" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                Live Website Preview
              </h2>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              REAL-TIME SYNC
            </span>
          </div>

          <div className="comic-panel rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/70 comic-halftone p-5 sm:p-6 overflow-hidden">
            {/* Header Preview */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white dark:bg-zinc-850 border-2 border-zinc-950 dark:border-zinc-700 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 rounded-md shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_rgba(99,102,241,0.5)] mb-3">
                <Shield className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                <span>{data.chapterLabel || "CHAPTER 02 // ARSENAL"}</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white mb-2">
                {data.title || "Skills & Weaponry"}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                {data.description || "A focused toolkit built around scalable web architectures..."}
              </p>
            </div>

            {/* Cards Preview Grid */}
            <div className="space-y-4">
              {data.categories.map((group, index) => {
                const Icon = getCategoryIcon(group.category);
                return (
                  <div
                    key={group.category + index}
                    className="comic-panel rounded-xl bg-white dark:bg-zinc-900 p-4 transition-all"
                  >
                    <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b-2 border-zinc-950/10 dark:border-zinc-800">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border-2 border-zinc-950 dark:border-zinc-700 shadow-[1.5px_1.5px_0px_0px_#09090b]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-xs tracking-tight text-zinc-950 dark:text-white uppercase font-mono">
                          {group.category || "UNTITLED"}
                        </h4>
                        <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                          {group.skills.length} core tools
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {group.skills.map((skill) => (
                        <span
                          key={skill.name}
                          className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 border border-zinc-950/30 dark:border-zinc-700"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleResetToDefault}
        title="Kembalikan ke Pengaturan Default?"
        description="Semua data kategori dan skill kustom yang belum disimpan akan dikembalikan ke daftar keahlian bawaan (Frontend, Backend, Database, Tools). Tindakan ini tidak dapat dibatalkan jika Anda menekan Simpan."
        confirmText="Ya, Reset Default"
        variant="danger"
      />
    </div>
  );
}
