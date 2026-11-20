import { z } from "zod";

const textField = (label: string, max: number) =>
  z.string().trim().min(1, `${label} est obligatoire.`).max(max, `${label} est trop long.`);

const emailField = z.string().trim().min(1, "L’adresse e-mail est obligatoire.").email("Adresse e-mail invalide.").max(254);
const phoneField = z
  .string()
  .trim()
  .min(1, "Le téléphone est obligatoire.")
  .max(40, "Le téléphone est trop long.")
  .regex(/^\+?[\d\s().-]{8,}$/, "Numéro de téléphone invalide.");

export const contactSubmissionSchema = z.object({
  companyName: textField("La société", 160),
  ice: z.string().trim().max(32, "L’ICE est trop long.").default(""),
  contactName: textField("Le nom", 120),
  email: emailField,
  phone: phoneField,
  subject: textField("L’objet", 120),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères.").max(4000, "Le message est trop long."),
  website: z.string().max(0).default(""),
});

export const quoteItemSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]{1,100}$/),
  reference: z.string().regex(/^MP-\d{5}$/),
  name: textField("La désignation", 180),
  quantity: z.number().int().min(1).max(999),
});

export const quoteCompanySchema = z.object({
  companyName: textField("La société", 160),
  ice: z
    .string()
    .transform((value) => value.replace(/\s+/g, ""))
    .pipe(z.string().regex(/^\d{15}$/, "L’ICE doit contenir 15 chiffres.")),
  contactName: textField("Le nom", 120),
  email: emailField,
  phone: phoneField,
});

export const quoteDeliverySchema = z.object({
  city: textField("La ville", 120),
  deliveryAddress: textField("L’adresse de livraison", 400),
});

export const quoteSubmissionSchema = quoteCompanySchema
  .merge(quoteDeliverySchema)
  .extend({
    referenceNotes: z.string().trim().max(3000, "La liste de références est trop longue.").default(""),
    attachmentPath: z.string().regex(/^quote-requests\/[a-f0-9-]{36}\.[a-z0-9]{1,8}$/).optional(),
    items: z.array(quoteItemSchema).max(100, "100 lignes maximum par demande."),
    website: z.string().max(0).default(""),
  })
  .refine((data) => data.items.length > 0 || data.referenceNotes.length > 0 || Boolean(data.attachmentPath), {
    message: "Ajoutez au moins un produit, une référence ou un fichier à votre demande.",
    path: ["items"],
  });

export const ALLOWED_ATTACHMENT_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"] as const;
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

export const uploadRequestSchema = z.object({
  fileName: z.string().trim().min(1).max(160),
  contentType: z.enum(ALLOWED_ATTACHMENT_TYPES, { errorMap: () => ({ message: "Format accepté : PDF, JPG, PNG ou WEBP." }) }),
  size: z.number().int().positive().max(MAX_ATTACHMENT_BYTES, "Le fichier dépasse 10 Mo."),
});

/** Convertit les erreurs Zod en dictionnaire champ → message (premier message par champ). */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}
