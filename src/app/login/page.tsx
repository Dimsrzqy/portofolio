"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { profileData } from "@/data/profile";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Lock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  KeyRound,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const supabase = createClient();
    if (!supabase) {
      setErrorMessage(
        "Supabase belum terkonfigurasi. Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY sudah diisi pada file .env.local"
      );
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        router.push("/admin");
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat proses login.";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#09090c] text-zinc-950 dark:text-zinc-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 comic-halftone relative selection:bg-indigo-500 selection:text-white">
      {/* Top Floating Header */}
      <header className="fixed top-5 inset-x-0 max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between z-30 pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto comic-panel-sm inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Authentication Box */}
      <div className="w-full max-w-md mx-auto pt-10 sm:pt-6 z-10">
        {/* Brand Avatar & Heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black font-mono text-2xl border-2 border-zinc-950 dark:border-white shadow-[3.5px_3.5px_0px_0px_#09090b] dark:shadow-[3.5px_3.5px_0px_0px_#6366f1] rotate-[-2deg] hover:rotate-0 transition-transform">
              {profileData.initials}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-white">
            Control Center
          </h1>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            Masuk dengan akun terdaftar untuk mengelola portofolio.
          </p>
        </div>

        {/* Comic Panel Card */}
        <div className="comic-panel rounded-2xl border-2 border-zinc-950 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-[5px_5px_0px_0px_#09090b] dark:shadow-[5px_5px_0px_0px_rgba(99,102,241,0.7)]">
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5 shadow-[2px_2px_0px_0px_#ef4444]">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="font-semibold leading-relaxed">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono"
              >
                Email Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="block w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-white text-xs font-mono placeholder:text-zinc-400 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:shadow-[2px_2px_0px_0px_#6366f1] transition-all min-h-[44px]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-mono"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-11 py-2.5 rounded-xl border-2 border-zinc-950 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-white text-xs font-mono placeholder:text-zinc-400 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:shadow-[2px_2px_0px_0px_#6366f1] transition-all min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer min-h-[44px]"
                  aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="comic-btn w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 min-h-[44px] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Akun...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 stroke-[2.5]" />
                    <span>Masuk ke Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Card Footer: Security Note */}
          <div className="mt-6 pt-4 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Supabase Authenticated & Encrypted</span>
          </div>
        </div>

        {/* Helpful Tip Sub-Card */}
        <div className="mt-4 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm text-center">
          <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            Akun admin dikelola melalui tab{" "}
            <span className="text-zinc-800 dark:text-zinc-200 font-bold">Authentication &gt; Users</span>{" "}
            pada dashboard Supabase Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
