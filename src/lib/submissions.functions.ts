import { createServerFn } from "@tanstack/react-start";
import { ZodError } from "zod";
import {
  contactSubmissionSchema,
  quoteSubmissionSchema,
  uploadRequestSchema,
} from "@/lib/submission-schemas";

function normalizeInput<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof ZodError) throw new Error(error.issues[0]?.message ?? "Vérifiez les champs saisis.");
    throw error;
  }
}

function quoteNumber() {
  const value = crypto.getRandomValues(new Uint32Array(1))[0] ?? 0;
  return `DV-${new Date().getFullYear()}-${String(value % 10000).padStart(4, "0")}`;
}

export const submitContactRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => normalizeInput(contactSubmissionSchema, input))
  .handler(async ({ data }) => {
    if (data.website) return { success: true };
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("prospects").insert({
        company_name: data.companyName,
        ice: data.ice,
        contact_name: data.contactName,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      });
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error("MERPORT contact submission failed", error instanceof Error ? error.message : error);
      throw new Error("Votre message n’a pas pu être envoyé. Réessayez ou contactez-nous par téléphone.");
    }
    return { success: true };
  });

export const createQuoteAttachmentUpload = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => normalizeInput(uploadRequestSchema, input))
  .handler(async ({ data }) => {
    const extensionByMime: Record<typeof data.contentType, string> = {
      "application/pdf": "pdf",
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };
    const path = `quote-requests/${crypto.randomUUID()}.${extensionByMime[data.contentType]}`;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: upload, error } = await supabaseAdmin.storage.from("quote-attachments").createSignedUploadUrl(path);
      if (error || !upload) throw new Error(error?.message ?? "No upload link returned");
      return { path: upload.path, token: upload.token };
    } catch (error) {
      console.error("MERPORT attachment upload link failed", error instanceof Error ? error.message : error);
      throw new Error("Le fichier n’a pas pu être préparé. Réessayez ou envoyez-le par e-mail.");
    }
  });

class PublicError extends Error {}

const QUOTE_FAILED = "Votre demande n’a pas pu être envoyée. Réessayez ou contactez-nous par téléphone.";

export const submitQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => normalizeInput(quoteSubmissionSchema, input))
  .handler(async ({ data }) => {
    if (data.website) return { success: true, quoteNumber: quoteNumber() };
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      if (data.attachmentPath) {
        const folder = data.attachmentPath.split("/")[0] ?? "";
        const fileName = data.attachmentPath.slice(folder.length + 1);
        const { data: files, error } = await supabaseAdmin.storage.from("quote-attachments").list(folder, { search: fileName, limit: 1 });
        if (error || !files?.some((file) => file.name === fileName)) {
          throw new PublicError("Le fichier joint n’est pas disponible. Veuillez le joindre à nouveau.");
        }
      }
      for (let attempt = 0; attempt < 5; attempt++) {
        const number = quoteNumber();
        const { error } = await supabaseAdmin.from("quote_requests").insert({
          quote_number: number,
          company_name: data.companyName,
          ice: data.ice,
          contact_name: data.contactName,
          email: data.email,
          phone: data.phone,
          city: data.city,
          delivery_address: data.deliveryAddress,
          items: data.items,
          reference_notes: data.referenceNotes,
          attachment_path: data.attachmentPath ?? null,
        });
        if (!error) return { success: true, quoteNumber: number };
        // 23505 = numéro déjà attribué : on retente avec un autre numéro.
        if (error.code !== "23505") throw new Error(error.message);
      }
      throw new Error("Could not allocate a unique quote number");
    } catch (error) {
      if (error instanceof PublicError) throw new Error(error.message);
      console.error("MERPORT quote request failed", error instanceof Error ? error.message : error);
      throw new Error(QUOTE_FAILED);
    }
  });
