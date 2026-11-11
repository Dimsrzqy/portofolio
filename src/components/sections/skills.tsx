"use client";

import React from "react";
import { profileData } from "@/data/profile";
import { Code2, Server, Database, Wrench, Shield } from "lucide-react";
import { motion } from "framer-motion";

const categoryIcons = {
  Frontend: Code2,
  Backend: Server,
  Database: Database,
  Tools: Wrench,
};

export function Skills() {
  return (
    <section id="skills" className="py-20 sm:py-28 border-t-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 comic-halftone">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-850 border-2 border-zinc-950 dark:border-zinc-700 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 rounded-md shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_rgba(99,102,241,0.5)] mb-4">
            <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>CHAPTER 02 // TECHNICAL ARSENAL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white mb-4">
            Skills & Weaponry
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-400 font-medium">
            A focused toolkit built around scalable web architectures, modern TypeScript conventions, and type-safe databases.
          </p>
        </div>

        {/* 4 Groups Grid (Responsive: 1 col mobile, 2 col tablet, 4 col desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {profileData.skills.map((group, index) => {
            const Icon = categoryIcons[group.category] || Code2;
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="comic-panel rounded-2xl bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between hover:-translate-y-1 transition-all"
              >
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-zinc-950/10 dark:border-zinc-800">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_rgba(99,102,241,0.5)]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm tracking-tight text-zinc-950 dark:text-white uppercase font-mono">
                        {group.category}
                      </h3>
                      <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                        {group.skills.length} core tools
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 border-2 border-zinc-950 dark:border-zinc-700 shadow-[1.5px_1.5px_0px_0px_#09090b] dark:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.2)] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
