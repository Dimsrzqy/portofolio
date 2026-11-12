"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { profileData } from "@/data/profile";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AdminUserDropdown } from "./admin-user-dropdown";
import {
  LayoutDashboard,
  FolderGit2,
  GraduationCap,
  Mail,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname() || "";
  const [isOpen, setIsOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    {
      href: "/admin",
      label: "Overview",
      badge: "HQ",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/projects",
      label: "Projects",
      badge: "CMS",
      icon: FolderGit2,
      exact: false,
    },
    {
      href: "/admin/chronicle",
      label: "Chronicle",
      badge: "EDU",
      icon: GraduationCap,
      exact: false,
    },
    {
      href: "/admin/messages",
      label: "Messages",
      badge: "Inbox",
      icon: Mail,
      exact: false,
    },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Top Header / Branding - Exactly aligned with navbar (h-16) */}
      <div className="h-16 flex items-center px-5 border-b-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
        <Link
          href="/admin"
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black font-mono text-sm border-2 border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_#ffffff] transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none shrink-0">
            {profileData.initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight text-zinc-950 dark:text-white uppercase">
                DIMSRZQY
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-300 dark:border-indigo-700">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono truncate">
              Portfolio Control
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Control Navigation
        </div>

        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                isActive
                  ? "comic-panel-sm bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 border-2 border-zinc-950 dark:border-indigo-400 font-bold"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center border-2 transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white border-zinc-950 dark:border-zinc-700"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-transparent group-hover:border-zinc-950 dark:group-hover:border-zinc-600"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>{item.label}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    isActive
                      ? "bg-indigo-200/80 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                  }`}
                >
                  {item.badge}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? "text-indigo-600 dark:text-indigo-400 translate-x-0.5" : "text-zinc-400 opacity-0 group-hover:opacity-100"
                  }`}
                />
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* ============================================================ */}
      {/* DESKTOP SIDEBAR (lg and up)                                 */}
      {/* ============================================================ */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 fixed inset-y-0 left-0 z-40 bg-white dark:bg-zinc-900 border-r-2 border-zinc-950 dark:border-zinc-800 shadow-sm">
        <NavContent />
      </aside>

      {/* ============================================================ */}
      {/* MOBILE TOP BAR (below lg)                                   */}
      {/* ============================================================ */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-16 bg-white dark:bg-zinc-900 border-b-2 border-zinc-950 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="comic-panel-sm inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white min-h-[44px] min-w-[44px] cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs border border-zinc-950 dark:border-zinc-700">
              {profileData.initials}
            </div>
            <span className="font-black text-sm text-zinc-950 dark:text-white uppercase tracking-tight">
              DIMSRZQY
            </span>
          </Link>
        </div>

        {/* Mobile Top Right User & Theme */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AdminUserDropdown />
        </div>
      </header>

      {/* ============================================================ */}
      {/* MOBILE DRAWER OVERLAY                                        */}
      {/* ============================================================ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-zinc-900 border-r-2 border-zinc-950 dark:border-zinc-800 flex flex-col shadow-2xl animate-in slide-in-from-left duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button in mobile drawer */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800 h-16">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
                Admin Navigation
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer min-h-[44px] min-w-[44px]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <NavContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
