"use server";

import { contactFormSchema } from "@/lib/validations/contact";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { profileData } from "@/data/profile";
import { headers } from "next/headers";

export interface ContactActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

const RECIPIENT_EMAIL = process.env.ADMIN_EMAIL || profileData.email || "dimasrizqy021@gmail.com";

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

  // 1. Simpan pesan ke database Supabase agar tercatat di Admin Messages
  try {
    const supabase = await createServerSupabaseClient();
    if (supabase) {
      await supabase.from("messages").insert([{ name, email, message }]);
    }
  } catch (dbErr) {
    console.error("Database save error:", dbErr);
  }

  // 2. Kirim notifikasi otomatis ke Email (dimasrizqy021@gmail.com) secara diam-diam di Server
  try {
    const headerList = await headers();
    const host = headerList.get("host") || "localhost:3000";
    const proto = headerList.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const siteUrl = `${proto}://${host}`;

    // Jika ada RESEND_API_KEY di .env.local, kirim via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Dispatch <onboarding@resend.dev>",
          to: [RECIPIENT_EMAIL],
          reply_to: email,
          subject: `[Portfolio Signal] Pesan Baru dari ${name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #09090b; border-radius: 12px;">
              <h2 style="color: #4f46e5; margin-top: 0;">Pesan Baru dari Portofolio</h2>
              <p>Ada pengunjung baru yang mengirimkan pesan melalui form kontak website Anda:</p>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <tr>
                  <td style="padding: 8px; font-weight: bold; width: 100px;">Nama:</td>
                  <td style="padding: 8px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Email:</td>
                  <td style="padding: 8px;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; vertical-align: top;">Pesan:</td>
                  <td style="padding: 8px; white-space: pre-wrap; background: #f4f4f5; border-radius: 8px;">${message}</td>
                </tr>
              </table>
              <p style="font-size: 12px; color: #71717a; margin-top: 24px;">Anda dapat langsung menekan tombol Reply/Balas pada email ini untuk membalas ke ${email}.</p>
            </div>
          `,
        }),
      }).catch((err) => console.error("Resend error:", err));
    }

    // Forwarder otomatis FormSubmit (langsung terkirim ke dimasrizqy021@gmail.com)
    await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: siteUrl,
        Referer: `${siteUrl}/`,
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `[Portfolio Signal] Pesan Baru dari ${name}`,
        _replyto: email,
        _template: "table",
      }),
    }).catch((err) => console.error("FormSubmit forwarder error:", err));
  } catch (emailErr) {
    console.error("Email notification error:", emailErr);
  }

  return {
    success: true,
    message: "Pesan Anda berhasil dikirim! Saya akan segera merespons melalui email Anda.",
  };
}
