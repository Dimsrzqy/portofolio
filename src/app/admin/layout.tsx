import React, { Suspense } from "react";
import { AdminHeader } from "./admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col">
      <Suspense
        fallback={
          <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 h-16" />
        }
      >
        <AdminHeader />
      </Suspense>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        {children}
      </main>
    </div>
  );
}
