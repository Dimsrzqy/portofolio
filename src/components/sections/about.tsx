"use client";

import React from "react";
import Image from "next/image";
import { profileData } from "@/data/profile";
import { useLanguage } from "@/context/language-context";
import { MapPin, GraduationCap, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { AboutData } from "@/types";

interface AboutProps {
  data?: AboutData;
}

export function About({ data }: AboutProps) {
  const { language, t } = useLanguage();
  const isId = language === "id";

  const name = data?.name || profileData.name;
  const location = data?.location || profileData.location;
  const photoUrl =
    data?.photoUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";

  const stickerText =
    isId && (!data || data.stickerText === "ORIGIN FILE")
      ? t.about.sticker
      : data?.stickerText || t.about.sticker;

  const badge =
    isId && (!data || data.badge === "ENGINEER PROFILE")
      ? t.about.profileTag
      : data?.badge || t.about.profileTag;

  const chapterLabel =
    isId && (!data || data.chapterLabel === "CHAPTER 01 // ORIGIN & PHILOSOPHY")
      ? t.about.chapter
      : data?.chapterLabel || t.about.chapter;

  const title =
    isId && (!data || data.title.includes("Engineering with purpose"))
      ? t.about.title
      : data?.title || t.about.title;

  const bioParagraph1 =
    isId && (!data || data.bioParagraph1.includes("Passionate Web Developer"))
      ? t.about.bio1
      : data?.bioParagraph1 || t.about.bio1;

  const bioParagraph2 =
    isId && (!data || data.bioParagraph2.includes("My approach combines"))
      ? t.about.bio2
      : data?.bioParagraph2 || t.about.bio2;

  const academicRole =
    isId && (!data || data.academicRole === "Academic Affiliation")
      ? t.about.academicRole
      : data?.academicRole || t.about.academicRole;

  const academicInstitution =
    isId && (!data || data.academicInstitution.includes("Informatics Management"))
      ? t.about.academicInstitution
      : data?.academicInstitution || t.about.academicInstitution;

  const rawStats = data?.stats && data.stats.length > 0 ? data.stats : profileData.stats;
  const stats = rawStats.map((st, i) => {
    if (!isId) return st;
    if (i === 0) return { ...st, label: t.about.stats.yearsCoding, description: t.about.stats.yearsDesc };
    if (i === 1) return { ...st, label: t.about.stats.projectsCompleted, description: t.about.stats.projectsDesc };
    if (i === 2) return { ...st, label: t.about.stats.cleanCodeFocus, description: t.about.stats.cleanCodeDesc };
    return st;
  });

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
                {stickerText}
              </div>

              <div className="comic-panel relative rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 aspect-4/5">
                <Image
                  src={photoUrl}
                  alt={`Portrait of ${name}`}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="inline-block px-2 py-0.5 bg-indigo-600 text-[10px] font-bold uppercase rounded-sm mb-1">
                    {badge}
                  </div>
                  <p className="font-black text-base tracking-tight">{name}</p>
                  <p className="text-xs text-zinc-300 flex items-center gap-1.5 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{location}</span>
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
              <span>{chapterLabel}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white mb-6 leading-tight">
              {title}
            </h2>

            <div className="space-y-4 text-zinc-700 dark:text-zinc-300 text-base leading-relaxed mb-8">
              <p>{bioParagraph1}</p>
              <p>{bioParagraph2}</p>
            </div>

            {/* Comic Narrator Box for Academic Base */}
            <div className="comic-panel-sm flex items-center gap-3.5 p-4 rounded-xl bg-white dark:bg-zinc-900 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 mb-10 border-l-4 border-l-indigo-600">
              <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <span className="font-bold text-zinc-950 dark:text-white uppercase font-mono text-xs block text-indigo-600 dark:text-indigo-400">
                  {academicRole}
                </span>
                <span>{academicInstitution}</span>
              </div>
            </div>

            {/* 3 Comic Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, i) => (
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
