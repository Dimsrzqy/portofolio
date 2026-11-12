"use client";

import React from "react";
import { profileData } from "@/data/profile";
import { EducationItem, ExperienceItem } from "@/types";
import { Briefcase, GraduationCap, Calendar, MapPin, Compass } from "lucide-react";
import { motion } from "framer-motion";

interface EducationExperienceProps {
  education?: EducationItem[];
  experience?: ExperienceItem[];
}

export function EducationExperience({
  education = profileData.education,
  experience = profileData.experience,
}: EducationExperienceProps) {
  return (
    <section id="experience" className="py-20 sm:py-28 border-t-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70 comic-halftone">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-850 border-2 border-zinc-950 dark:border-zinc-700 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 rounded-md shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_rgba(99,102,241,0.5)] mb-4">
            <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>CHAPTER 04 // LOGBOOK & MILESTONES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white mb-4">
            Education & Chronicle
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-400 font-medium">
            My academic journey at Politeknik Negeri Jember alongside hands-on software development experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Education Column */}
          <div>
            <div className="flex items-center gap-2.5 text-base font-black uppercase font-mono tracking-tight text-zinc-950 dark:text-white mb-8 pb-3 border-b-2 border-zinc-950 dark:border-zinc-700">
              <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Academy Track</span>
            </div>

            <div className="relative pl-7 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[3px] before:bg-zinc-950 dark:before:bg-zinc-700">
              {education.map((item, index) => (
                <motion.div
                  key={item.institution}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* Comic Node */}
                  <span className="absolute -left-[30px] top-2 w-4 h-4 rounded-full bg-indigo-600 border-2 border-zinc-950 dark:border-white shadow-[1.5px_1.5px_0px_0px_#09090b]" />

                  <div className="comic-panel-sm p-6 rounded-2xl bg-white dark:bg-zinc-900">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-600 dark:border-indigo-400">
                        {item.degree}
                      </span>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        {item.period}
                      </span>
                    </div>

                    <h3 className="font-black text-lg text-zinc-950 dark:text-white tracking-tight mb-1">
                      {item.institution}
                    </h3>

                    <p className="text-xs font-semibold text-zinc-500 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.location}
                    </p>

                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed font-normal">
                      {item.description}
                    </p>

                    {item.highlights && (
                      <ul className="space-y-1.5 border-t-2 border-zinc-950/10 dark:border-zinc-800 pt-3">
                        {item.highlights.map((h, i) => (
                          <li
                            key={i}
                            className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1.5 shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Experience Column */}
          <div>
            <div className="flex items-center gap-2.5 text-base font-black uppercase font-mono tracking-tight text-zinc-950 dark:text-white mb-8 pb-3 border-b-2 border-zinc-950 dark:border-zinc-700">
              <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Work Experience</span>
            </div>

            <div className="relative pl-7 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[3px] before:bg-zinc-950 dark:before:bg-zinc-700">
              {experience.map((item, index) => (
                <motion.div
                  key={item.role + item.company}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* Comic Node */}
                  <span className="absolute -left-[30px] top-2 w-4 h-4 rounded-full bg-indigo-600 border-2 border-zinc-950 dark:border-white shadow-[1.5px_1.5px_0px_0px_#09090b]" />

                  <div className="comic-panel-sm p-6 rounded-2xl bg-white dark:bg-zinc-900">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <span className="font-black text-base text-zinc-950 dark:text-white tracking-tight">
                        {item.role}
                      </span>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        {item.period}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1 uppercase font-mono">
                      @ {item.company}
                    </p>

                    <p className="text-xs font-semibold text-zinc-500 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.location}
                    </p>

                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed font-normal">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {item.skills.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-950/20 dark:border-zinc-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
