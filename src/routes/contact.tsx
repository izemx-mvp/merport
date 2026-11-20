import { useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  Mail,
  MapPin,
  MessageSquareText,
  Navigation,
  Phone,
  Search,
} from "lucide-react";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { contactSubmissionSchema, fieldErrors } from "@/lib/submission-schemas";
import { submitContactRequest } from "@/lib/submissions.functions";
import { WhatsAppIcon, telHref } from "@/components/merport/site-shell";
// Tailwind tokens/utilities: src/home.css

export const Route = createFileRoute("/contact")({
  head: () =>
    seo({
      title: "Contact",
      description: `Contactez MERPORT à Casablanca : ${site.phones.join(" · ")}, WhatsApp ${site.whatsappDisplay}, ${site.email}. ${site.address}.`,
    }),
  component: ContactPage,
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const pad = (n: number) => String(n).padStart(2, "0");
const mainPhone = site.phones[0] ?? "";
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`MERPORT ${site.address}`)}`;

function Label({ children, light, className }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <p
      className={cx(
        "mb-[18px] inline-flex items-center gap-2.5 font-mono text-[0.74rem] font-medium uppercase tracking-[0.16em]",
        "before:h-0.5 before:w-6 before:bg-current before:content-['']",
        light ? "text-[#ff8a8f]" : "text-mp-red",
        className,
      )}
    >
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */

const SUBJECTS = ["Demande d’information produit", "Disponibilité / délai", "Projet export Afrique", "Devenir fournisseur", "Autre demande"];

const initial = { companyName: "", ice: "", contactName: "", email: "", phone: "", subject: SUBJECTS[0] ?? "", message: "", website: "" };
type ContactForm = typeof initial;

const inputBase =
  "w-full rounded-xl border-[1.5px] bg-white px-4 py-3.5 text-[0.98rem] text-mp-ink outline-none transition placeholder:text-mp-muted/60 focus:border-mp-ink focus:shadow-[0_0_0_4px_rgba(11,24,56,0.08)]";

type FieldProps = {
  label: string;
  name: keyof ContactForm;
  error?: string | undefined;
  required?: boolean | undefined;
  className?: string | undefined;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "className">;

function Field({ label, name, error, required, className, ...rest }: FieldProps) {
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <label htmlFor={name} className="text-[0.86rem] font-semibold text-mp-ink">
        {label}
        {required && <span className="text-mp-red"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cx(inputBase, error ? "border-mp-red" : "border-mp-line")}
        {...rest}
      />
      {error && (
        <span id={`${name}-error`} className="text-[0.8rem] font-medium text-mp-red">
          {error}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function ContactPage() {
  return (
    <div className="contact overflow-x-clip">
      <ContactHero />
      <ContactMain />
      <RouteFinder />
    </div>
  );
}

/* =================================================================== */
/* 1. HERO — patch panel of contact channels                            */
/* =================================================================== */

const channels = [
  {
    key: "tel",
    label: "Téléphone",
    value: site.phones.join(" · "),
    hint: "Ligne directe",
    href: telHref(mainPhone),
    icon: <Phone size={20} />,
    external: false,
  },
  {
    key: "wa",
    label: "WhatsApp",
    value: site.whatsappDisplay,
    hint: "Le plus rapide",
    href: `https://wa.me/${site.whatsappDigits}?text=${encodeURIComponent("Bonjour MERPORT, je souhaite un renseignement.")}`,
    icon: (
      <span className="inline-flex size-5 [&_svg]:size-full">
        <WhatsAppIcon />
      </span>
    ),
    external: true,
  },
  {
    key: "mail",
    label: "E-mail",
    value: site.email,
    hint: "Pour vos documents",
    href: `mailto:${site.email}`,
    icon: <Mail size={20} />,
    external: false,
  },
  {
    key: "visit",
    label: "Sur place",
    value: "Aïn Sebaâ, Casablanca",
    hint: "Itinéraire",
    href: mapsUrl,
    icon: <MapPin size={20} />,
    external: true,
  },
];

function ContactHero() {
  return (
    <section className="relative isolate overflow-hidden bg-mp-navy bg-blueprint-dark text-white">
      <div className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[640px] rounded-full bg-[radial-gradient(circle,rgba(215,31,43,0.22),transparent_65%)]" />

      <div className="container pb-16 pt-10 lg:pb-20 lg:pt-14">
        <nav aria-label="Fil d’Ariane" className="mb-10 animate-fade-up">
          <ol className="m-0 flex list-none items-center gap-1.5 p-0 text-[0.84rem] text-white/60">
            <li>
              <Link to="/" className="transition-colors hover:text-white">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} />
            </li>
            <li aria-current="page" className="text-white">
              Contact
            </li>
          </ol>
        </nav>

        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Label light className="animate-fade-up [animation-delay:80ms]">
              Contact
            </Label>
            <h1 className="m-0 text-[clamp(2.6rem,6vw,5.6rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-white">
              <span className="block animate-fade-up [animation-delay:160ms]">Parlons de</span>
              <span className="block text-[#ff4d55] animate-fade-up [animation-delay:260ms]">votre projet.</span>
            </h1>
          </div>
          <p className="m-0 max-w-[46ch] text-[1.06rem] leading-relaxed text-white/75 animate-fade-up [animation-delay:360ms]">
            Une question technique, une disponibilité, un projet export ? Choisissez votre ligne, on décroche. Pour un
            chiffrage, passez directement par la{" "}
            <Link to="/devis" className="text-white underline decoration-mp-red decoration-2 underline-offset-4">
              demande de devis
            </Link>
            .
          </p>
        </div>

        {/* Patch panel */}
        <div className="mt-12 rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,#1a2240,#0d1430)] p-3 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] animate-fade-up [animation-delay:440ms] sm:p-4">
          <div className="mb-3 flex items-center justify-between px-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-white/45">
            <span>Panneau de connexion · MERPORT</span>
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.25)]" /> {channels.length} lignes actives
            </span>
          </div>
          <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c, i) => (
              <li key={c.key}>
                <a
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noreferrer" : undefined}
                  className="group relative flex h-full flex-col rounded-[18px] border border-white/10 bg-[#0a1026] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-mp-red/60"
                >
                  <span className="flex items-center justify-between">
                    <span className="font-mono text-[0.68rem] text-white/40">L{pad(i + 1)}</span>
                    {/* socket + LED */}
                    <span className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-white/20 transition group-hover:bg-mp-red group-hover:shadow-[0_0_8px_2px_rgba(215,31,43,0.7)]" />
                      <span className="grid h-7 w-10 place-items-center rounded-md bg-black/50 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)]">
                        <span className="flex gap-1">
                          <i className="h-2.5 w-1 rounded-sm bg-white/25 transition group-hover:bg-[#efa06c]" />
                          <i className="h-2.5 w-1 rounded-sm bg-white/25 transition group-hover:bg-[#efa06c]" />
                        </span>
                      </span>
                    </span>
                  </span>
                  <span className="mt-3 grid size-11 place-items-center rounded-xl bg-white/5 sm:mt-6 text-[#ff6b72] transition group-hover:bg-mp-red group-hover:text-white">
                    {c.icon}
                  </span>
                  <span className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white/50">{c.label}</span>
                  <span className="mt-1 break-words text-[1.02rem] font-semibold text-white">{c.value}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[0.84rem] sm:pt-4 font-semibold text-[#ff8a8f] transition-all group-hover:gap-2.5">
                    {c.hint} <ArrowUpRight size={14} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 2. MAIN — work-order form + location                                 */
/* =================================================================== */

function ContactMain() {
  const [form, setForm] = useState<ContactForm>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sent, setSent] = useState(false);

  const update = (key: keyof ContactForm) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError("");
    const result = contactSubmissionSchema.safeParse(form);
    if (!result.success) {
      const found = fieldErrors(result.error);
      setErrors(found);
      const first = Object.keys(found)[0];
      if (first) document.getElementById(first)?.focus();
      return;
    }
    setSubmitting(true);
    // MVP: always show the success message. The request is still sent in the background;
    // if it fails, it is only logged. TODO: restore error handling once the backend is final.
    try {
      await submitContactRequest({ data: form });
    } catch (error) {
      console.warn("[contact] submission failed (success shown anyway for the MVP)", error);
    } finally {
      setSubmitting(false);
      setSent(true);
      setForm(initial);
      window.scrollTo({ top: (document.getElementById("contact-form")?.getBoundingClientRect().top ?? 0) + window.scrollY - 120, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-mp-paper bg-blueprint py-16 md:py-24">
      <div className="container grid items-start gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10">
        {/* Work order */}
        <div id="contact-form" className="relative overflow-hidden rounded-[26px] border border-mp-line bg-white shadow-[0_40px_80px_-50px_rgba(11,24,56,0.55)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-dashed border-mp-line px-6 py-5 sm:px-9">
            <div>
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-mp-muted">Bon de demande</span>
              <h2 className="m-0 mt-1 text-[1.7rem] font-extrabold tracking-[-0.02em] text-mp-ink">Écrivez-nous</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-mp-paper px-3.5 py-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-mp-ink">
              <Clock size={13} className="text-mp-red" /> Réponse sous 24 h ouvrées
            </span>
          </div>

          {sent ? (
            <div role="status" className="flex flex-col items-center px-6 py-16 text-center sm:px-9">
              <span className="grid size-16 place-items-center rounded-full bg-green-500/10 text-green-600">
                <CheckCircle2 size={36} />
              </span>
              <h3 className="m-0 mt-6 text-[1.8rem] font-extrabold tracking-[-0.02em] text-mp-ink">Message envoyé, merci.</h3>
              <p className="m-0 mt-3 max-w-[44ch] text-mp-muted">
                Nous vous répondons dans les meilleurs délais, en général le jour ouvré suivant.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="inline-flex h-12 cursor-pointer items-center rounded-full border-[1.5px] border-mp-ink px-6 font-semibold text-mp-ink transition hover:bg-mp-ink hover:text-white"
                >
                  Envoyer un autre message
                </button>
                <Link
                  to="/produits"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-mp-red px-6 font-semibold text-white transition hover:bg-mp-red-dark"
                >
                  Voir le catalogue <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="px-6 py-7 sm:px-9 sm:py-9">
              {/* Honeypot */}
              <div aria-hidden="true" className="absolute -left-[10000px] size-px overflow-hidden">
                <label htmlFor="website">Ne pas remplir</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website")(e.target.value)} />
              </div>

              {/* Subject as selector chips */}
              <fieldset className="m-0 border-0 p-0">
                <legend className="mb-3 p-0 text-[0.86rem] font-semibold text-mp-ink">
                  Objet de votre demande<span className="text-mp-red"> *</span>
                </legend>
                <div className="flex flex-wrap gap-2" role="radiogroup">
                  {SUBJECTS.map((s, i) => {
                    const on = form.subject === s;
                    return (
                      <label
                        key={s}
                        className={cx(
                          "inline-flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] py-2 pl-2 pr-4 text-[0.88rem] font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-mp-red",
                          on ? "border-mp-ink bg-mp-ink text-white" : "border-mp-line bg-white text-mp-ink hover:border-mp-ink/50",
                        )}
                      >
                        <input
                          type="radio"
                          name="subject"
                          value={s}
                          checked={on}
                          onChange={() => update("subject")(s)}
                          className="sr-only"
                          id={i === 0 ? "subject" : undefined}
                        />
                        <span className={cx("grid size-6 place-items-center rounded-full font-mono text-[0.64rem]", on ? "bg-mp-red text-white" : "bg-mp-paper text-mp-muted")}>
                          {pad(i + 1)}
                        </span>
                        {s}
                      </label>
                    );
                  })}
                </div>
                {errors["subject"] && <span className="mt-2 block text-[0.8rem] font-medium text-mp-red">{errors["subject"]}</span>}
              </fieldset>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <Field label="Société" name="companyName" required autoComplete="organization" value={form.companyName} onChange={(e) => update("companyName")(e.target.value)} error={errors["companyName"]} />
                <Field label="ICE (facultatif)" name="ice" inputMode="numeric" maxLength={20} value={form.ice} onChange={(e) => update("ice")(e.target.value)} error={errors["ice"]} />
                <Field label="Nom et prénom" name="contactName" required autoComplete="name" value={form.contactName} onChange={(e) => update("contactName")(e.target.value)} error={errors["contactName"]} />
                <Field label="Téléphone" name="phone" type="tel" required autoComplete="tel" value={form.phone} onChange={(e) => update("phone")(e.target.value)} error={errors["phone"]} />
                <Field label="E-mail" name="email" type="email" required autoComplete="email" value={form.email} onChange={(e) => update("email")(e.target.value)} error={errors["email"]} className="sm:col-span-2" />

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="message" className="text-[0.86rem] font-semibold text-mp-ink">
                      Message<span className="text-mp-red"> *</span>
                    </label>
                    <span className="font-mono text-[0.7rem] text-mp-muted">{form.message.length} / 4000</span>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    maxLength={4000}
                    value={form.message}
                    onChange={(e) => update("message")(e.target.value)}
                    placeholder="Références, quantités, chantier, délai souhaité…"
                    aria-invalid={!!errors["message"] || undefined}
                    className={cx(inputBase, "min-h-[150px] resize-y", errors["message"] ? "border-mp-red" : "border-mp-line")}
                  />
                  {errors["message"] && <span className="text-[0.8rem] font-medium text-mp-red">{errors["message"]}</span>}
                </div>
              </div>

              {submitError && (
                <p role="alert" className="m-0 mt-5 rounded-xl border border-[#f5c2c4] bg-[#fdecec] px-4 py-3 text-[0.9rem] font-medium text-[#9b1219]">
                  {submitError}
                </p>
              )}

              <div className="mt-8 flex flex-col-reverse gap-4 border-t border-mp-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="m-0 max-w-[40ch] text-[0.8rem] text-mp-muted">
                  Vos données servent uniquement à répondre à votre demande.{" "}
                  <Link to="/confidentialite" className="text-mp-ink underline underline-offset-2">
                    Politique de confidentialité
                  </Link>
                  .
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-full bg-mp-red px-7 font-semibold text-white shadow-[0_8px_20px_-10px_rgba(215,31,43,0.8)] transition hover:-translate-y-px hover:bg-mp-red-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Envoi…
                    </>
                  ) : (
                    <>
                      Envoyer le message <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Location */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-h,72px)+24px)]">
          <div className="overflow-hidden rounded-[26px] border border-mp-line bg-white">
            <div className="relative aspect-[4/3] bg-mp-paper">
              <iframe
                title="Plan d’accès MERPORT, Aïn Sebaâ, Casablanca"
                src={`https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`}
                width="600"
                height="450"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 size-full border-0 grayscale-[0.4]"
              />
              <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-mp-ink px-3.5 py-2 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-white shadow-lg">
                <span className="size-2 rounded-full bg-mp-red animate-ping-soft" /> Siège & entrepôt
              </span>
            </div>
            <div className="p-6">
              <p className="m-0 flex gap-3 font-semibold leading-snug text-mp-ink">
                <MapPin size={18} className="mt-0.5 shrink-0 text-mp-red" aria-hidden="true" />
                {site.address}
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-mp-ink font-semibold text-white transition hover:bg-black"
              >
                <Navigation size={15} /> Itinéraire
              </a>
            </div>
          </div>

          <div className="rounded-[26px] bg-mp-navy p-6 text-white">
            <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white/55">
              <Clock size={13} className="text-[#ff6b72]" /> Horaires
            </span>
            <p className="m-0 mt-3 text-[1.02rem] font-semibold leading-snug">{site.hours}</p>
            <div className="mt-5 grid gap-2 border-t border-white/10 pt-5">
              {site.phones.map((phone) => (
                <a key={phone} href={telHref(phone)} className="inline-flex items-center gap-2.5 font-mono text-[0.95rem] text-white/85 transition hover:text-white">
                  <Phone size={14} className="text-[#ff6b72]" /> {phone}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* =================================================================== */
/* 3. ROUTE FINDER — the right channel for each need                    */
/* =================================================================== */

const routes = [
  {
    need: "Un prix, une liste de matériel",
    icon: FileText,
    answer: "Demande de devis",
    detail: "Joignez votre bordereau ou collez vos références : chiffrage sous 24 h ouvrées.",
    to: "/devis" as const,
    cta: "Demander un devis",
  },
  {
    need: "Trouver une référence",
    icon: Search,
    answer: "Catalogue",
    detail: "8 familles, des câbles à l’outillage. Ajoutez au devis en un clic.",
    to: "/produits" as const,
    cta: "Explorer le catalogue",
  },
  {
    need: "Une réponse rapide",
    icon: MessageSquareText,
    answer: "WhatsApp",
    detail: "Envoyez une photo de plaque, une référence ou une question : on répond vite.",
    href: `https://wa.me/${site.whatsappDigits}`,
    cta: "Écrire sur WhatsApp",
  },
];

function RouteFinder() {
  const [active, setActive] = useState(0);
  return (
    <section className="bg-white py-20 md:py-[110px]">
      <div className="container">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Label>Aiguillage</Label>
            <h2 className="m-0 max-w-[18ch] text-[clamp(2rem,4.2vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-mp-ink">
              Le bon canal, <span className="text-mp-red">pour chaque besoin.</span>
            </h2>
          </div>
          <p className="m-0 max-w-[34ch] text-mp-muted">Choisissez ce dont vous avez besoin, on vous oriente vers la ligne la plus directe.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Needs (left) */}
          <div className="relative grid gap-3">
            {routes.map((r, i) => {
              const on = i === active;
              const Icon = r.icon;
              return (
                <button
                  key={r.need}
                  type="button"
                  aria-pressed={on}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={cx(
                    "relative flex cursor-pointer items-center gap-4 rounded-2xl border-[1.5px] p-5 text-left transition duration-300",
                    on ? "border-mp-ink bg-mp-ink text-white" : "border-mp-line bg-white text-mp-ink hover:border-mp-ink/40",
                  )}
                >
                  <span className={cx("grid size-11 shrink-0 place-items-center rounded-xl", on ? "bg-mp-red text-white" : "bg-mp-paper text-mp-muted")}>
                    <Icon size={20} />
                  </span>
                  <span className="text-[1.08rem] font-bold">{r.need}</span>
                  {/* wire stub to the right */}
                  <span
                    aria-hidden="true"
                    className={cx("absolute -right-6 top-1/2 hidden h-[3px] w-6 -translate-y-1/2 lg:block", on ? "current-x animate-flow-x" : "bg-mp-line")}
                  />
                </button>
              );
            })}
          </div>

          {/* Answer (right) */}
          {routes.map((r, i) =>
            i === active ? (
              <div
                key={r.answer}
                className="relative flex flex-col justify-between overflow-hidden rounded-[26px] bg-mp-navy bg-blueprint-dark p-7 text-white sm:p-9"
              >
                <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(215,31,43,0.3),transparent_65%)]" />
                <div className="relative">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[#ff8a8f]">Ligne recommandée</span>
                  <p className="m-0 mt-3 text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold leading-none tracking-[-0.04em] animate-fade-up">{r.answer}</p>
                  <p className="m-0 mt-4 max-w-[44ch] text-[1.02rem] leading-relaxed text-white/75 animate-fade-up [animation-delay:80ms]">{r.detail}</p>
                </div>
                <div className="relative mt-10">
                  {"to" in r && r.to ? (
                    <Link to={r.to} className="inline-flex h-[52px] items-center gap-2 rounded-full bg-mp-red px-7 font-semibold transition hover:gap-3 hover:bg-mp-red-dark">
                      {r.cta} <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <a
                      href={r.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-[52px] items-center gap-2 rounded-full bg-[#25d366] px-7 font-semibold text-white transition hover:gap-3"
                    >
                      <span className="inline-flex size-4 [&_svg]:size-full">
                        <WhatsAppIcon />
                      </span>
                      {r.cta}
                    </a>
                  )}
                </div>
              </div>
            ) : null,
          )}
        </div>
      </div>
    </section>
  );
}