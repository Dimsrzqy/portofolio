import * as React from "react";

export function Card({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl comic-panel bg-white dark:bg-zinc-900/90 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
