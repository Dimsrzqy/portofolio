import React from "react";
import { notFound } from "next/navigation";
import { getAllProjectsForAdmin } from "@/lib/supabase/projects";
import { ProjectEditClient } from "./project-edit-client";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const projects = await getAllProjectsForAdmin();
  return projects.map((p) => ({ id: p.id }));
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
