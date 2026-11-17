"use server";

import { revalidatePath } from "next/cache";
import { saveSkillsData } from "@/lib/supabase/skills";
import { SkillsData } from "@/types";

export async function updateSkillsAction(data: SkillsData) {
  const result = await saveSkillsData(data);
  if (result.success) {
    revalidatePath("/");
    revalidatePath("/admin/skills");
    revalidatePath("/admin");
  }
  return result;
}
