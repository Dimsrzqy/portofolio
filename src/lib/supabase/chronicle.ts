import { createServerSupabaseClient } from "./server";
import { profileData } from "@/data/profile";
import { EducationItem, ExperienceItem } from "@/types";

export interface ChronicleData {
  education: EducationItem[];
  experience: ExperienceItem[];
}

const FILE_PATH = "chronicle.json";
const BUCKET = "files";

export async function getChronicleData(): Promise<ChronicleData> {
  const defaultData: ChronicleData = {
    education: profileData.education || [],
    experience: profileData.experience || [],
  };

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return defaultData;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .download(FILE_PATH);

    if (error || !data) return defaultData;

    const text = await data.text();
    const parsed = JSON.parse(text) as ChronicleData;

    return {
      education: Array.isArray(parsed.education) && parsed.education.length > 0
        ? parsed.education
        : defaultData.education,
      experience: Array.isArray(parsed.experience) && parsed.experience.length > 0
        ? parsed.experience
        : defaultData.experience,
    };
  } catch {
    return defaultData;
  }
}

export async function saveChronicleData(
  newData: ChronicleData
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
