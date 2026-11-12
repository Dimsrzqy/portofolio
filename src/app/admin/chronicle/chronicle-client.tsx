"use client";

import React, { useState } from "react";
import { EducationItem, ExperienceItem } from "@/types";
import { type ChronicleData } from "@/lib/supabase/chronicle";
import { updateChronicleAction } from "@/app/actions/chronicle";
import {
  GraduationCap,
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Compass,
  Layers,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

const SUGGESTED_SKILLS = [
  "Next.js",
  "React 19",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "PostgreSQL",
  "Supabase",
  "MySQL",
  "Git",
  "REST APIs",
  "Framer Motion",
  "UI/UX Prototyping",
];

export function ChronicleClient({ initialData }: { initialData: ChronicleData }) {
  const router = useRouter();
  const [data, setData] = useState<ChronicleData>(initialData);
  const [activeTab, setActiveTab] = useState<"education" | "experience">("education");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"education" | "experience">("education");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form Fields - Education
  const [eduInstitution, setEduInstitution] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduPeriod, setEduPeriod] = useState("");
  const [eduLocation, setEduLocation] = useState("");
  const [eduDescription, setEduDescription] = useState("");
  const [eduHighlights, setEduHighlights] = useState("");

  // Form Fields - Experience
  const [expRole, setExpRole] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expPeriod, setExpPeriod] = useState("");
  const [expLocation, setExpLocation] = useState("");
  const [expDescription, setExpDescription] = useState("");
  const [expSkills, setExpSkills] = useState("");

  // Submission State
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Open modal for Adding new item
  const handleAddNew = (type: "education" | "experience") => {
    setModalType(type);
    setEditingIndex(null);

    if (type === "education") {
      setEduInstitution("");
      setEduDegree("");
      setEduPeriod("");
      setEduLocation("");
      setEduDescription("");
      setEduHighlights("");
    } else {
      setExpRole("");
      setExpCompany("");
      setExpPeriod("");
      setExpLocation("");
      setExpDescription("");
      setExpSkills("");
    }

    setIsModalOpen(true);
  };

  // Open modal for Editing existing item
  const handleEdit = (type: "education" | "experience", index: number) => {
    setModalType(type);
    setEditingIndex(index);

    if (type === "education") {
      const item = data.education[index];
      setEduInstitution(item.institution);
      setEduDegree(item.degree);
      setEduPeriod(item.period);
      setEduLocation(item.location);
      setEduDescription(item.description);
      setEduHighlights(item.highlights ? item.highlights.join("\n") : "");
    } else {
      const item = data.experience[index];
      setExpRole(item.role);
      setExpCompany(item.company);
      setExpPeriod(item.period);
      setExpLocation(item.location);
      setExpDescription(item.description);
      setExpSkills(item.skills ? item.skills.join(", ") : "");
    }

    setIsModalOpen(true);
  };

  // Delete item
  const handleDelete = async (type: "education" | "experience", index: number) => {
    const title = type === "education" ? data.education[index].institution : data.experience[index].role;
    if (!window.confirm(`Yakin ingin menghapus "${title}"?`)) return;

    setIsSaving(true);
    let updatedData: ChronicleData;

    if (type === "education") {
      updatedData = {
        ...data,
        education: data.education.filter((_, i) => i !== index),
      };
    } else {
      updatedData = {
        ...data,
        experience: data.experience.filter((_, i) => i !== index),
      };
    }

    const res = await updateChronicleAction(updatedData);
    if (res.success) {
      setData(updatedData);
      setSuccessMsg("Item berhasil dihapus dan beranda telah diperbarui!");
      setTimeout(() => setSuccessMsg(null), 4000);
      router.refresh();
    } else {
      setErrorMsg(res.message || "Gagal menghapus item.");
    }
    setIsSaving(false);
  };

  // Save Modal Form
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);

    let updatedData: ChronicleData;

    if (modalType === "education") {
      const highlightsArray = eduHighlights
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean);

      const newItem: EducationItem = {
        institution: eduInstitution,
        degree: eduDegree,
        period: eduPeriod,
        location: eduLocation,
        description: eduDescription,
        highlights: highlightsArray.length > 0 ? highlightsArray : undefined,
      };

      const newEducationList = [...data.education];
      if (editingIndex !== null) {
        newEducationList[editingIndex] = newItem;
      } else {
        newEducationList.push(newItem);
      }

      updatedData = { ...data, education: newEducationList };
    } else {
      const skillsArray = expSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const newItem: ExperienceItem = {
        role: expRole,
        company: expCompany,
        period: expPeriod,
        location: expLocation,
        description: expDescription,
        skills: skillsArray,
      };

      const newExpList = [...data.experience];
      if (editingIndex !== null) {
        newExpList[editingIndex] = newItem;
      } else {
        newExpList.push(newItem);
      }

      updatedData = { ...data, experience: newExpList };
    }

    const res = await updateChronicleAction(updatedData);
    if (res.success) {
      setData(updatedData);
      setIsModalOpen(false);
      setSuccessMsg("Perubahan Education & Chronicle berhasil disimpan dan langsung tampil di landing page!");
      setTimeout(() => setSuccessMsg(null), 4000);
      router.refresh();
    } else {
      setErrorMsg(res.message || "Gagal menyimpan perubahan ke Supabase.");
    }
    setIsSaving(false);
  };

  const addExpSkill = (skill: string) => {
    const current = expSkills.split(",").map((s) => s.trim()).filter(Boolean);
    if (!current.includes(skill)) {
      setExpSkills(current.length > 0 ? `${expSkills}, ${skill}` : skill);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-zinc-950/10 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300 mb-1.5">
            <Compass className="w-3 h-3 text-indigo-500" />
            <span>CHAPTER 04 // LOGBOOK CMS</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-950 dark:text-white uppercase tracking-tight">
            Education & Chronicle Manager
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Kelola riwayat pendidikan (Academy Track) dan pengalaman kerja (Work Experience).
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleAddNew(activeTab)}
          className="comic-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[44px] cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>
            {activeTab === "education" ? "Tambah Pendidikan" : "Tambah Pengalaman"}
          </span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="font-bold">{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <p className="font-bold">{errorMsg}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 max-w-md">
        <button
          type="button"
          onClick={() => setActiveTab("education")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[38px] ${
            activeTab === "education"
              ? "comic-panel-sm bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border-2 border-zinc-950 dark:border-zinc-700"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Academy Track ({data.education.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("experience")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer min-h-[38px] ${
            activeTab === "experience"
              ? "comic-panel-sm bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border-2 border-zinc-950 dark:border-zinc-700"
              : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Work Experience ({data.experience.length})</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: ACADEMY TRACK (EDUCATION)                             */}
      {/* ============================================================ */}
      {activeTab === "education" && (
        <div className="space-y-4">
          {data.education.length === 0 ? (
            <div className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-8 text-center text-zinc-400">
              Belum ada riwayat pendidikan. Klik tombol &quot;Tambah Pendidikan&quot; untuk menambahkan.
            </div>
          ) : (
            data.education.map((item, idx) => (
              <div
                key={idx}
                className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 border-2 border-zinc-950 dark:border-zinc-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_#ffffff] shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700 font-mono">
                        {item.degree}
                      </span>
                      <h3 className="text-base font-black text-zinc-950 dark:text-white mt-1">
                        {item.institution}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleEdit("education", idx)}
                      className="comic-panel-sm inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 border-2 border-zinc-950 dark:border-zinc-700 transition-colors min-h-[38px] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleDelete("education", idx)}
                      className="comic-panel-sm inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border-2 border-zinc-950 dark:border-zinc-700 transition-colors min-h-[38px] min-w-[38px] cursor-pointer"
                      title="Hapus item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{item.period}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{item.location}</span>
                  </span>
                </div>

                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                  {item.description}
                </p>

                {item.highlights && item.highlights.length > 0 && (
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 block mb-1.5">
                      Highlights:
                    </span>
                    <ul className="space-y-1">
                      {item.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: WORK EXPERIENCE                                     */}
      {/* ============================================================ */}
      {activeTab === "experience" && (
        <div className="space-y-4">
          {data.experience.length === 0 ? (
            <div className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-8 text-center text-zinc-400">
              Belum ada pengalaman kerja. Klik tombol &quot;Tambah Pengalaman&quot; untuk menambahkan.
            </div>
          ) : (
            data.experience.map((item, idx) => (
              <div
                key={idx}
                className="comic-panel-sm rounded-2xl bg-white dark:bg-zinc-900 p-6 border-2 border-zinc-950 dark:border-zinc-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_#ffffff] shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-zinc-950 dark:text-white">
                        {item.role}
                      </h3>
                      <p className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {item.company}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleEdit("experience", idx)}
                      className="comic-panel-sm inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 border-2 border-zinc-950 dark:border-zinc-700 transition-colors min-h-[38px] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleDelete("experience", idx)}
                      className="comic-panel-sm inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-zinc-800 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border-2 border-zinc-950 dark:border-zinc-700 transition-colors min-h-[38px] min-w-[38px] cursor-pointer"
                      title="Hapus item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{item.period}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{item.location}</span>
                  </span>
                </div>

                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                  {item.description}
                </p>

                {item.skills && item.skills.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    {item.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL EDIT / TAMBAH                                          */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="comic-panel-sm w-full max-w-xl max-h-[90vh] rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b-2 border-zinc-950 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                {modalType === "education" ? (
                  <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                )}
                <h2 className="text-base font-black text-zinc-950 dark:text-white uppercase tracking-tight">
                  {editingIndex !== null ? "Edit Item" : "Tambah Item Baru"} •{" "}
                  {modalType === "education" ? "Pendidikan" : "Pengalaman"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveModal} className="p-6 overflow-y-auto space-y-4 flex-1">
              {modalType === "education" ? (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Nama Institusi / Kampus / Sekolah <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={eduInstitution}
                      onChange={(e) => setEduInstitution(e.target.value)}
                      placeholder="Contoh: Politeknik Negeri Jember"
                      className="w-full px-3 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Gelar / Jurusan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={eduDegree}
                      onChange={(e) => setEduDegree(e.target.value)}
                      placeholder="Contoh: Manajemen Informatika"
                      className="w-full px-3 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Periode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={eduPeriod}
                        onChange={(e) => setEduPeriod(e.target.value)}
                        placeholder="Contoh: 2023 — Sekarang"
                        className="w-full px-3 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Lokasi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={eduLocation}
                        onChange={(e) => setEduLocation(e.target.value)}
                        placeholder="Contoh: Jember, Indonesia"
                        className="w-full px-3 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Deskripsi Pendidikan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={eduDescription}
                      onChange={(e) => setEduDescription(e.target.value)}
                      placeholder="Penjelasan fokus bidang studi, pencapaian, atau kegiatan perkuliahan..."
                      className="w-full px-3 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Highlights / Mata Kuliah Utama (1 baris per poin)
                    </label>
                    <textarea
                      rows={3}
                      value={eduHighlights}
                      onChange={(e) => setEduHighlights(e.target.value)}
                      placeholder={"Aktif dalam komunitas teknologi\nMata kuliah: Basis Data, Pemrograman Web"}
                      className="w-full px-3 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400 font-mono"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Posisi / Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={expRole}
                      onChange={(e) => setExpRole(e.target.value)}
                      placeholder="Contoh: Full-Stack Web Developer"
                      className="w-full px-3 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Nama Perusahaan / Organisasi / Freelance <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={expCompany}
                      onChange={(e) => setExpCompany(e.target.value)}
                      placeholder="Contoh: Freelance / Tech Solution Lab"
                      className="w-full px-3 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Periode <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={expPeriod}
                        onChange={(e) => setExpPeriod(e.target.value)}
                        placeholder="Contoh: 2023 — Sekarang"
                        className="w-full px-3 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                        Lokasi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={expLocation}
                        onChange={(e) => setExpLocation(e.target.value)}
                        placeholder="Contoh: Remote / Jember"
                        className="w-full px-3 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Deskripsi Tanggung Jawab & Pekerjaan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={expDescription}
                      onChange={(e) => setExpDescription(e.target.value)}
                      placeholder="Membangun web aplikasi, integrasi database, dan optimasi performa..."
                      className="w-full px-3 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Skills Digunakan (Pisahkan dengan koma) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={expSkills}
                      onChange={(e) => setExpSkills(e.target.value)}
                      placeholder="Next.js, TypeScript, Tailwind CSS, PostgreSQL"
                      className="w-full px-3 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/60 text-xs text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-950 dark:focus:border-indigo-400"
                    />

                    {/* Quick chips */}
                    <div className="flex flex-wrap items-center gap-1 pt-1.5">
                      <span className="text-[10px] text-zinc-400 font-mono">Tambah cepat:</span>
                      {SUGGESTED_SKILLS.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addExpSkill(skill)}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="comic-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
