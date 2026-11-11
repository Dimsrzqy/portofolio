import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { EducationExperience } from "@/components/sections/education-experience";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { getPublishedProjects } from "@/lib/supabase/projects";

export default async function HomePage() {
  const projects = await getPublishedProjects();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Skills />
        <Projects projects={projects} />
        <EducationExperience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
