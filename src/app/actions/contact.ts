"use server";

import { contactFormSchema } from "@/lib/validations/contact";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { profileData } from "@/data/profile";

export interface ContactActionResult {
  success: boolean;
  message: string;
  whatsappUrl?: string;
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

  // Siapkan format nomor WhatsApp dan teks pesan otomatis
  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || profileData.whatsapp || "";
  let cleanPhone = rawPhone.replace(/[^0-9]/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "62" + cleanPhone.slice(1);
  }

  const waText = `Halo Dimas! Saya *${name}* (${email}) dari portofolio Anda.\n\n*Pesan:*\n${message}`;
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`
    : undefined;

  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      console.log("[Demo Mode] Message received:", { name, email, message });
      return {
        success: true,
        message: "Pesan Anda berhasil diterima dan dialihkan ke WhatsApp!",
        whatsappUrl,
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
      // Tetap berikan whatsappUrl agar pengunjung tetap bisa kirim via WA walau db error
      return {
        success: true,
        message: "Pesan siap dikirimkan langsung ke WhatsApp Anda!",
        whatsappUrl,
      };
    }

    return {
      success: true,
      message: "Pesan Anda berhasil dicatat dan sedang dialihkan ke WhatsApp...",
      whatsappUrl,
    };
  } catch (err) {
    console.error("Contact action exception:", err);
    return {
      success: true,
      message: "Pesan siap diteruskan langsung ke WhatsApp Anda!",
      whatsappUrl,
    };
  }
}
