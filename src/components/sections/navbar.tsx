"use client";

import * as React from "react";
import Link from "next/link";
import { profileData } from "@/data/profile";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X, ArrowUpRight, Zap } from "lucide-react";

const navLinks = [
  { href: "#about", label: "Origin" },
  { href: "#skills", label: "Arsenal" },
  { href: "#projects", label: "Missions" },
  { href: "#experience", label: "Logbook" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b-2 border-zinc-950 dark:border-zinc-800 py-3 shadow-[0_4px_0_0_rgba(0,0,0,0.06)] dark:shadow-[0_4px_0_0_rgba(99,102,241,0.2)]"
          : "bg-transparent py-4 sm:py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo / Initials Badge */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          aria-label="Home"
        >
          <div className="comic-panel-sm w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-base tracking-wider transition-transform group-hover:rotate-6">
            {profileData.initials}
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-zinc-950 dark:text-zinc-100 text-sm tracking-tight">
              {profileData.name}
            </span>
            <span className="text-[10px] font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
              PORTFOLIO // 2026
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-xl shadow-[2.5px_2.5px_0px_0px_#09090b] dark:shadow-[2.5px_2.5px_0px_0px_rgba(99,102,241,0.6)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions: Theme toggle + Contact CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="#contact"
            className="comic-btn inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500 transition-all min-h-[44px] sm:min-h-9 items-center justify-center"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-indigo-400 dark:text-amber-300" />
            <span>Connect</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="comic-panel-sm p-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-4 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 border-2 border-transparent hover:border-zinc-950 transition-colors min-h-[44px] flex items-center"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 hover:underline min-h-[44px] flex items-center"
            >
              [ Admin Portal ]
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
