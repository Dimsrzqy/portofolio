"use client";

import React, { useActionState, useRef, useEffect } from "react";
import { submitContactMessage, type ContactActionResult } from "@/app/actions/contact";
import { profileData } from "@/data/profile";
import { Mail, Send, CheckCircle2, AlertCircle, Radio } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from "@/components/ui/icons";
import { motion } from "framer-motion";

export function Contact() {
  const [state, formAction, isPending] = useActionState<ContactActionResult | null, FormData>(
    submitContactMessage,
    null
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state?.success]);

  return (
    <section id="contact" className="py-20 sm:py-28 border-t-2 border-zinc-950 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Contact & Info */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-zinc-850 border-2 border-zinc-950 dark:border-zinc-700 text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 rounded-md shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_rgba(99,102,241,0.5)] mb-4">
              <Radio className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              <span>TRANSMISSION // OPEN FREQUENCY</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-white mb-4">
              Get in Touch
            </h2>

            <p className="text-base text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed font-medium">
              Have a mission in mind, an engineering internship opportunity, or simply want to talk architecture? Transmit your signal below.
            </p>

            <div className="space-y-4 mb-8">
              <a
                href={`mailto:${profileData.email}`}
                className="comic-panel-sm flex items-center gap-3.5 p-4 rounded-xl bg-white dark:bg-zinc-900 hover:border-indigo-600 dark:hover:border-indigo-400 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-2 border-zinc-950 dark:border-zinc-700 flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_#09090b]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400">
                    Direct Dispatch
                  </p>
                  <p className="text-sm font-black text-zinc-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {profileData.email}
                  </p>
                </div>
              </a>
            </div>

            <div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-3">
                Signal Coordinates
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={profileData.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="comic-panel-sm w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform hover:-translate-y-0.5 min-h-[44px] min-w-[44px]"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a
                  href={profileData.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="comic-panel-sm w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform hover:-translate-y-0.5 min-h-[44px] min-w-[44px]"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a
                  href={profileData.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="comic-panel-sm w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform hover:-translate-y-0.5 min-h-[44px] min-w-[44px]"
                  aria-label="Twitter"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a
                  href={profileData.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="comic-panel-sm w-10 h-10 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-transform hover:-translate-y-0.5 min-h-[44px] min-w-[44px]"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <div className="comic-panel rounded-2xl bg-white dark:bg-zinc-900 p-6 sm:p-8">
              {state?.success && (
                <div className="mb-6 p-4 rounded-xl border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 text-sm flex items-start gap-3 shadow-[2px_2px_0px_0px_#059669]">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="font-bold">{state.message}</p>
                </div>
              )}

              {state && !state.success && (
                <div className="mb-6 p-4 rounded-xl border-2 border-red-600 bg-red-50 dark:bg-red-950/50 text-red-900 dark:text-red-200 text-sm flex items-start gap-3 shadow-[2px_2px_0px_0px_#dc2626]">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="font-bold">{state.message}</p>
                </div>
              )}

              <form ref={formRef} action={formAction} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-1.5"
                  >
                    Your Identifier (Name) *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Alex Graham"
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all min-h-[44px] font-medium shadow-[1.5px_1.5px_0px_0px_#09090b]"
                  />
                  {state?.errors?.name && (
                    <p className="mt-1 text-xs font-bold text-red-600">{state.errors.name[0]}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-1.5"
                  >
                    Return Address (Email) *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="alex@company.com"
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all min-h-[44px] font-medium shadow-[1.5px_1.5px_0px_0px_#09090b]"
                  />
                  {state?.errors?.email && (
                    <p className="mt-1 text-xs font-bold text-red-600">{state.errors.email[0]}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-1.5"
                  >
                    Dispatch Content (Message) *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Describe your inquiry, project scope, or ideas..."
                    className="w-full px-4 py-2.5 rounded-lg border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all resize-y font-medium shadow-[1.5px_1.5px_0px_0px_#09090b]"
                  />
                  {state?.errors?.message && (
                    <p className="mt-1 text-xs font-bold text-red-600">{state.errors.message[0]}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="comic-btn w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_#09090b] dark:shadow-[3px_3px_0px_0px_#ffffff] disabled:opacity-50 min-h-[44px] cursor-pointer"
                >
                  {isPending ? (
                    <span>Transmitting Signal...</span>
                  ) : (
                    <>
                      <span>Send Dispatch</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
