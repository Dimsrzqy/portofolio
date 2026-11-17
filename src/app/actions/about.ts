"use server";

import { revalidatePath } from "next/cache";
import { saveAboutData } from "@/lib/supabase/about";
import { AboutData } from "@/types";

export async function updateAboutAction(data: AboutData) {
  const result = await saveAboutData(data);
  if (result.success) {
    revalidatePath("/");
    revalidatePath("/admin/about");
    revalidatePath("/admin");
  }
  return result;
}
