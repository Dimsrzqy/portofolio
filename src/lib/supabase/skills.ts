import { createServerSupabaseClient } from "./server";
import { defaultSkillsData } from "@/data/profile";
import { SkillsData, SkillCategory } from "@/types";

export { defaultSkillsData };

const FILE_PATH = "skills.json";
const BUCKET = "files";

export async function getSkillsData(): Promise<SkillsData> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return defaultSkillsData;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .download(FILE_PATH);

    if (error || !data) return defaultSkillsData;

    const text = await data.text();
    const parsed = JSON.parse(text) as Partial<SkillsData>;

    const categories: SkillCategory[] =
      Array.isArray(parsed.categories) && parsed.categories.length > 0
        ? parsed.categories.map((c) => ({
            category: c.category || "General",
            skills: Array.isArray(c.skills) ? c.skills : [],
          }))
        : defaultSkillsData.categories;

    return {
      chapterLabel: parsed.chapterLabel || defaultSkillsData.chapterLabel,
      title: parsed.title || defaultSkillsData.title,
      description: parsed.description || defaultSkillsData.description,
      categories,
    };
  } catch {
    return defaultSkillsData;
  }
}

export async function saveSkillsData(
  newData: SkillsData
): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return { success: false, message: "Supabase client belum terkonfigurasi." };
    }

    const jsonString = JSON.stringify(newData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(FILE_PATH, blob, {
        upsert: true,
        contentType: "application/json",
      });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal menyimpan data ke Supabase";
    return { success: false, message: msg };
  }
}
