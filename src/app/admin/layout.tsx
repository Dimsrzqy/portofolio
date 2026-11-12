import React from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminUserDropdown } from "./admin-user-dropdown";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#09090c] text-zinc-950 dark:text-zinc-50 flex flex-col lg:flex-row">
      {/* Sidebar Component (Desktop persistent + Mobile drawer) */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 xl:pl-72 flex flex-col min-h-screen w-full">
        {/* Top Desktop Bar - Exactly aligned with sidebar header (h-16, border-b-2 border-zinc-950 dark:border-zinc-800) */}
        <header className="hidden lg:flex items-center justify-end px-8 h-16 border-b-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-30 shrink-0">
          {/* Top Right: Theme Toggle & User Profile Dropdown */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <AdminUserDropdown />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Minimal Admin Footer */}
        <footer className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400 font-mono">
          <span>DIMAS RIZQY (DIMSRZQY) ADMIN HQ • {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
}
