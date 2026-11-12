"use server";

import { revalidatePath } from "next/cache";
import { saveChronicleData, type ChronicleData } from "@/lib/supabase/chronicle";

export async function updateChronicleAction(data: ChronicleData) {
  const result = await saveChronicleData(data);
  if (result.success) {
    revalidatePath("/");
    revalidatePath("/admin/chronicle");
  }
  return result;
}
