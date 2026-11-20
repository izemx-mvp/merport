import { useSyncExternalStore } from "react";

export type QuoteItem = { slug: string; reference: string; name: string; quantity: number; image?: string; category?: string };
export const QUOTE_BASKET_KEY = "merport-quote-basket";
export const QUOTE_BASKET_EVENT = "merport-basket-change";
const DRAWER_EVENT = "merport-basket-drawer";

const MAX_QTY = 999;
const EMPTY: QuoteItem[] = [];
let cache: { raw: string | null; items: QuoteItem[] } = { raw: null, items: EMPTY };

function isItem(value: unknown): value is QuoteItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item["slug"] === "string" && typeof item["reference"] === "string" && typeof item["name"] === "string" && typeof item["quantity"] === "number";
}

export function readBasket(): QuoteItem[] {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(QUOTE_BASKET_KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cache.raw) return cache.items;
  let items: QuoteItem[] = EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    items = Array.isArray(parsed) ? parsed.filter(isItem) : EMPTY;
  } catch {
    items = EMPTY;
  }
  cache = { raw, items };
  return items;
}

function writeBasket(items: QuoteItem[]) {
  try {
    window.localStorage.setItem(QUOTE_BASKET_KEY, JSON.stringify(items));
  } catch {
    /* stockage indisponible : le panier reste en mémoire pour l’onglet */
    cache = { raw: JSON.stringify(items), items };
  }
  window.dispatchEvent(new Event(QUOTE_BASKET_EVENT));
}

const clampQty = (quantity: number) => Math.max(1, Math.min(MAX_QTY, Math.round(quantity) || 1));

export function addItem(item: Omit<QuoteItem, "quantity">, quantity = 1) {
  const items = readBasket().map((entry) => ({ ...entry }));
  const existing = items.find((entry) => entry.slug === item.slug);
  if (existing) existing.quantity = clampQty(existing.quantity + quantity);
  else items.push({ ...item, quantity: clampQty(quantity) });
  writeBasket(items);
}

export function setQuantity(slug: string, quantity: number) {
  writeBasket(readBasket().map((entry) => (entry.slug === slug ? { ...entry, quantity: clampQty(quantity) } : entry)));
}

export function removeItem(slug: string) {
  writeBasket(readBasket().filter((entry) => entry.slug !== slug));
}

export function clearBasket() {
  writeBasket([]);
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === QUOTE_BASKET_KEY) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(QUOTE_BASKET_EVENT, callback);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(QUOTE_BASKET_EVENT, callback);
  };
}

export function useQuoteBasket() {
  return useSyncExternalStore(subscribe, readBasket, () => EMPTY);
}

export function useBasketCount() {
  return useQuoteBasket().reduce((sum, item) => sum + item.quantity, 0);
}

/* ---- Tiroir du devis ---- */
let drawerOpen = false;
export function setBasketDrawerOpen(open: boolean) {
  drawerOpen = open;
  window.dispatchEvent(new Event(DRAWER_EVENT));
}
function subscribeDrawer(callback: () => void) {
  window.addEventListener(DRAWER_EVENT, callback);
  return () => window.removeEventListener(DRAWER_EVENT, callback);
}
export function useBasketDrawerOpen() {
  return useSyncExternalStore(subscribeDrawer, () => drawerOpen, () => false);
}
