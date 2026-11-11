"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types";
import { ExternalLink, ArrowUpRight, Crosshair, Star } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import { motion } from "framer-motion";

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="py-20 sm:py-28 border-t-2 border-zinc-950 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-850 border-2 border-zinc-950 dark:border-zinc-700 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 rounded-md shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_rgba(99,102,241,0.5)] mb-4">
              <Crosshair className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>CHAPTER 03 // FEATURED MISSIONS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white mb-4">
              Selected Projects
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400 font-medium">
              A curated selection of web platforms, enterprise dashboards, and open tools crafted with tactile precision.
            </p>
          </div>

          <div className="px-3 py-1 rounded-md border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-mono font-bold uppercase shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_rgba(99,102,241,0.5)] self-start md:self-auto">
            {projects.length} MISSION{projects.length > 1 ? "S" : ""} DEPLOYED
          </div>
        </div>

        {/* Projects Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="comic-panel rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#09090b] dark:hover:shadow-[6px_6px_0px_0px_rgba(99,102,241,0.9)] transition-all duration-200"
            >
              <div>
                {/* Project Image */}
                <Link
                  href={`/projects/${project.slug}`}
                  className="relative block aspect-16/10 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-b-2 border-zinc-950 dark:border-zinc-700 group"
                >
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {project.featured && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-wider rounded-md border-2 border-zinc-950 dark:border-white shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_#ffffff] rotate-[-2deg] flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current text-amber-300" />
                      <span>FEATURED</span>
                    </div>
                  )}
                </Link>

                {/* Card Body */}
                <div className="p-6">
                  <h3 className="font-black text-lg text-zinc-950 dark:text-white tracking-tight mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Link href={`/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-5 leading-relaxed font-normal">
                    {project.description}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-950/20 dark:border-zinc-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions / Links */}
              <div className="p-6 pt-0">
                <div className="flex items-center justify-between pt-4 border-t-2 border-zinc-950/10 dark:border-zinc-800">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="comic-btn inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all min-h-[36px]"
                  >
                    <span>Read Dossier</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="comic-panel-sm p-1.5 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                        aria-label={`GitHub repository for ${project.title}`}
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="comic-panel-sm p-1.5 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                        aria-label={`Live demo for ${project.title}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
