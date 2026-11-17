import { z } from "zod";

const textField = (label: string, max: number) =>
  z.string().trim().min(1, `${label} est obligatoire.`).max(max, `${label} est trop long.`);

export const contactSubmissionSchema = z.object({
  companyName: textField("La société", 160),
  ice: z.string().trim().max(32).default(""),
  contactName: textField("Le nom", 120),
  email: z.string().trim().email("Adresse e-mail invalide.").max(254),
  phone: textField("Le téléphone", 40),
  subject: textField("L’objet", 120),
  message: textField("Le message", 4000),
  website: z.string().max(0).default(""),
});

export const quoteSubmissionSchema = z.object({
  companyName: textField("La société", 160),
  ice: textField("L’ICE", 32),
  contactName: textField("Le nom", 120),
  email: z.string().trim().email("Adresse e-mail invalide.").max(254),
  phone: textField("Le téléphone", 40),
  city: textField("La ville", 120),
  deliveryAddress: textField("L’adresse de livraison", 400),
  referenceNotes: z.string().trim().max(3000).default(""),
  attachmentPath: z.string().regex(/^quote-requests\/[a-f0-9-]{36}\.[a-z0-9]{1,8}$/).optional(),
  items: z.array(z.object({
    slug: z.string().regex(/^[a-z0-9-]{1,100}$/),
    reference: z.string().regex(/^MP-\d{5}$/),
    name: textField("La désignation", 180),
    quantity: z.number().int().min(1).max(999),
  })).min(1, "Ajoutez au moins un produit au devis.").max(100),
});

export const uploadRequestSchema = z.object({
  fileName: z.string().trim().min(1).max(160),
  contentType: z.enum(["application/pdf", "image/jpeg", "image/png", "image/webp"]),
  size: z.number().int().positive().max(10 * 1024 * 1024),
});