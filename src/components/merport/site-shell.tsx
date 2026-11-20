import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, ArrowUpRight, ChevronDown, FileText, Mail, MapPin, Menu, Phone, UserRound, X } from "lucide-react";
import { categories } from "@/data/categories";
import { site } from "@/config/site";
import { setBasketDrawerOpen, useBasketCount } from "@/lib/quote-basket";
import { BrandMark } from "./brand-mark";
// Uses the Tailwind tokens/utilities from src/home.css (bg-mp-*, text-outline, current-x, animate-*)

const telHref = (phone: string) => `tel:+212${phone.replace(/\s+/g, "").replace(/^0/, "")}`;
export { telHref };

const pad = (n: number) => String(n).padStart(2, "0");
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const navLinks = [
  { label: "Marques", to: "/marques" },
  { label: "Secteurs", to: "/secteurs" },
  { label: "À propos", to: "/a-propos" },
  { label: "Contact", to: "/contact" },
] as const;

const mainPhone = site.phones[0] ?? "";

/** Scroll state for the header (compact + shadow) and the reading progress line. */
function useScrollState() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 12);
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return { scrolled, progress };
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const navLinkClass =
  "group relative inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-lg px-2.5 text-[0.9rem] font-medium text-mp-ink transition-colors hover:text-mp-red xl:px-3 xl:text-[0.95rem]";

/** Red "current" underline that draws on hover / stays on the active link. */
function NavUnderline() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-2.5 bottom-1 h-[2px] origin-left scale-x-0 bg-mp-red transition-transform duration-300 ease-out-expo group-hover:scale-x-100 group-[.is-active]:scale-x-100 xl:inset-x-3"
    />
  );
}

function LiveDot({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cx("inline-block size-2 shrink-0 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.25)]", className)} />;
}

/* ------------------------------------------------------------------ */
/* Mega menu                                                           */
/* ------------------------------------------------------------------ */

function MegaMenu() {
  const [active, setActive] = useState(0);
  const current = categories[active];

  return (
    <div
      id="mega-menu"
      className="absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-var(--header-h,72px)-2.5rem)] overflow-y-auto overscroll-contain border-b border-mp-line bg-white shadow-[0_40px_80px_-40px_rgba(11,24,56,0.45)] animate-fade-up [animation-duration:350ms]"
    >
      {/* invisible bridge so the menu doesn't close while the pointer travels down */}
      <span aria-hidden="true" className="absolute inset-x-0 -top-3 h-3" />
      <div className="container grid gap-8 py-8 xl:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-5 flex items-center justify-between">
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-mp-muted">
              Catalogue · {categories.length} familles
            </span>
            <Link to="/produits" className="inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-mp-red transition-all hover:gap-2.5">
              Tout le catalogue <ArrowRight size={15} />
            </Link>
          </div>

          <ol className="m-0 grid list-none grid-cols-2 gap-2 p-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4">
            {categories.map((category, index) => (
              <li key={category.slug}>
                <Link
                  to="/produits/$category"
                  params={{ category: category.slug }}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className={cx(
                    "group flex items-center gap-3 rounded-2xl border p-2.5 pr-3 transition",
                    index === active ? "border-mp-ink bg-mp-paper" : "border-transparent hover:bg-mp-paper",
                  )}
                >
                  <img
                    src={category.image}
                    alt=""
                    width={120}
                    height={120}
                    loading="lazy"
                    decoding="async"
                    className="size-14 shrink-0 rounded-xl object-cover"
                  />
                  <span className="min-w-0">
                    <span className={cx("block font-mono text-[0.66rem]", index === active ? "text-mp-red" : "text-mp-muted")}>
                      {pad(index + 1)}
                    </span>
                    <span className="block text-[0.88rem] font-semibold leading-tight text-mp-ink">{category.name}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <Link
            to="/devis"
            className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-dashed border-[#c9cdd6] px-5 py-3.5 text-[0.9rem] text-mp-muted transition hover:border-mp-red hover:text-mp-ink"
          >
            <span>
              <strong className="text-mp-ink">Une référence introuvable ?</strong> Envoyez votre liste, on s’en occupe.
            </span>
            <ArrowRight size={16} className="shrink-0 text-mp-red" />
          </Link>
        </div>

        {/* Preview (xl and up only) */}
        <div className="relative hidden min-h-[300px] overflow-hidden rounded-3xl bg-mp-navy text-white xl:block" aria-hidden="true">
          {categories.map((category, index) => (
            <img
              key={category.slug}
              src={category.image}
              alt=""
              width={1200}
              height={1200}
              loading="lazy"
              decoding="async"
              className={cx(
                "absolute inset-0 size-full object-cover transition duration-500 ease-out-expo",
                index === active ? "scale-100 opacity-100" : "scale-110 opacity-0",
              )}
            />
          ))}
          <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(8,17,42,0.95)_0%,rgba(8,17,42,0.2)_60%)]" />
          <span className="absolute right-5 top-3 text-[4.5rem] font-extrabold leading-none tracking-[-0.05em] text-outline [--outline:rgba(255,255,255,0.7)]">
            {pad(active + 1)}
          </span>
          <div className="absolute inset-x-6 bottom-6">
            <p className="m-0 text-[1.15rem] font-bold leading-tight">{current?.name}</p>
            <p className="m-0 mt-2 text-[0.86rem] leading-snug text-white/75">{current?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

export function SiteHeader() {
  const count = useBasketCount();
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const { scrolled, progress } = useScrollState();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    setOpen(false);
    setProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!productsOpen && !open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setProductsOpen(false);
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [productsOpen, open]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("nav-locked", open);
    root.style.overflow = open ? "hidden" : "";
    return () => {
      root.classList.remove("nav-locked");
      root.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Utility bar (scrolls away, desktop only) */}
      <div className="hidden bg-mp-night text-white/70 lg:block">
        <div className="container flex h-9 items-center justify-between font-mono text-[0.7rem] uppercase tracking-[0.12em]">
          <span className="inline-flex items-center gap-2.5">
            <LiveDot /> Importateur-distributeur · Casablanca · Depuis 1988
          </span>
          <span className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={12} className="text-[#ff6b72]" /> Aïn Sebaâ
            </span>
            {mainPhone && (
              <a href={telHref(mainPhone)} className="hidden items-center gap-1.5 tracking-[0.08em] transition-colors hover:text-white xl:inline-flex">
                <Phone size={12} className="text-[#ff6b72]" /> {mainPhone}
              </a>
            )}
            <a
              href={`mailto:${site.email}`}
              className="hidden items-center gap-1.5 normal-case tracking-[0.04em] transition-colors hover:text-white xl:inline-flex"
            >
              <Mail size={12} className="text-[#ff6b72]" /> {site.email}
            </a>
            <span className="text-[#ff8a8f]">Devis sous 24 h ouvrées</span>
          </span>
        </div>
      </div>

      <header
        className={cx(
          "sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300",
          scrolled || open
            ? "border-mp-line bg-white/90 shadow-[0_10px_30px_-20px_rgba(11,24,56,0.45)] backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-white",
        )}
      >
        <div className="container flex h-[var(--header-h,72px)] items-center gap-3 xl:gap-6">
          <Link to="/" className="flex shrink-0 items-center" aria-label="MERPORT, accueil">
            <BrandMark compact />
          </Link>

          <nav className="ml-2 hidden shrink-0 items-center gap-0 lg:flex xl:ml-6 xl:gap-1" aria-label="Navigation principale">
            <div onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)} className="flex items-center">
              <Link to="/produits" className={navLinkClass} activeProps={{ className: cx(navLinkClass, "is-active !text-mp-red") }}>
                Produits
                <NavUnderline />
              </Link>
              <button
                type="button"
                aria-expanded={productsOpen}
                aria-controls="mega-menu"
                aria-label="Afficher les familles de produits"
                onClick={() => setProductsOpen((value) => !value)}
                className="-ml-2 grid size-8 shrink-0 cursor-pointer place-items-center rounded-md text-mp-ink transition hover:text-mp-red"
              >
                <ChevronDown size={15} className={cx("transition-transform duration-300", productsOpen && "rotate-180")} />
              </button>
              {productsOpen && <MegaMenu />}
            </div>
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={navLinkClass} activeProps={{ className: cx(navLinkClass, "is-active !text-mp-red") }}>
                {link.label}
                <NavUnderline />
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 xl:gap-2.5">
            <Link
              to="/espace-client"
              aria-label="Espace client"
              className="hidden h-11 shrink-0 items-center gap-2 rounded-full border-[1.5px] border-mp-line px-3 text-[0.88rem] font-semibold text-mp-ink transition hover:border-mp-ink sm:inline-flex xl:px-4"
            >
              <UserRound size={16} className="text-mp-red" />
              <span className="hidden xl:inline">Espace client</span>
            </Link>

            {/* CTA: short label on lg, full label from xl */}
            <Link
              to="/devis"
              className="hidden h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-mp-red px-4 text-[0.9rem] font-semibold text-white shadow-[0_8px_20px_-10px_rgba(215,31,43,0.8)] transition hover:-translate-y-px hover:bg-mp-red-dark lg:inline-flex xl:px-5"
            >
              <span className="xl:hidden">Devis</span>
              <span className="hidden xl:inline">Demander un devis</span>
              <ArrowRight size={15} />
            </Link>

            {/* Basket, styled like a meter readout: icon + count until xl, label from xl */}
            <button
              type="button"
              onClick={() => setBasketDrawerOpen(true)}
              aria-label={`Ouvrir le devis, ${count} article${count > 1 ? "s" : ""}`}
              className="group inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-mp-ink bg-white pl-3 pr-1.5 font-mono text-[0.74rem] font-medium uppercase tracking-[0.12em] text-mp-ink transition hover:border-mp-red xl:pl-4"
            >
              <FileText size={16} className="xl:hidden" aria-hidden="true" />
              <span className="hidden xl:inline">Devis</span>
              <span
                suppressHydrationWarning
                className={cx(
                  "grid h-8 min-w-8 place-items-center rounded-full px-2 text-[0.8rem] tabular-nums transition-colors",
                  count > 0 ? "bg-mp-red text-white" : "bg-mp-ink text-white/80",
                )}
              >
                {pad(count)}
              </span>
            </button>

            <button
              type="button"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-mp-ink transition hover:bg-mp-paper lg:hidden"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Reading progress: a live wire with a glowing head */}
        <span aria-hidden="true" className="pointer-events-none absolute bottom-[-1px] left-0 h-[2px] bg-mp-red" style={{ width: `${progress * 100}%` }}>
          <span className={cx("absolute -right-1 -top-[3px] size-2 rounded-full bg-mp-red shadow-[0_0_10px_2px_rgba(215,31,43,0.7)]", progress <= 0 && "hidden")} />
        </span>
      </header>

      {/* Mobile navigation — outside <header> so the header's backdrop-filter doesn't trap position:fixed */}
      {open && (
        <nav
          aria-label="Navigation mobile"
          className="fixed inset-x-0 bottom-0 top-[var(--header-h,72px)] z-[45] overflow-y-auto bg-mp-navy bg-blueprint-dark text-white lg:hidden"
        >
          <div className="container flex min-h-full flex-col pb-8 pt-6">
            <Link to="/produits" className="flex items-center gap-4 border-b border-white/10 py-4 text-[1.6rem] font-extrabold tracking-[-0.03em]">
              <span className="font-mono text-[0.75rem] font-normal text-[#ff8a8f]">01</span>
              Produits
              <ArrowUpRight size={20} className="ml-auto text-white/50" />
            </Link>
            <div className="grid grid-cols-2 gap-2 py-4">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to="/produits/$category"
                  params={{ category: category.slug }}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 p-2 text-[0.84rem] font-semibold leading-tight"
                >
                  <img src={category.image} alt="" width={120} height={120} loading="lazy" decoding="async" className="size-10 shrink-0 rounded-lg object-cover" />
                  <span>{category.shortName}</span>
                </Link>
              ))}
            </div>
            {navLinks.map((link, index) => (
              <Link key={link.to} to={link.to} className="flex items-center gap-4 border-b border-white/10 py-4 text-[1.6rem] font-extrabold tracking-[-0.03em]">
                <span className="font-mono text-[0.75rem] font-normal text-[#ff8a8f]">{pad(index + 2)}</span>
                {link.label}
                <ArrowUpRight size={20} className="ml-auto text-white/50" />
              </Link>
            ))}

            <div className="mt-auto grid gap-3 pt-8">
              {mainPhone && (
                <a href={telHref(mainPhone)} className="inline-flex items-center gap-2 font-mono text-white/80">
                  <Phone size={15} className="text-[#ff6b72]" /> {mainPhone}
                </a>
              )}
              <Link to="/devis" className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-mp-red font-semibold">
                Demander un devis <ArrowRight size={16} />
              </Link>
              <a
                href={`https://wa.me/${site.whatsappDigits}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-white/25 font-semibold"
              >
                <span className="inline-flex size-4 [&_svg]:size-full">
                  <WhatsAppIcon />
                </span>
                WhatsApp
              </a>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

const footLink = "text-white/70 transition-colors hover:text-white";
const footHead = "mb-4 block font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/45";

function Screw({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        "absolute size-2.5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#f2f3f6,#8d929c)] after:absolute after:inset-x-[2px] after:top-1/2 after:h-px after:-translate-y-1/2 after:bg-black/40 after:content-['']",
        className,
      )}
    />
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-mp-night text-white">
      {/* CTA band */}
      <div className="relative border-b border-white/10">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 size-[640px] rounded-full bg-[radial-gradient(circle,rgba(215,31,43,0.28),transparent_65%)]"
        />
        <div className="container relative grid items-center gap-10 py-16 md:py-20 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="inline-flex items-center gap-2.5 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-white/60">
              <LiveDot /> Réponse sous 24 h ouvrées
            </span>
            <p className="m-0 mt-4 text-[clamp(2.2rem,4.6vw,4.2rem)] font-extrabold leading-[1] tracking-[-0.04em]">
              Un projet, une liste, <span className="text-mp-red">une référence ?</span>
            </p>
          </div>
          <div className="grid gap-3">
            <Link
              to="/devis"
              className="group flex items-center justify-between gap-4 rounded-[22px] bg-mp-red py-3 pl-7 pr-3 text-[1.15rem] font-bold transition hover:bg-mp-red-dark"
            >
              Demander un devis
              <span className="grid size-14 place-items-center rounded-full bg-white text-mp-red transition-transform duration-500 ease-out-expo group-hover:rotate-45">
                <ArrowUpRight size={24} />
              </span>
            </Link>
            <a
              href={`https://wa.me/${site.whatsappDigits}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-4 rounded-[22px] border border-white/15 px-7 py-4 font-semibold text-white/85 transition hover:border-[#25d366] hover:text-[#25d366]"
            >
              <span className="inline-flex items-center gap-2.5">
                <span className="inline-flex size-[18px] [&_svg]:size-full">
                  <WhatsAppIcon />
                </span>
                WhatsApp
              </span>
              <span className="font-mono text-[0.88rem]">{site.whatsappDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="bg-blueprint-dark">
        <div className="container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.8fr_1fr]">
          <div>
            <span className="inline-flex rounded-xl bg-white px-3 py-2">
              <BrandMark />
            </span>
            <p className="m-0 mt-5 max-w-[28ch] text-[1.15rem] font-semibold leading-snug text-white">
              L’énergie de vos projets, livrée sans détour.
            </p>

            {/* Rating-plate style legal card */}
            <div className="relative mt-7 max-w-[340px] rounded-xl bg-[linear-gradient(160deg,#e6e8ee_0%,#c4c9d3_55%,#dfe2e8_100%)] px-6 py-5 text-mp-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_20px_40px_-20px_rgba(0,0,0,0.8)]">
              <Screw className="left-2 top-2" />
              <Screw className="right-2 top-2" />
              <Screw className="bottom-2 left-2" />
              <Screw className="bottom-2 right-2" />
              <div className="flex items-baseline justify-between border-b border-mp-ink/20 pb-2 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-mp-ink/60">
                <span>Plaque signalétique</span>
                <span>MP-1988</span>
              </div>
              <p className="m-0 mt-2.5 text-[1rem] font-extrabold tracking-[-0.01em]">MERPORT SARL</p>
              <p className="m-0 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-mp-ink/70">Importateur · distributeur · Casablanca</p>
              <p className="m-0 mt-2.5 font-mono text-[0.64rem] leading-relaxed text-mp-ink/70">{site.legal}</p>
            </div>
          </div>

          <div>
            <span className={footHead}>Catalogue</span>
            <ul className="m-0 grid list-none gap-2.5 p-0 text-[0.94rem]">
              {categories.map((category, index) => (
                <li key={category.slug}>
                  <Link to="/produits/$category" params={{ category: category.slug }} className={cx(footLink, "group inline-flex items-baseline gap-2.5")}>
                    <span className="font-mono text-[0.66rem] text-white/35 transition-colors group-hover:text-mp-red">{pad(index + 1)}</span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className={footHead}>MERPORT</span>
            <ul className="m-0 grid list-none gap-2.5 p-0 text-[0.94rem]">
              {[
                { to: "/produits", label: "Catalogue" },
                { to: "/marques", label: "Nos marques" },
                { to: "/secteurs", label: "Secteurs" },
                { to: "/a-propos", label: "À propos" },
                { to: "/devis", label: "Demander un devis" },
                { to: "/espace-client", label: "Espace client" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={footLink}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className={footHead}>Casablanca</span>
            <p className="m-0 flex gap-2.5 text-[0.94rem] leading-relaxed text-white/70">
              <MapPin size={15} className="mt-1 shrink-0 text-[#ff6b72]" aria-hidden="true" />
              {site.address}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`MERPORT ${site.address}`)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 pl-[25px] text-[0.84rem] font-semibold text-[#ff8a8f] transition-all hover:gap-2.5"
            >
              Itinéraire <ArrowUpRight size={14} />
            </a>
            <ul className="m-0 mt-5 grid list-none gap-2.5 p-0 text-[0.94rem]">
              {site.phones.map((phone) => (
                <li key={phone}>
                  <a href={telHref(phone)} className={cx(footLink, "inline-flex items-center gap-2.5 font-mono text-[0.9rem]")}>
                    <Phone size={14} className="text-[#ff6b72]" aria-hidden="true" /> {phone}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className={cx(footLink, "inline-flex items-center gap-2.5")}>
                  <Mail size={14} className="text-[#ff6b72]" aria-hidden="true" /> {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant wordmark with a live wire running through it */}
        <div className="relative select-none overflow-hidden" aria-hidden="true">
          <p className="m-0 text-center text-[clamp(4.5rem,19vw,17rem)] font-extrabold leading-[0.82] tracking-[-0.06em] text-outline [--outline:rgba(255,255,255,0.14)]">
            MERPORT
          </p>
          <span className="absolute inset-x-0 top-[46%] h-[2px] current-x opacity-70 animate-flow-x" />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-4 py-6 pb-24 text-[0.8rem] text-white/50 md:flex-row md:items-center md:justify-between md:pb-6">
          <span>© {new Date().getFullYear()} MERPORT SARL · Tous droits réservés</span>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/mentions-legales" className="transition-colors hover:text-white">
              Mentions légales
            </Link>
            <Link to="/confidentialite" className="transition-colors hover:text-white">
              Confidentialité
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/70 transition hover:border-white/50 hover:text-white"
            >
              Haut de page <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* WhatsApp                                                            */
/* ------------------------------------------------------------------ */

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.52 3.48A11.87 11.87 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.15 1.6 5.95L.05 24l6.28-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.57 0 11.92-5.35 11.92-11.93a11.85 11.85 0 0 0-3.49-8.41ZM12.09 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.73.98 1-3.64-.23-.37a9.88 9.88 0 0 1-1.52-5.25c0-5.48 4.46-9.94 9.94-9.94a9.9 9.9 0 0 1 7.03 2.92 9.88 9.88 0 0 1 2.91 7.03c0 5.48-4.46 9.94-9.94 9.94Zm5.45-7.44c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37s-1.05 1.02-1.05 2.49 1.08 2.89 1.23 3.09c.15.2 2.12 3.24 5.14 4.55.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.18-1.42-.07-.13-.27-.2-.57-.35Z" /></svg>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${site.whatsappDigits}?text=${encodeURIComponent("Bonjour MERPORT, je souhaite un renseignement.")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Contacter MERPORT sur WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center"
    >
      <span className="pointer-events-none mr-3 hidden translate-x-2 rounded-full bg-white px-4 py-2 text-[0.86rem] font-semibold text-mp-ink opacity-0 shadow-[0_10px_30px_-10px_rgba(11,24,56,0.5)] transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
        Une question ?
      </span>
      <span className="relative grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)] transition-transform group-hover:scale-105">
        <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-30 [animation-duration:2.4s]" />
        <span className="relative inline-flex size-7 [&_svg]:size-full">
          <WhatsAppIcon />
        </span>
      </span>
    </a>
  );
}