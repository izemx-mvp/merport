import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Bot, Check, Plus, RotateCcw, Send, X } from "lucide-react";
import { site } from "@/config/site";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { products } from "@/data/products";
import { addToQuote } from "@/components/merport/quote-actions";
import { WhatsAppIcon, telHref } from "@/components/merport/site-shell";
// MERPORT assistant — 100% client-side (no API key, no backend).
// Keyword intents + product search on src/data/products. Mount once in src/routes/__root.tsx.

/* ------------------------------------------------------------------ */
/* Types & helpers                                                     */
/* ------------------------------------------------------------------ */

type Product = (typeof products)[number];
type Action =
  | { kind: "link"; label: string; to: string }
  | { kind: "whatsapp"; label: string; text: string }
  | { kind: "tel"; label: string };

type Msg = {
  id: number;
  from: "bot" | "user";
  text: string;
  products?: string[]; // product slugs
  actions?: Action[];
};

const STORAGE_KEY = "merport-chat-v1";
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9,.\s]/g, " ");
const has = (q: string, words: string[]) => words.some((w) => q.includes(w));
const mainPhone = site.phones[0] ?? "";
const waLink = (text: string) => `https://wa.me/${site.whatsappDigits}?text=${encodeURIComponent(text)}`;

const QUICK = ["Trouver un produit", "Demander un devis", "Horaires & adresse", "Livraison", "Parler à un commercial"];

const STOP = new Set(
  "je j cherche besoin d de du des un une le la les pour sur avec et ou a au aux en mon ma mes vous avez il y prix tarif combien est ce cest svp merci bonjour salut".split(" "),
);

/* ------------------------------------------------------------------ */
/* Product search                                                      */
/* ------------------------------------------------------------------ */

const GENERIC = new Set(["cable", "cables", "fil", "fils", "materiel", "electrique", "produit", "produits"]);

/** Returns matches and whether they cover most of the query ("exact") or only part of it. */
function searchProducts(query: string): { items: Product[]; exact: boolean } {
  const words = norm(query)
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
  if (!words.length) return { items: [], exact: false };
  const specific = words.filter((w) => !GENERIC.has(w));
  const scored = products
    .map((p) => {
      const hay = norm([p.name, p.reference, p.brand, p.section, p.voltage].join(" "));
      const ref = norm(p.reference);
      let score = 0;
      let hits = 0;
      for (const w of words) {
        const weight = GENERIC.has(w) ? 0.5 : 1;
        if (ref.includes(w)) {
          score += 3 * weight;
          if (!GENERIC.has(w)) hits++;
        } else if (hay.includes(w)) {
          score += weight;
          if (!GENERIC.has(w)) hits++;
        }
      }
      return { p, score, hits };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best) return { items: [], exact: false };
  const exact = specific.length === 0 ? true : best.hits >= Math.ceil(specific.length * 0.6);
  return {
    items: scored.filter((x) => x.score >= Math.max(0.5, best.score - 1)).slice(0, 3).map((x) => x.p),
    exact,
  };
}

/* ------------------------------------------------------------------ */
/* Intent engine                                                       */
/* ------------------------------------------------------------------ */

function reply(input: string): Omit<Msg, "id" | "from"> {
  const q = norm(input);

  if (has(q, ["bonjour", "salut", "salam", "bonsoir", "hello", "coucou"]) && q.length < 25) {
    return {
      text: "Bonjour ! Je suis l’assistant MERPORT. Dites-moi la référence ou le produit que vous cherchez, ou choisissez un sujet ci-dessous.",
    };
  }
  if (has(q, ["merci", "parfait", "super", "top"]) && q.length < 30) {
    return { text: "Avec plaisir ! Autre chose ? Je peux aussi transmettre votre demande à un commercial." };
  }
  if (has(q, ["commercial", "humain", "conseiller", "parler a", "rappel", "rappeler", "whatsapp"])) {
    return {
      text: "Un commercial MERPORT vous répond rapidement sur WhatsApp ou par téléphone, aux heures d’ouverture.",
      actions: [
        { kind: "whatsapp", label: "Écrire sur WhatsApp", text: "Bonjour MERPORT, je souhaite parler à un commercial." },
        { kind: "tel", label: `Appeler le ${mainPhone}` },
      ],
    };
  }
  if (has(q, ["horaire", "heure", "ouvert", "ferme", "adresse", "ou etes", "situe", "localisation", "itineraire", "venir", "plan"])) {
    return {
      text: `Nous sommes au ${site.address}.\n\nHoraires : ${site.hours}`,
      actions: [
        { kind: "link", label: "Plan d’accès", to: "/contact" },
        { kind: "tel", label: `Appeler le ${mainPhone}` },
      ],
    };
  }
  if (has(q, ["telephone", "tel", "appeler", "numero", "email", "mail", "contact", "joindre"])) {
    return {
      text: `Téléphone : ${site.phones.join(" · ")}\nWhatsApp : ${site.whatsappDisplay}\nE-mail : ${site.email}`,
      actions: [
        { kind: "tel", label: "Appeler" },
        { kind: "whatsapp", label: "WhatsApp", text: "Bonjour MERPORT," },
      ],
    };
  }
  if (has(q, ["livraison", "livrer", "delai", "expedition", "transport", "chantier"])) {
    return {
      text: "Nous livrons partout au Maroc, directement sur chantier si besoin. Le délai dépend des références et des quantités : il est confirmé sur votre devis.",
      actions: [{ kind: "link", label: "Demander un devis", to: "/devis" }],
    };
  }
  if (has(q, ["export", "afrique", "senegal", "mali", "cote d", "conteneur", "groupage", "etranger"])) {
    return {
      text: "Nous accompagnons aussi les projets à l’export vers l’Afrique de l’Ouest et centrale : préparation, colisage et documents. Parlez-nous de votre projet.",
      actions: [
        { kind: "link", label: "Projet export", to: "/contact" },
        { kind: "whatsapp", label: "WhatsApp", text: "Bonjour MERPORT, j’ai un projet export." },
      ],
    };
  }
  if (has(q, ["paiement", "payer", "facture", "virement", "cheque", "credit"])) {
    return {
      text: "Les conditions de paiement sont précisées avec votre offre. Un commercial peut vous les détailler.",
      actions: [{ kind: "whatsapp", label: "Poser la question", text: "Bonjour MERPORT, quelles sont vos conditions de paiement ?" }],
    };
  }
  if (has(q, ["marque", "fabricant", "fournisseur", ...brands.map((b) => norm(b.name).split(" ")[0] ?? "")].filter(Boolean))) {
    const named = brands.find((b) => q.includes(norm(b.name).split(" ")[0] ?? "###"));
    if (named) {
      return {
        text: `${named.name} : ${named.specialty}. ${named.description}`,
        actions: [
          { kind: "link", label: `Produits ${named.name}`, to: `/produits?marque=${encodeURIComponent(named.name)}` },
          { kind: "link", label: "Toutes les marques", to: "/marques" },
        ],
      };
    }
    return {
      text: `Nous importons en direct : ${brands.map((b) => b.name).join(", ")}. Une autre marque ? Nous pouvons la sourcer.`,
      actions: [{ kind: "link", label: "Voir les marques", to: "/marques" }],
    };
  }
  if (has(q, ["devis", "cotation", "offre", "chiffrage", "liste", "bordereau"]) || q.includes("demander un devis")) {
    return {
      text: "Pour un devis : ajoutez des produits au panier ou collez directement votre liste de références (avec quantités). Vous pouvez aussi joindre un bordereau ou une photo. Réponse sous 24 h ouvrées.",
      actions: [{ kind: "link", label: "Demander un devis", to: "/devis" }],
    };
  }
  if (has(q, ["prix", "tarif", "combien", "cout", "cher"])) {
    const found = searchProducts(input).items;
    return {
      text: found.length
        ? "Nos prix sont communiqués sur devis, selon les quantités. Voici ce que j’ai trouvé : ajoutez-les au devis pour recevoir l’offre."
        : "Nos prix sont communiqués sur devis, car ils dépendent des quantités. Ajoutez vos produits au devis ou envoyez votre liste, réponse sous 24 h ouvrées.",
      ...(found.length ? { products: found.map((p) => p.slug) } : {}),
      actions: [{ kind: "link", label: "Demander un devis", to: "/devis" }],
    };
  }

  // Family match
  const family = categories.find((c) => {
    const n = norm(`${c.name} ${c.shortName}`);
    return n.split(/\s+/).some((w) => w.length > 4 && q.includes(w.slice(0, -1)));
  });

  // Product search
  const { items: found, exact } = searchProducts(input);
  if (found.length && exact) {
    return {
      text: found.length === 1 ? "J’ai trouvé cette référence :" : `J’ai trouvé ${found.length} références correspondantes :`,
      products: found.map((p) => p.slug),
      actions: family ? [{ kind: "link", label: `Toute la famille ${family.shortName}`, to: `/produits/${family.slug}` }] : [],
    };
  }
  if (found.length) {
    return {
      text: "Je n’ai pas cette référence exacte en ligne (le catalogue n’est qu’une sélection). Envoyez-la-nous pour un chiffrage ou un équivalent. Voici des produits proches :",
      products: found.map((p) => p.slug),
      actions: [
        { kind: "link", label: "Demander cette référence", to: `/devis?ref=${encodeURIComponent(input.slice(0, 80))}` },
        { kind: "whatsapp", label: "WhatsApp", text: `Bonjour MERPORT, je cherche : ${input}` },
      ],
    };
  }
  if (family) {
    return {
      text: `Notre famille ${family.name} : ${family.description}`,
      actions: [{ kind: "link", label: `Voir ${family.shortName}`, to: `/produits/${family.slug}` }],
    };
  }
  if (has(q, ["trouver un produit", "produit", "catalogue", "reference", "chercher"])) {
    return {
      text: "Tapez une référence ou une désignation (ex. « U-1000 R2V 3G2,5 », « disjoncteur 16A », « réglette LED »). Ou parcourez nos familles :",
      actions: categories.slice(0, 4).map((c) => ({ kind: "link" as const, label: c.shortName, to: `/produits/${c.slug}` })),
    };
  }

  // Fallback
  return {
    text: "Je n’ai pas trouvé cette référence dans le catalogue en ligne, qui n’est qu’une sélection. Envoyez-la-nous : nous la chiffrons ou proposons un équivalent.",
    actions: [
      { kind: "link", label: "Demander cette référence", to: `/devis?ref=${encodeURIComponent(input.slice(0, 80))}` },
      { kind: "whatsapp", label: "WhatsApp", text: `Bonjour MERPORT, je cherche : ${input}` },
    ],
  };
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function ProductMini({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-mp-line bg-white p-2.5">
      <img src={product.image} alt="" width={96} height={96} loading="lazy" className="size-12 shrink-0 rounded-xl bg-mp-paper object-contain p-0.5" />
      <Link to="/produits/$category/$product" params={{ category: product.category, product: product.slug }} className="min-w-0 flex-1">
        <span className="block truncate text-[0.84rem] font-semibold text-mp-ink hover:text-mp-red">{product.name}</span>
        <span className="block truncate font-mono text-[0.68rem] text-mp-muted">Réf. {product.reference}</span>
      </Link>
      <button
        type="button"
        aria-label={`Ajouter ${product.name} au devis`}
        onClick={() => {
          addToQuote(product, 1);
          setAdded(true);
        }}
        className={cx(
          "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border-[1.5px] transition",
          added ? "border-green-600 bg-green-600 text-white" : "border-mp-ink text-mp-ink hover:border-mp-red hover:bg-mp-red hover:text-white",
        )}
      >
        {added ? <Check size={15} /> : <Plus size={15} />}
      </button>
    </div>
  );
}

function ActionChip({ action, onNavigate }: { action: Action; onNavigate: () => void }) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full border-[1.5px] px-3 py-1.5 text-[0.8rem] font-semibold transition";
  if (action.kind === "link") {
    return (
      <a href={action.to} onClick={onNavigate} className={cx(base, "border-mp-ink bg-mp-ink text-white hover:bg-black")}>
        {action.label} <ArrowRight size={13} />
      </a>
    );
  }
  if (action.kind === "whatsapp") {
    return (
      <a href={waLink(action.text)} target="_blank" rel="noreferrer" className={cx(base, "border-[#25d366] bg-[#25d366] text-white hover:brightness-95")}>
        <span className="inline-flex size-3.5 [&_svg]:size-full">
          <WhatsAppIcon />
        </span>
        {action.label}
      </a>
    );
  }
  return (
    <a href={telHref(mainPhone)} className={cx(base, "border-mp-line text-mp-ink hover:border-mp-ink")}>
      {action.label} <ArrowUpRight size={13} />
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Chatbot                                                             */
/* ------------------------------------------------------------------ */

const WELCOME: Msg = {
  id: 0,
  from: "bot",
  text: "Bonjour 👋 Je suis l’assistant MERPORT. Je peux trouver une référence, vous orienter vers un devis ou vous donner nos horaires et coordonnées.",
};

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  // Restore conversation for this browser session
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Msg[];
        if (Array.isArray(parsed) && parsed.length) {
          setMsgs(parsed);
          nextId.current = Math.max(...parsed.map((m) => m.id)) + 1;
        }
      }
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setTeaser(true), 6000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-40)));
    } catch {
      /* ignore */
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  useEffect(() => {
    if (!open) return;
    setTeaser(false);
    const t = window.setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean || typing) return;
    setMsgs((m) => [...m, { id: nextId.current++, from: "user", text: clean }]);
    setInput("");
    setTyping(true);
    const answer = reply(clean);
    window.setTimeout(() => {
      setMsgs((m) => [...m, { id: nextId.current++, from: "bot", ...answer }]);
      setTyping(false);
    }, 450 + Math.min(900, answer.text.length * 6));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const reset = () => {
    setMsgs([WELCOME]);
    nextId.current = 1;
  };

  const handoff = () => {
    const lastUser = [...msgs].reverse().find((m) => m.from === "user")?.text;
    return waLink(`Bonjour MERPORT${lastUser ? `, ma demande : ${lastUser}` : ", j’ai une question."}`);
  };

  const showQuick = msgs.length <= 2 && !typing;

  return (
    <>
      {/* Launcher (sits above the WhatsApp float) */}
      <div className={cx("fixed bottom-[88px] right-5 z-40 flex items-center transition", open && "pointer-events-none opacity-0")}>
        {teaser && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mr-3 hidden cursor-pointer rounded-2xl rounded-br-sm bg-white px-4 py-2.5 text-left text-[0.84rem] text-mp-ink shadow-[0_15px_35px_-12px_rgba(11,24,56,0.5)] animate-fade-up md:block"
          >
            <strong className="block">Une référence à trouver ?</strong>
            <span className="text-mp-muted">Je vous aide en 10 secondes.</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir l’assistant MERPORT"
          aria-expanded={open}
          className="relative grid size-14 cursor-pointer place-items-center rounded-full bg-mp-ink text-white shadow-[0_12px_30px_-8px_rgba(11,24,56,0.7)] transition hover:scale-105"
        >
          <Bot size={24} />
          <span className="absolute right-0.5 top-0.5 size-3.5 rounded-full border-2 border-white bg-mp-red" />
        </button>
      </div>

      {/* Panel */}
      {open && (
        <section
          role="dialog"
          aria-label="Assistant MERPORT"
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-mp-paper animate-fade-up [animation-duration:350ms] sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(640px,calc(100vh-40px))] sm:w-[400px] sm:rounded-[26px] sm:border sm:border-mp-line sm:shadow-[0_40px_80px_-30px_rgba(11,24,56,0.6)]"
        >
          {/* Header */}
          <header className="relative flex items-center gap-3 bg-mp-navy bg-blueprint-dark px-4 py-3.5 text-white">
            <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-mp-red">
              <Bot size={20} />
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-mp-navy bg-green-500" />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-[0.98rem] leading-tight">Assistant MERPORT</strong>
              <span className="block font-mono text-[0.66rem] uppercase tracking-[0.12em] text-white/55">Réponse instantanée</span>
            </span>
            <button type="button" onClick={reset} aria-label="Nouvelle conversation" className="grid size-9 cursor-pointer place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white">
              <RotateCcw size={16} />
            </button>
            <button type="button" onClick={() => setOpen(false)} aria-label="Fermer l’assistant" className="grid size-9 cursor-pointer place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white">
              <X size={18} />
            </button>
          </header>

          {/* Messages */}
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {msgs.map((m) => (
              <div key={m.id} className={cx("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                <div className={cx("max-w-[88%]", m.from === "user" && "max-w-[80%]")}>
                  <p
                    className={cx(
                      "m-0 whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[0.9rem] leading-relaxed",
                      m.from === "user" ? "rounded-br-sm bg-mp-red text-white" : "rounded-bl-sm border border-mp-line bg-white text-mp-ink",
                    )}
                  >
                    {m.text}
                  </p>
                  {m.products && m.products.length > 0 && (
                    <div className="mt-2 grid gap-2">
                      {m.products.map((slug) => {
                        const p = products.find((x) => x.slug === slug);
                        return p ? <ProductMini key={slug} product={p} /> : null;
                      })}
                    </div>
                  )}
                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.actions.map((a) => (
                        <ActionChip key={a.label} action={a} onNavigate={() => setOpen(false)} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex">
                <span className="inline-flex gap-1 rounded-2xl rounded-bl-sm border border-mp-line bg-white px-4 py-3" aria-label="L’assistant écrit">
                  {[0, 150, 300].map((d) => (
                    <i key={d} className="size-1.5 animate-bounce rounded-full bg-mp-muted" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </span>
              </div>
            )}
            {showQuick && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="cursor-pointer rounded-full border-[1.5px] border-mp-line bg-white px-3 py-1.5 text-[0.8rem] font-semibold text-mp-ink transition hover:border-mp-red hover:text-mp-red"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-mp-line bg-white px-3 pb-3 pt-2.5">
            <form onSubmit={onSubmit} className="flex items-center gap-2 rounded-full border-[1.5px] border-mp-line bg-mp-paper py-1 pl-4 pr-1 transition focus-within:border-mp-ink">
              <label htmlFor="chat-input" className="sr-only">
                Votre message
              </label>
              <input
                ref={inputRef}
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Référence, question…"
                autoComplete="off"
                maxLength={200}
                className="h-10 min-w-0 flex-1 border-0 bg-transparent text-[0.92rem] text-mp-ink outline-none placeholder:text-mp-muted/70"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Envoyer"
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-mp-red text-white transition hover:bg-mp-red-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
            <a href={handoff()} target="_blank" rel="noreferrer" className="mt-2 flex items-center justify-center gap-1.5 text-[0.76rem] font-semibold text-mp-muted transition hover:text-[#1a9e4c]">
              <span className="inline-flex size-3.5 [&_svg]:size-full">
                <WhatsAppIcon />
              </span>
              Continuer avec un commercial sur WhatsApp
            </a>
          </div>
        </section>
      )}
    </>
  );
}