"use client";

import React from "react";
import { profileData } from "@/data/profile";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-zinc-950 dark:border-zinc-800 py-10 bg-white dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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

        <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
          DESIGNED FOR IMPACT // HIGH PERFORMANCE
        </p>
      </div>
    </footer>
  );
}
