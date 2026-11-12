"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ChevronDown,
  ExternalLink,
  LogOut,
} from "lucide-react";

interface AdminUserDropdownProps {
  initialEmail?: string;
}

export function AdminUserDropdown({
  initialEmail = "dimasrizqy021@gmail.com",
}: AdminUserDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch actual logged in user
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setEmail(data.user.email);
      }
    });
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="comic-panel-sm flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border-2 border-zinc-950 dark:border-zinc-700 min-h-[44px] cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar Icon */}
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black font-mono text-sm border border-zinc-950 dark:border-zinc-700 shrink-0 shadow-[1.5px_1.5px_0px_0px_#09090b] dark:shadow-[1.5px_1.5px_0px_0px_#6366f1]">
          D
        </div>

        {/* User Info */}
        <div className="text-left hidden sm:block max-w-[180px] md:max-w-[220px]">
          <p className="text-xs font-bold text-zinc-950 dark:text-white truncate">
            {email}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] text-zinc-400 font-mono">Super Admin</span>
          </div>
        </div>

        {/* Dropdown Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="comic-panel-sm absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
          {/* Header section in dropdown */}
          <div className="p-3 border-b-2 border-zinc-100 dark:border-zinc-800/80 mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black font-mono text-sm border border-zinc-950 dark:border-zinc-700 shadow-sm">
                D
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-zinc-950 dark:text-white truncate">
                  {email}
                </p>
                <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                  <span>Authenticated Admin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            <Link
              href="/"
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-zinc-500" />
                <span>Visit Public Site</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">Preview ↗</span>
            </Link>
          </div>

          {/* Logout Section */}
          <div className="pt-1 mt-1 border-t border-zinc-100 dark:border-zinc-800/80">
            <button
              type="button"
              disabled={isSigningOut}
              onClick={handleSignOut}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4" />
                <span>{isSigningOut ? "Signing Out..." : "Log Out"}</span>
              </div>
              <span className="text-[10px] font-mono opacity-60">End Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
