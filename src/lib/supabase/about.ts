import { createServerSupabaseClient } from "./server";
import { profileData } from "@/data/profile";
import { AboutData } from "@/types";

export const defaultAboutData: AboutData = {
  chapterLabel: "CHAPTER 01 // ORIGIN & PHILOSOPHY",
  title: "Engineering with purpose, precision, and simplicity.",
  bioParagraph1:
    "Passionate Web Developer and Software Engineer currently studying Informatics Management at Politeknik Negeri Jember. Dedicated to crafting clean, accessible, and high-performance digital products with modern architectures.",
  bioParagraph2:
    "My approach combines solid software engineering fundamentals with keen attention to user ergonomics and clean code. Whether architecting database models or fine-tuning micro-interactions, I prioritize code readability, maintainability, and end-user performance.",
  academicRole: "Academic Affiliation",
  academicInstitution: "Informatics Management, Politeknik Negeri Jember",
  name: "Dimas Rizqy Ilhami",
  badge: "ENGINEER PROFILE",
  location: "Jember, Indonesia",
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  stickerText: "ORIGIN FILE",
  stats: profileData.stats,
};

const FILE_PATH = "about.json";
const BUCKET = "files";

export async function getAboutData(): Promise<AboutData> {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return defaultAboutData;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .download(FILE_PATH);

    if (error || !data) return defaultAboutData;

    const text = await data.text();
    const parsed = JSON.parse(text) as Partial<AboutData>;

    return {
      chapterLabel: parsed.chapterLabel || defaultAboutData.chapterLabel,
      title: parsed.title || defaultAboutData.title,
      bioParagraph1: parsed.bioParagraph1 || defaultAboutData.bioParagraph1,
      bioParagraph2: parsed.bioParagraph2 || defaultAboutData.bioParagraph2,
      academicRole: parsed.academicRole || defaultAboutData.academicRole,
      academicInstitution: parsed.academicInstitution || defaultAboutData.academicInstitution,
      name: parsed.name || defaultAboutData.name,
      badge: parsed.badge || defaultAboutData.badge,
      location: parsed.location || defaultAboutData.location,
      photoUrl: parsed.photoUrl || defaultAboutData.photoUrl,
      stickerText: parsed.stickerText || defaultAboutData.stickerText,
      stats:
        Array.isArray(parsed.stats) && parsed.stats.length > 0
          ? parsed.stats
          : defaultAboutData.stats,
    };
  } catch {
    return defaultAboutData;
  }
}

export async function saveAboutData(
  newData: AboutData
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
