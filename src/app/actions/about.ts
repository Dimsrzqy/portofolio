"use server";

import { revalidatePath } from "next/cache";
import { saveAboutData } from "@/lib/supabase/about";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AboutData } from "@/types";

export async function uploadProfilePhotoAction(formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    const oldPhotoUrl = (formData.get("oldPhotoUrl") as string) || "";

    if (!file) {
      return { success: false, message: "File gambar tidak ditemukan." };
    }

    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return { success: false, message: "Supabase belum terkonfigurasi." };
    }

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 7);
    const filePath = `profile/about-photo-${timestamp}-${randomStr}.webp`;

    const BUCKETS = ["files", "project-images", "portfolio-assets"];
    let uploadedBucket = "";
    let lastErrorMsg = "";

    const buffer = Buffer.from(await file.arrayBuffer());

    for (const bucket of BUCKETS) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, buffer, {
          contentType: "image/webp",
          upsert: true,
        });

      if (!error && data) {
        uploadedBucket = bucket;
        break;
      } else if (error) {
        lastErrorMsg = error.message;
      }
    }

    if (!uploadedBucket) {
      return {
        success: false,
        message: lastErrorMsg || "Gagal mengunggah foto ke storage Supabase.",
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(uploadedBucket).getPublicUrl(filePath);

    if (oldPhotoUrl && oldPhotoUrl !== publicUrl && oldPhotoUrl.includes("/storage/v1/object/public/")) {
      await deleteSupabasePhotoAction(oldPhotoUrl);
    }
    await cleanupOrphanProfilePhotosAction(publicUrl);

    return {
      success: true,
      publicUrl,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat mengunggah foto.";
    return { success: false, message: msg };
  }
}

export async function deleteSupabasePhotoAction(photoUrl: string) {
  if (!photoUrl || !photoUrl.includes("/storage/v1/object/public/")) {
    return { success: false, message: "Bukan URL Supabase Storage" };
  }

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return { success: false, message: "Supabase client tidak tersedia" };

    const parts = photoUrl.split("/storage/v1/object/public/")[1];
    if (!parts) return { success: false };

    const slashIdx = parts.indexOf("/");
    const bucket = parts.substring(0, slashIdx);
    const filePath = parts.substring(slashIdx + 1).split("?")[0];

    if (bucket && filePath) {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) {
        console.warn("Gagal menghapus file foto dari storage:", error.message);
      }
      return { success: true };
    }
  } catch (err) {
    console.warn("Error saat menghapus foto dari storage:", err);
  }

  return { success: false };
}

export async function cleanupOrphanProfilePhotosAction(keepPhotoUrl?: string) {
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return;

    let keepFilename = "";
    if (keepPhotoUrl && keepPhotoUrl.includes("/storage/v1/object/public/")) {
      const parts = keepPhotoUrl.split("/storage/v1/object/public/")[1];
      if (parts) {
        const slashIdx = parts.indexOf("/");
        const filePath = parts.substring(slashIdx + 1).split("?")[0];
        keepFilename = filePath.replace("profile/", "");
      }
    }

    const BUCKETS = ["portfolio-assets", "project-images", "files"];
    for (const bucket of BUCKETS) {
      try {
        const { data: files, error } = await supabase.storage.from(bucket).list("profile");
        if (!error && files && files.length > 0) {
          const filesToDelete = files
            .filter((f) => f.name.startsWith("about-photo-") && f.name !== keepFilename)
            .map((f) => `profile/${f.name}`);

          if (filesToDelete.length > 0) {
            await supabase.storage.from(bucket).remove(filesToDelete);
          }
        }
      } catch {
        // Lanjutkan ke bucket berikutnya jika bucket tidak ada
      }
    }
  } catch (err) {
    console.warn("Cleanup orphan profile photos error:", err);
  }
}

export async function updateAboutAction(data: AboutData, previousPhotoUrl?: string) {
  // Jika URL foto berubah dari foto lama di Supabase, hapus foto lama untuk menghemat storage
  if (previousPhotoUrl && previousPhotoUrl !== data.photoUrl) {
    await deleteSupabasePhotoAction(previousPhotoUrl);
  }
  await cleanupOrphanProfilePhotosAction(data.photoUrl);

  const result = await saveAboutData(data);
  if (result.success) {
    revalidatePath("/");
    revalidatePath("/admin/about");
    revalidatePath("/admin");
  }
  return result;
}
