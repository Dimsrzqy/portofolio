"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { profileData } from "@/data/profile";
import { useLanguage } from "@/context/language-context";
import { ArrowDown, FileDown, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from "@/components/ui/icons";
import { motion, useReducedMotion } from "framer-motion";

const heroTech = [
  { name: "Laravel", logo: "laravel", position: "left-0 top-[17%] -translate-x-1/2 -rotate-8" },
  { name: "Next.js", logo: "nextjs", position: "right-0 top-[12%] translate-x-1/2 rotate-8" },
  { name: "Tailwind CSS", logo: "tailwindcss", position: "left-0 top-[48%] -translate-x-1/2 rotate-5" },
  { name: "MySQL", logo: "mysql", position: "right-0 top-[43%] translate-x-1/2 -rotate-6" },
  { name: "Flutter", logo: "flutter", position: "left-0 top-[79%] -translate-x-1/2 -rotate-6" },
  { name: "Python", logo: "python", position: "right-0 top-[74%] translate-x-1/2 rotate-7" },
];

const typingStart = 270;
const headlineInterval = 64;
const subtitleInterval = 34;

function TypedText({ text, start, interval, loop = false }: {
  text: string;
  start: number;
  interval: number;
  loop?: boolean;
}) {
  const characters = Array.from(text);
  const length = characters.length;
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState<number | null>(null);

  useEffect(() => {
    if (reduceMotion || length === 0) return;

    let count = 0;
    let timer = window.setTimeout(() => {
      setVisible(0);
      timer = window.setTimeout(typeNext, start);
    }, 0);

    function typeNext() {
      count += 1;
      setVisible(count);

      if (count < length) {
        timer = window.setTimeout(typeNext, interval);
      } else if (loop) {
        timer = window.setTimeout(() => {
          count = 0;
          setVisible(0);
          timer = window.setTimeout(typeNext, 210);
        }, 1600);
      }
    }

    return () => window.clearTimeout(timer);
  }, [text, start, interval, length, loop, reduceMotion]);

  const visibleCount = reduceMotion ? length : (visible ?? length);
  const caretIndex = visibleCount < length ? visibleCount - 1 : -1;

  return (
    <span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {characters.map((character, index) => (
          <span
            key={index}
            className={loop && index === length - 1
              ? "text-indigo-600 dark:text-indigo-400"
              : undefined}
            style={{
              visibility: index >= visibleCount ? "hidden" : undefined,
              position: index === caretIndex ? "relative" : undefined,
            }}
          >
            {character}
            {index === caretIndex && (
              <span className="pointer-events-none absolute start-full top-1/2 h-[0.9em] w-0.5 -translate-y-1/2 bg-indigo-600 dark:bg-indigo-400" />
            )}
          </span>
        ))}
      </span>
    </span>
  );
}

export function Hero() {
  const { language, t } = useLanguage();
  const isId = language === "id";
  const headline = `${t.hero.headlinePrefix} ${profileData.name}!`;
  const subtitleStart = typingStart + Array.from(headline).length * headlineInterval + 125;
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
            <div className="comic-speech-bubble px-3.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 text-xs font-bold uppercase tracking-wider mb-7">
              {t.hero.badge}
            </div>

            {/* Headline */}
            <div className="relative mb-3">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-950 dark:text-white leading-[1.05]">
                <TypedText key={headline} text={headline} start={typingStart} interval={headlineInterval} loop />
              </h1>
            </div>

            {/* Subtitle */}
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-700 dark:text-zinc-300 mb-6 flex items-center gap-2">
              <span aria-hidden="true" className="inline-block size-3 shrink-0 bg-indigo-600 dark:bg-indigo-400 rotate-45" />
              <TypedText text={t.hero.subtitle} start={subtitleStart} interval={subtitleInterval} />
            </h2>

            {/* Bio summary */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed mb-8 font-medium">
              {t.hero.bio}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10 w-full sm:w-auto">
              <Link
                href="#projects"
                className="comic-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#09090b] dark:shadow-[3px_3px_0px_0px_#ffffff] min-h-[44px]"
              >
                <span>{t.hero.viewProjects}</span>
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
                <span>{t.hero.downloadCv}</span>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 text-zinc-800 dark:text-zinc-200">
              {profileData.socials.github && (
                <a
                  href={profileData.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="comic-panel-sm w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform hover:-translate-y-0.5 min-h-[44px] min-w-[44px]"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {profileData.socials.linkedin && (
                <a
                  href={profileData.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="comic-panel-sm w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform hover:-translate-y-0.5 min-h-[44px] min-w-[44px]"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {profileData.socials.instagram && (
                <a
                  href={profileData.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="comic-panel-sm w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform hover:-translate-y-0.5 min-h-[44px] min-w-[44px]"
                  aria-label="Instagram Profile"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {profileData.socials.twitter && (
                <a
                  href={profileData.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="comic-panel-sm w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform hover:-translate-y-0.5 min-h-[44px] min-w-[44px]"
                  aria-label="Twitter Profile"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              )}
              {profileData.email && (
                <a
                  href={`mailto:${profileData.email}`}
                  className="comic-panel-sm w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform hover:-translate-y-0.5 min-h-[44px] min-w-[44px]"
                  aria-label="Email Me"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          <div className="group mx-auto w-full max-w-[368px] min-w-0 px-7 perspective-distant sm:px-8 lg:col-span-5">
            <div className="relative motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:rotate-x-3 motion-safe:group-hover:-rotate-y-6">
              <div className="comic-panel relative aspect-5/6 overflow-hidden rounded-2xl bg-indigo-50 dark:bg-zinc-900">
                <div aria-hidden="true" className="comic-halftone absolute inset-0" />
                <div className="absolute inset-x-[10%] top-[5%] h-[132%]">
                  <Image
                    src="/IMG_7944-comic.webp"
                    alt={isId ? "Ilustrasi komik Dimas mengenakan ransel" : "Comic portrait of Dimas wearing a backpack"}
                    fill
                    loading="eager"
                    sizes="(max-width: 400px) calc(80vw - 74px), 250px"
                    className="object-contain object-top drop-shadow-[5px_3px_0_#6366f1]"
                  />
                </div>
              </div>
              <ul role="list" aria-label={isId ? "Teknologi" : "Technologies"} className="absolute inset-0">
                {heroTech.map(({ name, logo, position }) => (
                  <li
                    key={logo}
                    className={`comic-panel-sm absolute grid size-11 -translate-y-1/2 place-items-center rounded-lg bg-white sm:size-12 ${position}`}
                  >
                    <Image src={`/tech/${logo}.svg`} alt={name} title={name} width={28} height={28} unoptimized />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Scroll Indicator Cue */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-14 sm:mt-16 flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
        >
          <span>{isId ? "GULIR KE BAWAH // EKSPLORASI" : "SCROLL TO EXPLORE // DISCOVER"}</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
