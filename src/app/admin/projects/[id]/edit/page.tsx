import React from "react";
import { notFound } from "next/navigation";
import { getAllProjectsForAdmin } from "@/lib/supabase/projects";
import { ProjectEditClient } from "./project-edit-client";

export const dynamic = "force-dynamic";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProjectEditPage({ params }: EditPageProps) {
  const { id } = await params;
  const projects = await getAllProjectsForAdmin();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return <ProjectEditClient project={project} />;
}
