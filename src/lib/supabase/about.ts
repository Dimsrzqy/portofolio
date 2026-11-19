import fs from "fs/promises";
import path from "path";
import { createServerSupabaseClient } from "./server";
import { AboutData } from "@/types";

export const defaultAboutData: AboutData = {
  chapterLabel: "CHAPTER 01 // ORIGIN & PHILOSOPHY",
  title: "Engineering with purpose, precision, and simplicity.",
  bioParagraph1:
    "Passionate Web Developer and Software Engineer currently studying Informatics Management at Politeknik Negeri Jember. Dedicated to crafting clean, accessible, and high-performance digital products with modern architectures and user ergonomics.",
  bioParagraph2: "",
  name: "Dimas Rizqy Ilhami",
  badge: "ENGINEER PROFILE",
  location: "Jember, Indonesia",
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  stickerText: "ORIGIN FILE",
};

const FILE_PATH = "about.json";
const BUCKET = "files";
const LOCAL_DATA_PATH = path.join(process.cwd(), "src", "data", "about-data.json");

// Helper to read local JSON file
async function getLocalAboutData(): Promise<AboutData | null> {
  try {
    const raw = await fs.readFile(LOCAL_DATA_PATH, "utf-8");
    return JSON.parse(raw) as AboutData;
  } catch {
    return null;
  }
}

// Helper to save local JSON file
async function saveLocalAboutData(data: AboutData): Promise<void> {
  try {
    await fs.writeFile(LOCAL_DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write local about backup:", err);
  }
}

export async function getAboutData(): Promise<AboutData> {
  // 1. Coba ambil dari Supabase Storage
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .download(FILE_PATH);

      if (!error && data) {
        const text = await data.text();
        const parsed = JSON.parse(text) as Partial<AboutData>;

        const resolved: AboutData = {
          chapterLabel: parsed.chapterLabel || defaultAboutData.chapterLabel,
          title: parsed.title || defaultAboutData.title,
          bioParagraph1: parsed.bioParagraph1 !== undefined ? parsed.bioParagraph1 : defaultAboutData.bioParagraph1,
          bioParagraph2: parsed.bioParagraph2 || "",
          name: parsed.name || defaultAboutData.name,
          badge: parsed.badge || defaultAboutData.badge,
          location: parsed.location || defaultAboutData.location,
          photoUrl: parsed.photoUrl || defaultAboutData.photoUrl,
          stickerText: parsed.stickerText || defaultAboutData.stickerText,
        };

        // Sinkronkan ke lokal agar selalu up to date
        saveLocalAboutData(resolved).catch(() => {});
        return resolved;
      }
    }
  } catch {
    // Lanjut ke fallback lokal
  }

  // 2. Fallback: Ambil dari file lokal
  const local = await getLocalAboutData();
  if (local) {
    return {
      chapterLabel: local.chapterLabel ?? defaultAboutData.chapterLabel,
      title: local.title ?? defaultAboutData.title,
      bioParagraph1: local.bioParagraph1 ?? defaultAboutData.bioParagraph1,
      bioParagraph2: local.bioParagraph2 || "",
      name: local.name ?? defaultAboutData.name,
      badge: local.badge ?? defaultAboutData.badge,
      location: local.location ?? defaultAboutData.location,
      photoUrl: local.photoUrl ?? defaultAboutData.photoUrl,
      stickerText: local.stickerText ?? defaultAboutData.stickerText,
    };
  }

  // 3. Fallback default
  return defaultAboutData;
}

export async function saveAboutData(
  newData: AboutData
): Promise<{ success: boolean; message?: string }> {
  // 1. Simpan selalu ke file lokal terlebih dahulu agar data tidak pernah hilang
  await saveLocalAboutData(newData);

  // 2. Simpan ke Supabase Storage jika terhubung
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return { success: true };
    }

    const jsonString = JSON.stringify(newData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    // Coba upload ke bucket 'files' atau fallback ke 'portfolio-assets'
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(FILE_PATH, blob, {
        upsert: true,
        contentType: "application/json",
      });

    if (error) {
      console.warn("Supabase storage upload warning (saved locally):", error.message);
    }

    return { success: true };
  } catch (err: unknown) {
    console.warn("Supabase save error (saved locally):", err);
    return { success: true };
  }
}
