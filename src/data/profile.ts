import { EducationItem, ExperienceItem, SkillCategory, StatItem } from "@/types";

export const profileData = {
  name: "Dimas",
  initials: "D",
  badge: "Informatics Management Student at Politeknik Negeri Jember",
  headline: "Hi, I'm Dimas",
  subtitle: "Web Developer & Software Engineer",
  professionalTitle:
    "Web Developer & Software Engineer | Informatics Management Student at Politeknik Negeri Jember",
  bio: "Passionate developer focused on crafting clean, accessible, and high-performance digital products. Currently studying Informatics Management at Politeknik Negeri Jember while building scalable web applications with modern architectures.",
  avatarUrl: "/avatar.png",
  resumeUrl: "/files/cv.pdf",
  email: "dimas@example.com",
  location: "Jember, Indonesia",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
  },
  stats: [
    {
      value: "3+",
      label: "Years Coding",
      description: "Dedicated to modern software engineering",
    },
    {
      value: "15+",
      label: "Projects Completed",
      description: "Web apps, APIs, and client platforms",
    },
    {
      value: "100%",
      label: "Clean Code Focus",
      description: "Accessibility, performance, and best practices",
    },
  ] as StatItem[],
  education: [
    {
      institution: "Politeknik Negeri Jember",
      degree: "Informatics Management (Manajemen Informatika)",
      period: "2023 — Present",
      location: "Jember, Indonesia",
      description:
        "Focusing on software development methodologies, database systems, web engineering, computer networks, and enterprise application architecture.",
      highlights: [
        "Active member in student tech community and competitive programming",
        "Relevant coursework: Database Systems, Web Programming, Data Structures, Object-Oriented Analysis",
      ],
    },
  ] as EducationItem[],
  experience: [
    {
      role: "Full-Stack Web Developer (Freelance)",
      company: "Independent Projects",
      period: "2023 — Present",
      location: "Remote / Indonesia",
      description:
        "Architecting and shipping performant web applications using Next.js, TypeScript, Tailwind CSS, and cloud databases (PostgreSQL/Supabase). Implemented authenticated dashboards, responsive user interfaces, and automated workflows.",
      skills: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Supabase", "REST APIs"],
    },
    {
      role: "Software Engineering Intern",
      company: "Tech Solutions Lab",
      period: "2024",
      location: "Jember, Indonesia",
      description:
        "Contributed to internal portal development, optimized database queries, integrated third-party APIs, and helped establish modern frontend testing standards.",
      skills: ["React", "Node.js", "MySQL", "Git", "UI/UX Prototyping"],
    },
  ] as ExperienceItem[],
  skills: [
    {
      category: "Frontend",
      skills: [
        { name: "Next.js (App Router)" },
        { name: "React 19" },
        { name: "TypeScript" },
        { name: "Tailwind CSS" },
        { name: "Framer Motion" },
        { name: "HTML5 & Semantic SEO" },
      ],
    },
    {
      category: "Backend",
      skills: [
        { name: "Node.js" },
        { name: "Next.js Server Actions" },
        { name: "RESTful APIs" },
        { name: "Express.js" },
        { name: "Authentication (JWT & Supabase Auth)" },
      ],
    },
    {
      category: "Database",
      skills: [
        { name: "PostgreSQL" },
        { name: "Supabase" },
        { name: "Prisma ORM" },
        { name: "MySQL" },
        { name: "Row Level Security (RLS)" },
      ],
    },
    {
      category: "Tools",
      skills: [
        { name: "Git & GitHub" },
        { name: "Docker" },
        { name: "Postman" },
        { name: "VS Code / Antigravity" },
        { name: "Vercel Deployment" },
        { name: "Figma" },
      ],
    },
  ] as SkillCategory[],
};
