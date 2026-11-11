import { Project } from "@/types";

export const initialProjects: Project[] = [
  {
    id: "mock-1",
    title: "Aetheria — Cloud Operations Platform",
    slug: "aetheria-cloud-platform",
    description:
      "A high-throughput dashboard designed for distributed infrastructure monitoring, real-time metrics streaming, and multi-tenant team management.",
    content: `
### Overview
Aetheria is an engineering-first dashboard engineered for software reliability teams. It delivers live cluster diagnostics, latency heatmaps, and customizable alerting policies with zero layout shifts.

### Key Highlights
- **Real-Time Telemetry:** Powered by Supabase Realtime subscriptions and lightweight WebSockets.
- **Micro-Interactions:** Custom subtle gestures and transitions built with Framer Motion.
- **Enterprise Access Control:** Granular Row Level Security (RLS) guaranteeing per-tenant data isolation.
- **Responsive Canvas:** Mobile-first layout designed to reflow comfortably from smartphones to 4K monitors.
    `.trim(),
    tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Framer Motion"],
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    demo_url: "https://demo.example.com/aetheria",
    github_url: "https://github.com/example/aetheria",
    featured: true,
    is_published: true,
    sort_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-2",
    title: "Polije Student Resource Hub",
    slug: "polije-student-resource-hub",
    description:
      "An integrated web portal for Informatics Management students featuring academic schedules, resource sharing, and lab reservation management.",
    content: `
### Overview
Built specifically to address the daily academic workflow at Politeknik Negeri Jember, this portal brings course syllabi, lab equipment schedules, and peer study groups into one cohesive interface.

### Key Highlights
- **Role-Based Workflows:** Distinct privileges for students, teaching assistants, and faculty members.
- **Automated Notifications:** Email triggers for timetable adjustments and lab slot bookings.
- **Accessible UI:** High-contrast theme compliance and keyboard-navigable dialogs.
    `.trim(),
    tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Supabase Auth"],
    image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    demo_url: "https://demo.example.com/polije-hub",
    github_url: "https://github.com/example/polije-hub",
    featured: true,
    is_published: true,
    sort_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-3",
    title: "Verve — Minimalist E-Commerce Studio",
    slug: "verve-minimalist-store",
    description:
      "A lightning-fast headless commerce storefront with instant filter search, dynamic cart state, and Stripe payment gateway integration.",
    content: `
### Overview
Verve strips away all typical e-commerce clutter to present an ultra-clean product catalog inspired by Dieter Rams and modern Scandinavian architecture.

### Key Highlights
- **Sub-100ms Page Loads:** Optimized image loading via Next.js Image with WebP/AVIF compression.
- **Optimistic UI:** Instant cart additions and badge updates without server roundtrips.
- **Server Actions:** Secure order checkout and inventory verification executed entirely server-side.
    `.trim(),
    tech_stack: ["Next.js", "React 19", "Tailwind CSS", "Stripe API", "Zod"],
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    demo_url: "https://demo.example.com/verve",
    github_url: "https://github.com/example/verve",
    featured: false,
    is_published: true,
    sort_order: 3,
    created_at: new Date().toISOString(),
  },
];
