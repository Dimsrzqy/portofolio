import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProjectBySlug, getPublishedProjects } from "@/lib/supabase/projects";
import { ArrowLeft, ExternalLink, Calendar, Layers, ShieldCheck, FileText } from "lucide-react";
import { GithubIcon } from "@/components/ui/icons";
import type { Metadata } from "next";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Projects Dossier`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.image_url }],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col comic-halftone">
      {/* Top Bar Navigation */}
      <header className="border-b-2 border-zinc-950 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/#projects"
            className="comic-panel-sm px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 inline-flex items-center gap-2 text-xs font-mono font-bold uppercase text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors min-h-[44px] flex items-center"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Missions</span>
          </Link>

          <div className="flex items-center gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="comic-panel-sm inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 text-xs font-mono font-bold uppercase text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors min-h-[44px] sm:min-h-auto flex items-center"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Repo</span>
              </a>
            )}
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noreferrer"
                className="comic-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-colors min-h-[44px] sm:min-h-auto flex items-center"
              >
                <span>Live Intel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
        {/* Title & Metadata */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="comic-panel-sm px-3 py-0.5 rounded-md bg-indigo-600 text-white text-xs font-mono font-bold uppercase tracking-wider">
              MISSION DOSSIER // {project.slug}
            </span>
            {project.featured && (
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-zinc-950 text-xs font-black uppercase border-2 border-zinc-950 shadow-[1.5px_1.5px_0px_0px_#09090b] rotate-1">
                FEATURED
              </span>
            )}
            {project.created_at && (
              <span className="text-xs text-zinc-500 font-mono font-bold flex items-center gap-1 ml-auto">
                <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                {new Date(project.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 dark:text-white mb-4">
            {project.title}
          </h1>

          <p className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 max-w-3xl leading-relaxed font-medium">
            {project.description}
          </p>
        </div>

        {/* Hero Image in Comic Frame */}
        <div className="comic-panel relative aspect-16/9 w-full rounded-2xl overflow-hidden mb-12 bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 1000px"
          />
        </div>

        {/* Two Column Layout: Tech Specs and Detailed Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Case Study Content in Comic Panel */}
          <div className="comic-panel lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 space-y-6 text-zinc-800 dark:text-zinc-200 leading-relaxed text-base">
            <div className="flex items-center gap-2 pb-3 border-b-2 border-zinc-950/10 dark:border-zinc-800 font-mono text-xs font-black uppercase text-indigo-600 dark:text-indigo-400">
              <FileText className="w-4 h-4" />
              <span>Full Technical Debrief</span>
            </div>

            {project.content ? (
              <div className="space-y-4">
                {project.content.split("\n\n").map((paragraph, index) => {
                  if (paragraph.startsWith("### ")) {
                    return (
                      <h3
                        key={index}
                        className="text-xl font-black text-zinc-950 dark:text-white pt-4 tracking-tight uppercase font-mono"
                      >
                        {paragraph.replace("### ", "")}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith("- ")) {
                    const items = paragraph.split("\n");
                    return (
                      <ul key={index} className="space-y-2 list-disc pl-5">
                        {items.map((it, idx) => (
                          <li key={idx} className="text-sm font-medium">
                            {it.replace("- ", "")}
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={index} className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            ) : (
              <p className="text-zinc-500 italic">No detailed case study write-up provided yet.</p>
            )}
          </div>

          {/* Sidebar Specs in Comic Panel */}
          <aside className="comic-panel lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-zinc-900 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-zinc-950 dark:text-white mb-3 pb-2 border-b-2 border-zinc-950/10 dark:border-zinc-800">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Weaponry / Stack</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.tech_stack.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 border-2 border-zinc-950/20 dark:border-zinc-700 shadow-[1px_1px_0px_0px_#09090b]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-zinc-950/10 dark:border-zinc-800 pt-4">
              <div className="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-zinc-950 dark:text-white mb-3">
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Architecture Guarantee</span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                Production-grade implementation with zero layout shift, automated accessibility validation, and high performance Next.js optimization.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-zinc-950 dark:border-zinc-800 py-8 text-center text-xs font-mono font-bold uppercase text-zinc-600 dark:text-zinc-400">
        <Link href="/#projects" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline">
          ← Return to portfolio home
        </Link>
      </footer>
    </div>
  );
}
