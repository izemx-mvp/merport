import type { Product } from "@/data/products";
import { QUOTE_BASKET_EVENT, QUOTE_BASKET_KEY, type QuoteItem } from "@/lib/quote-basket";

export function addToQuote(product: Product) {
  const saved: QuoteItem[] = JSON.parse(localStorage.getItem(QUOTE_BASKET_KEY) ?? "[]");
  const existing = saved.find((item) => item.slug === product.slug);
  if (existing) existing.quantity = Math.min(existing.quantity + 1, 999);
  else saved.push({ slug: product.slug, reference: product.reference, name: product.name, quantity: 1 });
  localStorage.setItem(QUOTE_BASKET_KEY, JSON.stringify(saved));
  window.dispatchEvent(new Event(QUOTE_BASKET_EVENT));
}