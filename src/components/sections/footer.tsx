"use client";

import React from "react";
import Link from "next/link";
import { profileData } from "@/data/profile";
import { ArrowUp, Lock, Zap } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t-2 border-zinc-950 dark:border-zinc-800 py-12 bg-white dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="comic-panel-sm w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
            {profileData.initials}
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              © 2026 {profileData.name}. All rights reserved.
            </p>
            <p className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
              <span>ENGINEERED WITH NEXT.JS 16 & SUPABASE</span>
              <Zap className="w-3 h-3 text-indigo-500 fill-current" />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400">
          <button
            type="button"
            onClick={scrollToTop}
            className="comic-panel-sm px-3 py-1.5 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer min-h-[44px] sm:min-h-auto"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

          <Link
            href="/admin"
            className="comic-panel-sm px-3 py-1.5 rounded-md bg-white dark:bg-zinc-900 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors min-h-[44px] sm:min-h-auto flex items-center gap-1.5"
            title="Admin Login"
          >
            <Lock className="w-3 h-3" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
