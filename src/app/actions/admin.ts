"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { projectFormSchema } from "@/lib/validations/project";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface AdminActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function createProjectAction(
  prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const techStackRaw = formData.get("tech_stack");
  const tech_stack = typeof techStackRaw === "string" 
    ? techStackRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    content: formData.get("content") || "",
    tech_stack,
    image_url: formData.get("image_url"),
    demo_url: formData.get("demo_url") || "",
    github_url: formData.get("github_url") || "",
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
    is_published: formData.get("is_published") === "on" || formData.get("is_published") === "true",
    sort_order: parseInt((formData.get("sort_order") as string) || "0", 10),
  };

  const validation = projectFormSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Validasi gagal. Silakan periksa kembali kolom yang diisi.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase belum terkonfigurasi pada .env.local",
    };
  }

  const { error } = await supabase.from("projects").insert([validation.data]);

  if (error) {
    return {
      success: false,
      message: `Gagal menyimpan project: ${error.message}`,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProjectAction(
  id: string,
  prevState: AdminActionResult | null,
  formData: FormData
): Promise<AdminActionResult> {
  const techStackRaw = formData.get("tech_stack");
  const tech_stack = typeof techStackRaw === "string"
    ? techStackRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    content: formData.get("content") || "",
    tech_stack,
    image_url: formData.get("image_url"),
    demo_url: formData.get("demo_url") || "",
    github_url: formData.get("github_url") || "",
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
    is_published: formData.get("is_published") === "on" || formData.get("is_published") === "true",
    sort_order: parseInt((formData.get("sort_order") as string) || "0", 10),
  };

  const validation = projectFormSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Validasi gagal. Silakan periksa kembali kolom yang diisi.",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      message: "Supabase belum terkonfigurasi pada .env.local",
    };
  }

  const { error } = await supabase
    .from("projects")
    .update(validation.data)
    .eq("id", id);

  if (error) {
    return {
      success: false,
      message: `Gagal memperbarui project: ${error.message}`,
    };
  }

  revalidatePath("/");
  revalidatePath(`/projects/${validation.data.slug}`);
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProjectAction(id: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, message: "Supabase not connected" };

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function toggleProjectFieldAction(
  id: string,
  field: "is_published" | "featured",
  currentValue: boolean
) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, message: "Supabase not connected" };

  const { error } = await supabase
    .from("projects")
    .update({ [field]: !currentValue })
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteMessageAction(id: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: false, message: "Supabase not connected" };

  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/messages");
  return { success: true };
}
