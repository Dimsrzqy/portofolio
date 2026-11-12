"use client";

import React from "react";
import Link from "next/link";
import { profileData } from "@/data/profile";
import { Hero3D } from "./hero-3d";
import { ArrowDown, FileDown, Mail, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from "@/components/ui/icons";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden comic-halftone">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Comic Speech-Bubble Badge */}
            <div className="comic-speech-bubble inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 text-xs font-bold uppercase tracking-wider mb-7">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span>{profileData.badge}</span>
            </div>

            {/* Headline */}
            <div className="relative mb-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05]">
                {profileData.headline}
                <span className="text-indigo-600 dark:text-indigo-400">!</span>
              </h1>
            </div>

            {/* Subtitle */}
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-700 dark:text-zinc-300 mb-6 flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-indigo-600 dark:bg-indigo-400 rotate-45" />
              <span>{profileData.subtitle}</span>
            </h2>

            {/* Bio summary */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed mb-8 font-medium">
              Crafting modern, accessible web applications with clean architecture, robust type systems, and delightful tactile interactions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10 w-full sm:w-auto">
              <Link
                href="#projects"
                className="comic-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#09090b] dark:shadow-[3px_3px_0px_0px_#ffffff] min-h-[44px]"
              >
                <span>View Projects</span>
                <ArrowDown className="w-4 h-4" />
              </Link>
              <a
                href="/api/cv"
                target="_blank"
                rel="noopener noreferrer"
                download="CV_Dimas_Rizqy.pdf"
                className="comic-panel-sm w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-bold text-sm uppercase tracking-wider min-h-[44px]"
              >
                <FileDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Download CV</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 text-zinc-800 dark:text-zinc-200">
              <a
                href={profileData.socials.github}
                target="_blank"
                rel="noreferrer"
                className="comic-panel-sm w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform hover:-translate-y-0.5 min-h-[44px] min-w-[44px]"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={profileData.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="comic-panel-sm w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform hover:-translate-y-0.5 min-h-[44px] min-w-[44px]"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={profileData.socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="comic-panel-sm w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform hover:-translate-y-0.5 min-h-[44px] min-w-[44px]"
                aria-label="Twitter Profile"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href={profileData.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="comic-panel-sm w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform hover:-translate-y-0.5 min-h-[44px] min-w-[44px]"
                aria-label="Instagram Profile"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${profileData.email}`}
                className="comic-panel-sm w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform hover:-translate-y-0.5 min-h-[44px] min-w-[44px]"
                aria-label="Email Me"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* 3D Visual Element with Comic Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex items-center justify-center relative"
          >
            <div className="relative w-full max-w-[400px]">
              {/* Comic decorative corner marks */}
              <div className="absolute -top-3 -left-3 px-2 py-0.5 bg-indigo-600 text-white font-mono text-[10px] font-bold uppercase rounded-sm border-2 border-zinc-950 dark:border-white shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_#ffffff] z-10 rotate-[-2deg]">
                3D CORE // V2.0
              </div>
              <Hero3D />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
