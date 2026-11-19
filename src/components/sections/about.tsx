"use client";

import React from "react";
import Image from "next/image";
import { profileData } from "@/data/profile";
import { translations } from "@/data/translations";
import { useLanguage } from "@/context/language-context";
import { MapPin, Bookmark } from "lucide-react";
import { AboutData } from "@/types";

interface AboutProps {
  data?: AboutData;
}

interface AboutPanelsProps extends AboutProps {
  headingId?: string;
  preview?: boolean;
}

export function AboutPanels({ data, headingId, preview = false }: AboutPanelsProps) {
  const { language, t } = useLanguage();
  const isId = language === "id";

  const name = data?.name || profileData.name;
  const location = data?.location || profileData.location;
  const enteredPhotoUrl = data?.photoUrl?.trim() || "";
  const isPreviewPhotoUrl =
    (enteredPhotoUrl.startsWith("/") && !enteredPhotoUrl.startsWith("//")) ||
    (/^https?:\/\//i.test(enteredPhotoUrl) && URL.canParse(enteredPhotoUrl));
  const photoUrl = (preview && !isPreviewPhotoUrl ? "" : enteredPhotoUrl) ||
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
    isId && (!data || data.title === translations.en.about.title)
      ? t.about.title
      : data?.title || t.about.title;

  const rawBioText = [data?.bioParagraph1?.trim(), data?.bioParagraph2?.trim()]
    .filter(Boolean)
    .join("\n\n") || t.about.bio1;

  const { bio1, bio2 } = translations.en.about;
  const bioParagraphs =
    rawBioText.trim() === `${bio1} ${bio2}\n\ncontoh`
      ? [bio1, bio2]
      : rawBioText.split(/\r?\n/).map((paragraph) => paragraph.trim()).filter(Boolean);

  return (
    <div className="@container">
      <div className="mx-auto grid max-w-2xl gap-4 @min-[44rem]:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] @min-[60rem]:max-w-none @min-[60rem]:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] @min-[60rem]:grid-rows-[auto_1fr] @min-[60rem]:gap-5">
        <header className="comic-panel min-w-0 overflow-hidden rounded-2xl bg-white wrap-anywhere dark:bg-zinc-900 @min-[44rem]:col-span-2 @min-[60rem]:col-span-1 @min-[60rem]:col-start-2 @min-[60rem]:row-start-1">
          <div className="flex items-start gap-2 border-b-2 border-zinc-950 bg-indigo-700 px-4 py-2.5 font-mono text-xs font-bold tracking-wide text-white uppercase dark:border-zinc-700 @min-[36rem]:px-6">
            <Bookmark aria-hidden="true" className="mt-px size-3.5 shrink-0" />
            <span>{chapterLabel}</span>
          </div>
          <div className="relative px-4 py-6 @min-[36rem]:px-6 @min-[36rem]:py-7 @min-[60rem]:px-8">
            <div aria-hidden="true" className="comic-halftone pointer-events-none absolute inset-y-0 right-0 w-1/3" />
            <h2
              id={headingId}
              className="relative max-w-[23ch] text-3xl leading-[1.1] font-black tracking-tight text-balance text-zinc-950 dark:text-white @min-[36rem]:text-4xl xl:@min-[68rem]:text-5xl"
            >
              {title}
            </h2>
          </div>
        </header>

        <figure className="comic-panel flex min-w-0 flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 @min-[44rem]:col-start-1 @min-[44rem]:row-start-2 @min-[60rem]:row-span-2 @min-[60rem]:row-start-1">
          <div className="relative aspect-[6/5] min-h-56 flex-1 bg-zinc-200 dark:bg-zinc-800 @min-[44rem]:aspect-auto @min-[60rem]:min-h-80">
            <Image
              src={photoUrl}
              alt={isId ? `Potret ${name}` : `Portrait of ${name}`}
              fill
              unoptimized={preview}
              className="object-cover grayscale"
              sizes="(min-width: 1152px) 394px, (min-width: 1024px) 35vw, (min-width: 768px) 263px, (min-width: 720px) 672px, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
            />
            <span className="absolute top-3 right-3 max-w-[calc(100%-1.5rem)] rotate-2 rounded-md border-2 border-zinc-950 bg-indigo-600 px-2.5 py-1 text-[11px] font-bold font-mono uppercase wrap-anywhere text-white shadow-[2px_2px_0px_0px_#09090b] dark:border-zinc-200">
              {stickerText}
            </span>
          </div>
          <figcaption className="border-t-2 border-zinc-950 px-4 py-3.5 wrap-anywhere dark:border-zinc-700 @min-[36rem]:px-5">
            <p className="text-[11px] font-bold font-mono tracking-wide uppercase text-indigo-700 dark:text-indigo-300">
              {badge}
            </p>
            <p className="mt-0.5 text-lg font-black tracking-tight text-zinc-950 dark:text-white">
              {name}
            </p>
            <p className="mt-0.5 flex items-start gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              <MapPin aria-hidden="true" className="mt-px size-3.5 shrink-0 text-indigo-700 dark:text-indigo-300" />
              <span>{location}</span>
            </p>
          </figcaption>
        </figure>

        <div className="grid min-w-0 auto-rows-auto gap-4 wrap-anywhere @min-[44rem]:col-start-2 @min-[44rem]:row-start-2 @min-[60rem]:gap-5 xl:@min-[68rem]:grid-cols-2">
          {bioParagraphs.map((paragraph, index) => (
            <div
              key={index}
              className="comic-panel-sm min-w-0 rounded-xl bg-white p-4 text-sm leading-relaxed text-zinc-700 first:bg-indigo-50 dark:bg-zinc-900 dark:text-zinc-200 dark:first:bg-indigo-950/60 @min-[36rem]:p-5 xl:@min-[68rem]:only:col-span-full"
            >
              <p>{paragraph}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function About({ data }: AboutProps) {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="scroll-mt-12 border-t-2 border-zinc-950 py-20 dark:border-zinc-800 sm:scroll-mt-0 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <AboutPanels data={data} headingId="about-title" />
      </div>
    </section>
  );
}
