import React from "react";
import { getSkillsData } from "@/lib/supabase/skills";
import { SkillsClient } from "./skills-client";

export const metadata = {
  title: "Manage Skills & Arsenal | Admin Portal",
};

export default async function AdminSkillsPage() {
  const skillsData = await getSkillsData();
  return <SkillsClient initialData={skillsData} />;
}
