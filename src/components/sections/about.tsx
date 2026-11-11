"use client";

import React from "react";
import Image from "next/image";
import { profileData } from "@/data/profile";
import { MapPin, GraduationCap, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-20 sm:py-28 border-t-2 border-zinc-950 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Stylized photo card with comic panel treatment */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5"
          >
            <div className="relative max-w-sm mx-auto lg:max-w-none">
              {/* Comic sticker pin */}
              <div className="absolute -top-3.5 -right-2 bg-indigo-600 text-white font-mono text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-md border-2 border-zinc-950 dark:border-white shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_#ffffff] z-20 rotate-3">
                ORIGIN FILE
              </div>

              <div className="comic-panel relative rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 aspect-4/5">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt={`Portrait of ${profileData.name}`}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-block px-2 py-0.5 bg-indigo-600 text-[10px] font-bold uppercase rounded-sm mb-1">
                    ENGINEER PROFILE
                  </div>
                  <p className="font-black text-base tracking-tight">{profileData.name}</p>
                  <p className="text-xs text-zinc-300 flex items-center gap-1.5 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{profileData.location}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Bio and 3 Stats */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Comic Chapter Header */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 rounded-md shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_rgba(99,102,241,0.5)] mb-4 self-start">
              <Bookmark className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>CHAPTER 01 // ORIGIN & PHILOSOPHY</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white mb-6 leading-tight">
              Engineering with purpose, precision, and simplicity.
            </h2>

            <div className="space-y-4 text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mb-8">
              <p>{profileData.bio}</p>
              <p>
                My approach combines strong software design principles with a deep attention to user ergonomics. Whether architecting database models or fine-tuning micro-interactions, I prioritize code readability, maintainability, and end-user performance.
              </p>
            </div>

            {/* Comic Narrator Box for Academic Base */}
            <div className="comic-panel-sm flex items-center gap-3.5 p-4 rounded-xl bg-white dark:bg-zinc-900 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 mb-10 border-l-4 border-l-indigo-600">
              <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <span className="font-bold text-zinc-950 dark:text-white uppercase font-mono text-xs block text-indigo-600 dark:text-indigo-400">
                  Academic Affiliation
                </span>
                <span>Informatics Management, Politeknik Negeri Jember</span>
              </div>
            </div>

            {/* 3 Comic Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {profileData.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`comic-panel-sm p-4 rounded-xl bg-white dark:bg-zinc-900 ${
                    i === 0 ? "hover:rotate-1" : i === 1 ? "hover:-rotate-1" : "hover:rotate-1"
                  } transition-transform`}
                >
                  <p className="text-3xl sm:text-4xl font-black tracking-tight text-indigo-600 dark:text-indigo-400 mb-1 font-mono">
                    {stat.value}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wide text-zinc-950 dark:text-white mb-0.5">
                    {stat.label}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
