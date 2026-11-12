import React from "react";
import { getChronicleData } from "@/lib/supabase/chronicle";
import { ChronicleClient } from "./chronicle-client";

export const dynamic = "force-dynamic";

export default async function AdminChroniclePage() {
  const chronicle = await getChronicleData();

  return <ChronicleClient initialData={chronicle} />;
}
