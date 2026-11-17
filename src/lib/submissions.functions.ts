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
  const random = crypto.getRandomValues(new Uint16Array(1))[0];
  return `DV-2026-${(random ?? 0).toString(16).toUpperCase().padStart(4, "0")}`;
}

export const submitContactRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => normalizeInput(contactSubmissionSchema, input))
  .handler(async ({ data }) => {
    if (data.website) return { success: true };
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
    if (error) {
      console.error("MERPORT contact submission failed", error.message);
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
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: upload, error } = await supabaseAdmin.storage.from("quote-attachments").createSignedUploadUrl(path);
    if (error || !upload) {
      console.error("MERPORT attachment upload link failed", error?.message ?? "No upload link returned");
      throw new Error("Le fichier n’a pas pu être préparé. Réessayez.");
    }
    return { path: upload.path, token: upload.token };
  });

export const submitQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => normalizeInput(quoteSubmissionSchema, input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.attachmentPath) {
      const { error } = await supabaseAdmin.storage.from("quote-attachments").download(data.attachmentPath);
      if (error) throw new Error("Le fichier joint n’est pas disponible. Veuillez le joindre à nouveau.");
    }
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
    if (error) {
      console.error("MERPORT quote request failed", error.message);
      throw new Error("Votre demande n’a pas pu être envoyée. Réessayez ou contactez-nous par téléphone.");
    }
    return { success: true, quoteNumber: number };
  });