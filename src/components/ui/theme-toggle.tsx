"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-lg border-2 border-zinc-900 dark:border-zinc-700 bg-transparent ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`comic-panel-sm inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 active:translate-x-0.5 active:translate-y-0.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[44px] min-w-[44px] sm:min-h-9 sm:min-w-9 cursor-pointer ${className}`}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-900 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
