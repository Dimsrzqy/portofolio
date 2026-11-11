import { Project, Message } from "@/types";
import { createServerSupabaseClient } from "./server";
import { initialProjects } from "./mock-data";

export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return initialProjects;
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return initialProjects;
    }

    return data as Project[];
  } catch {
    return initialProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    const found = initialProjects.find((p) => p.slug === slug);
    return found || null;
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      const found = initialProjects.find((p) => p.slug === slug);
      return found || null;
    }

    return data as Project;
  } catch {
    const found = initialProjects.find((p) => p.slug === slug);
    return found || null;
  }
}

export async function getAllProjectsForAdmin(): Promise<Project[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return initialProjects;
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) {
      return initialProjects;
    }

    return data as Project[];
  } catch {
    return initialProjects;
  }
}

export async function getAllMessagesForAdmin(): Promise<Message[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as Message[];
  } catch {
    return [];
  }
}
