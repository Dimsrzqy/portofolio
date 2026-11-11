import React from "react";
import { getAllProjectsForAdmin } from "@/lib/supabase/projects";
import { ProjectListClient } from "./project-list-client";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsForAdmin();

  return <ProjectListClient initialProjects={projects} />;
}
