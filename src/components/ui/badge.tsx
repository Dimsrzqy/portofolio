import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "outline" | "success" | "muted" | "comic";
}

export function Badge({
  className = "",
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-md border-2 transition-transform";

  const variants = {
    default:
      "border-zinc-950 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-[1.5px_1.5px_0px_0px_#09090b] dark:shadow-[1.5px_1.5px_0px_0px_rgba(255,255,255,0.3)]",
    accent:
      "border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-[2px_2px_0px_0px_#4f46e5] dark:shadow-[2px_2px_0px_0px_rgba(99,102,241,0.6)]",
    outline:
      "border-zinc-900 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100",
    success:
      "border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 shadow-[2px_2px_0px_0px_#059669]",
    muted:
      "border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400",
    comic:
      "border-zinc-950 dark:border-zinc-200 bg-indigo-500 text-white font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#09090b] dark:shadow-[2px_2px_0px_0px_#ffffff] rotate-1",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
