import { NextResponse } from "next/server";
import { profileData } from "@/data/profile";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl) {
    try {
      const supabase = await createServerSupabaseClient();
      if (supabase) {
        // Check if cv.pdf exists in 'files' bucket
        const { data: files } = await supabase.storage.from("files").list("", {
          search: "cv.pdf",
        });

        const found = files && files.some((f) => f.name === "cv.pdf");

        if (found) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("files").getPublicUrl("cv.pdf");

          // Redirect to the live Supabase storage URL
          return NextResponse.redirect(publicUrl);
        }
      }
    } catch {
      // Fallback below
    }
  }

  // Fallback to local default CV file
  const fallbackUrl = profileData.resumeUrl || "/files/cv.pdf";
  return NextResponse.redirect(
    new URL(fallbackUrl, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
  );
}
