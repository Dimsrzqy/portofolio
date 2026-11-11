import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nama minimal terdiri dari 2 karakter" })
    .max(100, { message: "Nama maksimal 100 karakter" }),
  email: z
    .string()
    .email({ message: "Format email tidak valid" })
    .max(150, { message: "Email terlalu panjang" }),
  message: z
    .string()
    .min(10, { message: "Pesan minimal terdiri dari 10 karakter" })
    .max(2000, { message: "Pesan maksimal 2000 karakter" }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
