"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { profileData } from "@/data/profile";
import {
  LayoutDashboard,
  FolderGit2,
  Mail,
  ExternalLink,
  LogOut,
} from "lucide-react";

export function AdminHeader() {
  const pathname = usePathname() || "";
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/admin/projects", label: "Projects", icon: FolderGit2, exact: false },
    { href: "/admin/messages", label: "Messages", icon: Mail, exact: false },
  ];

  return (
    <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 font-bold text-sm tracking-tight"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center text-xs font-bold">
              {profileData.initials}
            </div>
            <span className="hidden sm:inline-block">Admin Studio</span>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[44px] sm:min-h-8 ${
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold"
                      : "text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 dark:hover:text-white px-2.5 py-1.5 rounded-lg transition-colors min-h-[44px] sm:min-h-auto flex items-center"
            title="Preview public site"
          >
            <span>View Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer min-h-[44px] sm:min-h-auto flex items-center"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
