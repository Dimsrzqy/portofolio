"use client";

import dynamic from "next/dynamic";
import React from "react";

const Lazy3DCanvas = dynamic(() => import("./hero-3d-canvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[260px] sm:min-h-[320px] lg:min-h-[380px] flex items-center justify-center">
      <div className="relative w-32 h-32 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 animate-pulse flex items-center justify-center">
        <div className="w-16 h-16 rounded-xl border border-indigo-500/40 rotate-45 animate-spin duration-1000" />
      </div>
    </div>
  ),
});

export function Hero3D() {
  return (
    <div className="relative w-full max-w-[420px] mx-auto aspect-square flex items-center justify-center">
      <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent rounded-full blur-2xl -z-10 pointer-events-none" />
      <Lazy3DCanvas />
    </div>
  );
}
