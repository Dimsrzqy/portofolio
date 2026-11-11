export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string | null;
  tech_stack: string[];
  image_url: string;
  demo_url?: string | null;
  github_url?: string | null;
  featured: boolean;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location: string;
  description: string;
  highlights?: string[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  location: string;
  description: string;
  skills: string[];
}

export interface SkillCategory {
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools';
  skills: {
    name: string;
    level?: string;
    icon?: string;
  }[];
}

export interface StatItem {
  label: string;
  value: string;
  description: string;
}
