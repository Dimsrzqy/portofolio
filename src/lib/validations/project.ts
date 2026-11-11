import { z } from "zod";

export const projectFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Judul project minimal 3 karakter" })
    .max(120, { message: "Judul project maksimal 120 karakter" }),
  slug: z
    .string()
    .min(3, { message: "Slug minimal 3 karakter" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)",
    }),
  description: z
    .string()
    .min(10, { message: "Deskripsi singkat minimal 10 karakter" })
    .max(300, { message: "Deskripsi singkat maksimal 300 karakter" }),
  content: z.string().optional(),
  tech_stack: z.array(z.string()).min(1, { message: "Minimal 1 teknologi harus dipilih" }),
  image_url: z.string().url({ message: "URL gambar tidak valid" }),
  demo_url: z.string().url({ message: "URL demo harus valid" }).or(z.literal("")).optional(),
  github_url: z.string().url({ message: "URL GitHub harus valid" }).or(z.literal("")).optional(),
  featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
