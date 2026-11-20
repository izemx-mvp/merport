import type { Product } from "@/data/products";
import { addItem, setBasketDrawerOpen } from "@/lib/quote-basket";

export function addToQuote(product: Product, quantity = 1) {
  addItem({ slug: product.slug, reference: product.reference, name: product.name, image: product.image, category: product.category }, quantity);
  setBasketDrawerOpen(true);
}
