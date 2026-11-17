"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { Languages } from "lucide-react";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-14 h-9 rounded-lg border-2 border-zinc-900 dark:border-zinc-700 bg-transparent ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isIndonesian = language === "id";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`comic-panel-sm inline-flex items-center justify-center gap-1.5 px-2.5 h-9 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 active:translate-x-0.5 active:translate-y-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[44px] sm:min-h-9 cursor-pointer group ${className}`}
      aria-label={isIndonesian ? "Ganti ke Bahasa Inggris (Switch to English)" : "Ganti ke Bahasa Indonesia"}
      title={isIndonesian ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
    >
      <Languages className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform" />
      <span className="text-xs font-mono font-black tracking-wider uppercase">
        {isIndonesian ? "ID" : "EN"}
      </span>
    </button>
  );
}
