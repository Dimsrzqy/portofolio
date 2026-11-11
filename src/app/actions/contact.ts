"use server";

import { contactFormSchema } from "@/lib/validations/contact";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface ContactActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function submitContactMessage(
  prevState: ContactActionResult | null,
  formData: FormData
): Promise<ContactActionResult> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  const validation = contactFormSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Mohon periksa kembali input Anda.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { name, email, message } = validation.data;

  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      // In demo/offline mode where Supabase is not configured yet
      console.log("[Demo Mode] Message received:", { name, email, message });
      return {
        success: true,
        message: "Terima kasih! Pesan Anda telah diterima (Mode Demo / Supabase belum dihubungkan).",
      };
    }

    const { error } = await supabase.from("messages").insert([
      {
        name,
        email,
        message,
      },
    ]);

    if (error) {
      console.error("Supabase insert message error:", error);
      return {
        success: false,
        message: `Gagal mengirim pesan: ${error.message}`,
      };
    }

    return {
      success: true,
      message: "Pesan Anda berhasil dikirim! Saya akan segera merespons.",
    };
  } catch (err) {
    console.error("Contact action exception:", err);
    return {
      success: false,
      message: "Terjadi kesalahan pada server saat mengirim pesan.",
    };
  }
}
