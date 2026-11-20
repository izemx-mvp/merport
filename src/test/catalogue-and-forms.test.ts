import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";

import { categories } from "@/data/categories";
import { products, searchProducts } from "@/data/products";
import { sectors } from "@/data/sectors";
import { addItem, clearBasket, readBasket, removeItem, setQuantity, QUOTE_BASKET_KEY } from "@/lib/quote-basket";
import { contactSubmissionSchema, quoteSubmissionSchema } from "@/lib/submission-schemas";

const publicFile = (path: string) => existsSync(resolve(__dirname, "../../public", path.replace(/^\//, "")));

describe("catalogue data", () => {
  it("has a product image file for every product", () => {
    for (const product of products) expect(publicFile(product.image), product.image).toBe(true);
  });

  it("has an image file for every family and sector", () => {
    for (const item of [...categories, ...sectors]) expect(publicFile(item.image), item.image).toBe(true);
  });

  it("uses unique slugs and valid references", () => {
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
    for (const product of products) expect(product.reference).toMatch(/^MP-\d{5}$/);
  });

  it("searches without accents or case", () => {
    expect(searchProducts(products, "DIFFERENTIEL").map((p) => p.name)).toContain("Interrupteur différentiel 30 mA");
    expect(searchProducts(products, "MP-01001")).toHaveLength(1);
  });
});

describe("quote basket", () => {
  beforeEach(() => localStorage.removeItem(QUOTE_BASKET_KEY));

  it("adds, merges, updates and removes items in localStorage", () => {
    const item = { slug: "eclairage-1", reference: "MP-04001", name: "Luminaire LED high-bay" };
    addItem(item);
    addItem(item, 4);
    expect(readBasket()).toEqual([{ ...item, quantity: 5 }]);
    setQuantity("eclairage-1", 5000);
    expect(readBasket()[0]?.quantity).toBe(999);
    removeItem("eclairage-1");
    expect(readBasket()).toEqual([]);
    addItem(item);
    clearBasket();
    expect(JSON.parse(localStorage.getItem(QUOTE_BASKET_KEY) ?? "null")).toEqual([]);
  });

  it("ignores corrupted storage", () => {
    localStorage.setItem(QUOTE_BASKET_KEY, "{not json");
    expect(readBasket()).toEqual([]);
  });
});

describe("submission schemas", () => {
  const quote = {
    companyName: "Test SARL",
    ice: "001 234 567 000 089",
    contactName: "Test",
    email: "test@example.com",
    phone: "06 00 00 00 00",
    city: "Casablanca",
    deliveryAddress: "Adresse",
    referenceNotes: "",
    items: [{ slug: "eclairage-1", reference: "MP-04001", name: "Luminaire", quantity: 2 }],
  };

  it("accepts a valid quote and normalises the ICE", () => {
    const result = quoteSubmissionSchema.parse(quote);
    expect(result.ice).toBe("001234567000089");
  });

  it("accepts free references without basket items", () => {
    expect(quoteSubmissionSchema.safeParse({ ...quote, items: [], referenceNotes: "Câble 3G2,5 — 100 m" }).success).toBe(true);
  });

  it("rejects an empty request, a bad ICE and a bad email", () => {
    expect(quoteSubmissionSchema.safeParse({ ...quote, items: [] }).success).toBe(false);
    expect(quoteSubmissionSchema.safeParse({ ...quote, ice: "1234" }).success).toBe(false);
    expect(quoteSubmissionSchema.safeParse({ ...quote, email: "nope" }).success).toBe(false);
  });

  it("validates the contact form", () => {
    const contact = { companyName: "Test", contactName: "Test", email: "test@example.com", phone: "0600000000", subject: "Autre", message: "Bonjour, une question." };
    expect(contactSubmissionSchema.safeParse(contact).success).toBe(true);
    expect(contactSubmissionSchema.safeParse({ ...contact, message: "court" }).success).toBe(false);
  });
});
