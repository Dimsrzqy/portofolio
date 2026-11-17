import React from "react";
import { getAboutData } from "@/lib/supabase/about";
import { AboutClient } from "./about-client";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const about = await getAboutData();

  return <AboutClient initialData={about} />;
}
