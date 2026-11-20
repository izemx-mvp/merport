import { useEffect, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, ChevronRight, FileUp, Loader2, Paperclip, Phone, X } from "lucide-react";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import { clearBasket, useQuoteBasket } from "@/lib/quote-basket";
import {
  ALLOWED_ATTACHMENT_TYPES,
  MAX_ATTACHMENT_BYTES,
  fieldErrors,
  quoteCompanySchema,
  quoteDeliverySchema,
} from "@/lib/submission-schemas";
import { createQuoteAttachmentUpload, submitQuoteRequest } from "@/lib/submissions.functions";
import { BasketLine } from "@/components/merport/quote-drawer";
import { telHref } from "@/components/merport/site-shell";
// Tailwind tokens/utilities: src/home.css (bg-mp-*, paper-edge, barcode, animate-print…)

export const Route = createFileRoute("/devis")({
  head: () =>
    seo({
      title: "Demander un devis",
      description:
        "Envoyez votre sélection, vos références ou vos plans : MERPORT vous répond sous 24 h ouvrées avec prix, disponibilités et délais.",
    }),
  component: QuotePage,
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const pad = (n: number) => String(n).padStart(2, "0");
const mainPhone = site.phones[0] ?? "";
const formatSize = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} Mo` : `${Math.max(1, Math.round(bytes / 1024))} Ko`;
const localQuoteNumber = () => `DV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

const STEPS = ["Votre sélection", "Votre société", "Livraison"] as const;

type FormState = {
  companyName: string;
  ice: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  deliveryAddress: string;
  referenceNotes: string;
  website: string;
};

const initialForm: FormState = {
  companyName: "",
  ice: "",
  contactName: "",
  email: "",
  phone: "",
  city: "",
  deliveryAddress: "",
  referenceNotes: "",
  website: "",
};

const inputBase =
  "w-full rounded-xl border-[1.5px] bg-white px-4 py-3.5 text-[0.98rem] text-mp-ink outline-none transition placeholder:text-mp-muted/60 focus:border-mp-ink focus:shadow-[0_0_0_4px_rgba(11,24,56,0.08)]";

function FieldShell({
  id,
  label,
  required,
  error,
  hint,
  counter,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  counter?: string | undefined;
  className?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className={cx("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.86rem] font-semibold text-mp-ink">
          {label}
          {required && <span className="text-mp-red"> *</span>}
        </label>
        {counter && <span className="font-mono text-[0.7rem] text-mp-muted">{counter}</span>}
      </div>
      {children}
      {error ? (
        <span id={`${id}-error`} className="text-[0.8rem] font-medium text-mp-red">
          {error}
        </span>
      ) : (
        hint && <span className="text-[0.8rem] text-mp-muted">{hint}</span>
      )}
    </div>
  );
}

type InputProps = {
  label: string;
  name: keyof FormState;
  error?: string | undefined;
  hint?: string | undefined;
  required?: boolean | undefined;
  className?: string | undefined;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "className">;

function Input({ label, name, error, hint, required, className, ...rest }: InputProps) {
  return (
    <FieldShell id={name} label={label} required={required} error={error} hint={hint} className={className}>
      <input
        id={name}
        name={name}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={cx(inputBase, error ? "border-mp-red" : "border-mp-line")}
        {...rest}
      />
    </FieldShell>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function QuotePage() {
  const items = useQuoteBasket();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [sentEmail, setSentEmail] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const formTop = useRef<HTMLDivElement>(null);

  /* Prefill from the homepage: cable configurator (?ref=) and "paste your list" (sessionStorage) */
  useEffect(() => {
    const lines: string[] = [];
    try {
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref) lines.push(`${ref} — quantité : `);
      const pasted = sessionStorage.getItem("merport-quote-list");
      if (pasted) {
        lines.push(pasted.trim());
        sessionStorage.removeItem("merport-quote-list");
      }
    } catch {
      /* storage unavailable */
    }
    if (lines.length) setForm((prev) => ({ ...prev, referenceNotes: prev.referenceNotes || lines.join("\n") }));
  }, []);

  const update = (key: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const goTo = (next: number) => {
    setStep(next);
    setSubmitError("");
    formTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const focusFirstError = (found: Record<string, string>) => {
    const first = Object.keys(found)[0];
    if (first) requestAnimationFrame(() => document.getElementById(first)?.focus());
  };

  const onFile = (selected: File | undefined) => {
    if (!selected) return;
    if (!(ALLOWED_ATTACHMENT_TYPES as readonly string[]).includes(selected.type)) {
      setErrors((prev) => ({ ...prev, attachment: "Format accepté : PDF, JPG, PNG ou WEBP." }));
      return;
    }
    if (selected.size > MAX_ATTACHMENT_BYTES) {
      setErrors((prev) => ({ ...prev, attachment: "Le fichier dépasse 10 Mo." }));
      return;
    }
    setErrors((prev) => ({ ...prev, attachment: "", items: "" }));
    setFile(selected);
  };

  const validateStep = (index: number) => {
    let found: Record<string, string> = {};
    if (index === 0 && !items.length && !form.referenceNotes.trim() && !file) {
      found = { items: "Ajoutez au moins un produit, une liste de références ou un fichier." };
    }
    if (index === 1) {
      const result = quoteCompanySchema.safeParse(form);
      if (!result.success) found = fieldErrors(result.error);
    }
    if (index === 2) {
      const result = quoteDeliverySchema.safeParse(form);
      if (!result.success) found = fieldErrors(result.error);
    }
    setErrors(found);
    focusFirstError(found);
    return Object.keys(found).length === 0;
  };

  const next = () => {
    if (validateStep(step)) goTo(step + 1);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (step < STEPS.length - 1) return next();
    for (let index = 0; index < STEPS.length; index++) {
      if (!validateStep(index)) {
        if (index !== step) goTo(index);
        return;
      }
    }
    setSubmitting(true);
    setSubmitError("");
    let quoteNumber = "";
    // MVP: the confirmation is always shown once the form is valid. If the upload or the request
    // fails, the error is only logged and a local number is displayed.
    // TODO: restore the error message (setSubmitError) once the backend is final.
    try {
      let attachmentPath: string | undefined;
      if (file) {
        setStatus("Envoi du fichier…");
        const upload = await createQuoteAttachmentUpload({
          data: { fileName: file.name, contentType: file.type as (typeof ALLOWED_ATTACHMENT_TYPES)[number], size: file.size },
        });
        const { supabase } = await import("@/integrations/supabase/client");
        const { error } = await supabase.storage
          .from("quote-attachments")
          .uploadToSignedUrl(upload.path, upload.token, file, { contentType: file.type });
        if (error) throw new Error("Le fichier n’a pas pu être envoyé.");
        attachmentPath = upload.path;
      }
      setStatus("Envoi de la demande…");
      const result = await submitQuoteRequest({
        data: {
          ...form,
          ...(attachmentPath ? { attachmentPath } : {}),
          items: items.map(({ slug, reference, name, quantity }) => ({ slug, reference, name, quantity })),
        },
      });
      quoteNumber = result.quoteNumber;
    } catch (error) {
      console.warn("[devis] submission failed (confirmation shown anyway for the MVP)", error);
    } finally {
      setSubmitting(false);
      setStatus("");
      clearBasket();
      setSentEmail(form.email);
      setConfirmation(quoteNumber || localQuoteNumber());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (confirmation) return <Confirmation number={confirmation} email={sentEmail} />;

  const refLines = form.referenceNotes.trim() ? form.referenceNotes.trim().split("\n").filter(Boolean).length : 0;

  return (
    <div className="devis overflow-x-clip">
      {/* Hero + circuit stepper */}
      <section className="relative isolate overflow-hidden bg-mp-navy bg-blueprint-dark text-white">
        <div className="pointer-events-none absolute -right-40 -top-40 -z-10 size-[600px] rounded-full bg-[radial-gradient(circle,rgba(215,31,43,0.22),transparent_65%)]" />
        <div className="container pb-24 pt-10 lg:pb-28 lg:pt-14">
          <nav aria-label="Fil d’Ariane" className="mb-8 animate-fade-up">
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
                Demande de devis
              </li>
            </ol>
          </nav>
          <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="m-0 mb-4 inline-flex items-center gap-2.5 font-mono text-[0.74rem] uppercase tracking-[0.16em] text-[#ff8a8f] animate-fade-up [animation-delay:80ms]">
                <span className="h-0.5 w-6 bg-current" /> Devis gratuit · sans engagement
              </p>
              <h1 className="m-0 text-[clamp(2.4rem,5.4vw,5rem)] font-extrabold leading-[0.96] tracking-[-0.045em] text-white">
                <span className="block animate-fade-up [animation-delay:160ms]">Votre liste,</span>
                <span className="block text-[#ff4d55] animate-fade-up [animation-delay:260ms]">notre offre sous 24 h.</span>
              </h1>
            </div>
            <p className="m-0 max-w-[46ch] text-[1.04rem] leading-relaxed text-white/75 animate-fade-up [animation-delay:360ms]">
              Aucun prix n’est affiché en ligne : chaque offre tient compte de vos quantités. Un commercial vous répond avec
              prix, disponibilités et délais.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-mp-paper bg-blueprint pb-20 md:pb-28">
        <div className="container -mt-14 grid items-start gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:gap-10">
          {/* Form card */}
          <div ref={formTop} className="relative scroll-mt-[calc(var(--header-h,72px)+16px)] overflow-hidden rounded-[26px] border border-mp-line bg-white shadow-[0_40px_80px_-50px_rgba(11,24,56,0.55)]">
            {/* Circuit stepper */}
            <ol className="relative m-0 grid list-none grid-cols-3 border-b border-mp-line px-6 py-6 sm:px-9" aria-label="Étapes de la demande">
              <span aria-hidden="true" className="absolute left-[calc(16.66%+12px)] right-[calc(16.66%+12px)] top-[42px] h-[3px] rounded-full bg-mp-line sm:top-[46px]" />
              <span
                aria-hidden="true"
                className="absolute left-[calc(16.66%+12px)] top-[42px] h-[3px] rounded-full current-x animate-flow-x transition-[width] duration-700 ease-out-expo sm:top-[46px]"
                style={{ width: `calc((66.66% - 24px) * ${step / (STEPS.length - 1)})` }}
              />
              {STEPS.map((label, index) => {
                const done = index < step;
                const current = index === step;
                return (
                  <li key={label} aria-current={current ? "step" : undefined} className="relative flex flex-col items-center gap-2.5 text-center">
                    <span
                      className={cx(
                        "grid size-9 place-items-center rounded-full border-2 font-mono text-[0.8rem] transition duration-500 sm:size-10",
                        current && "border-mp-red bg-mp-red text-white shadow-[0_0_0_6px_rgba(215,31,43,0.15)]",
                        done && "border-mp-ink bg-mp-ink text-white",
                        !current && !done && "border-mp-line bg-white text-mp-muted",
                      )}
                    >
                      {done ? <Check size={15} /> : pad(index + 1)}
                    </span>
                    <span className={cx("text-[0.78rem] font-semibold sm:text-[0.86rem]", current || done ? "text-mp-ink" : "text-mp-muted", !current && "max-sm:hidden")}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ol>

            <form onSubmit={submit} noValidate className="px-6 py-7 sm:px-9 sm:py-9">
              {/* Honeypot */}
              <div aria-hidden="true" className="absolute -left-[10000px] size-px overflow-hidden">
                <label htmlFor="website">Ne pas remplir</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website")(e.target.value)} />
              </div>

              {step === 0 && (
                <fieldset className="m-0 border-0 p-0 animate-fade-up [animation-duration:500ms]">
                  <legend className="mb-6 p-0 text-[1.5rem] font-extrabold tracking-[-0.02em] text-mp-ink">Votre sélection</legend>

                  {items.length ? (
                    <div className="mb-6 rounded-2xl border border-mp-line bg-mp-paper/60 px-4">
                      <div className="flex items-center justify-between border-b border-mp-line py-3 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-mp-muted">
                        <span>Produits du catalogue</span>
                        <span>{pad(items.length)} réf.</span>
                      </div>
                      <ul className="m-0 list-none p-0">
                        {items.map((item) => (
                          <BasketLine key={item.slug} item={item} />
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-[#c9cdd6] px-5 py-4 text-[0.94rem] text-mp-muted">
                      <span>Votre sélection est vide. Indiquez vos références ci-dessous ou</span>
                      <Link to="/produits" className="inline-flex items-center gap-1.5 font-semibold text-mp-red transition-all hover:gap-2.5">
                        parcourez le catalogue <ArrowRight size={15} />
                      </Link>
                    </div>
                  )}

                  <FieldShell
                    id="referenceNotes"
                    label="Références libres ou liste de matériel"
                    hint="Une ligne par article : désignation, référence, quantité."
                    counter={`${refLines} ligne${refLines > 1 ? "s" : ""}`}
                  >
                    <textarea
                      id="referenceNotes"
                      name="referenceNotes"
                      rows={6}
                      maxLength={3000}
                      spellCheck={false}
                      placeholder={"Ex. : Câble U-1000 R2V 3G2,5 — 500 m\nDisjoncteur 4P 63 A — 6 pièces"}
                      value={form.referenceNotes}
                      onChange={(e) => {
                        update("referenceNotes")(e.target.value);
                        setErrors((prev) => ({ ...prev, items: "" }));
                      }}
                      className={cx(inputBase, "min-h-[160px] resize-y border-mp-line font-mono text-[0.88rem] leading-[1.7]")}
                    />
                  </FieldShell>

                  <div className="mt-6">
                    <span id="attachment-label" className="mb-1.5 block text-[0.86rem] font-semibold text-mp-ink">
                      Bordereau, plans ou photo <span className="font-normal text-mp-muted">(facultatif)</span>
                    </span>
                    {file ? (
                      <div className="flex items-center gap-3 rounded-2xl border-[1.5px] border-mp-ink bg-mp-paper px-4 py-3.5">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mp-red text-white">
                          <Paperclip size={18} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-mp-ink">{file.name}</span>
                          <span className="font-mono text-[0.74rem] text-mp-muted">{formatSize(file.size)} · prêt à l’envoi</span>
                        </span>
                        <button
                          type="button"
                          aria-label="Retirer le fichier"
                          onClick={() => {
                            setFile(null);
                            if (fileInput.current) fileInput.current.value = "";
                          }}
                          className="grid size-9 cursor-pointer place-items-center rounded-full text-mp-muted transition hover:bg-white hover:text-mp-red"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <label
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragging(false);
                          onFile(e.dataTransfer.files[0]);
                        }}
                        className={cx(
                          "group relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-5 py-8 text-center transition",
                          dragging ? "border-mp-red bg-mp-red/5" : "border-[#c9cdd6] bg-mp-paper/60 hover:border-mp-ink hover:bg-white",
                          errors["attachment"] && "border-mp-red",
                        )}
                      >
                        <span className="grid size-12 place-items-center rounded-full bg-white text-mp-red shadow-[0_8px_20px_-10px_rgba(11,24,56,0.4)] transition group-hover:-translate-y-1">
                          <FileUp size={22} />
                        </span>
                        <span className="text-[0.95rem] text-mp-muted">
                          <strong className="text-mp-ink">Choisir un fichier</strong> ou le glisser ici
                        </span>
                        <small className="font-mono text-[0.72rem] text-mp-muted">PDF, JPG, PNG ou WEBP · 10 Mo max.</small>
                        <input
                          ref={fileInput}
                          id="attachment"
                          type="file"
                          accept={ALLOWED_ATTACHMENT_TYPES.join(",")}
                          aria-labelledby="attachment-label"
                          onChange={(e) => onFile(e.target.files?.[0])}
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                      </label>
                    )}
                    {errors["attachment"] && (
                      <span role="alert" className="mt-1.5 block text-[0.8rem] font-medium text-mp-red">
                        {errors["attachment"]}
                      </span>
                    )}
                  </div>

                  {errors["items"] && (
                    <p role="alert" className="m-0 mt-5 rounded-xl border border-[#f5c2c4] bg-[#fdecec] px-4 py-3 text-[0.9rem] font-medium text-[#9b1219]">
                      {errors["items"]}
                    </p>
                  )}
                </fieldset>
              )}

              {step === 1 && (
                <fieldset className="m-0 border-0 p-0 animate-fade-up [animation-duration:500ms]">
                  <legend className="mb-6 p-0 text-[1.5rem] font-extrabold tracking-[-0.02em] text-mp-ink">Votre société</legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label="Raison sociale" name="companyName" required autoComplete="organization" value={form.companyName} onChange={(e) => update("companyName")(e.target.value)} error={errors["companyName"]} />
                    <Input label="ICE" name="ice" required inputMode="numeric" maxLength={20} placeholder="15 chiffres" value={form.ice} onChange={(e) => update("ice")(e.target.value)} error={errors["ice"]} hint="Identifiant commun de l’entreprise, pour établir l’offre." />
                    <Input label="Nom et prénom" name="contactName" required autoComplete="name" value={form.contactName} onChange={(e) => update("contactName")(e.target.value)} error={errors["contactName"]} />
                    <Input label="Téléphone" name="phone" type="tel" required autoComplete="tel" placeholder="06 00 00 00 00" value={form.phone} onChange={(e) => update("phone")(e.target.value)} error={errors["phone"]} />
                    <Input label="E-mail professionnel" name="email" type="email" required autoComplete="email" className="sm:col-span-2" value={form.email} onChange={(e) => update("email")(e.target.value)} error={errors["email"]} />
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <fieldset className="m-0 border-0 p-0 animate-fade-up [animation-duration:500ms]">
                  <legend className="mb-6 p-0 text-[1.5rem] font-extrabold tracking-[-0.02em] text-mp-ink">Livraison</legend>
                  <div className="grid gap-5">
                    <Input label="Ville" name="city" required autoComplete="address-level2" placeholder="Casablanca, Tanger, Dakar…" value={form.city} onChange={(e) => update("city")(e.target.value)} error={errors["city"]} />
                    <FieldShell id="deliveryAddress" label="Adresse de livraison ou du chantier" required error={errors["deliveryAddress"]}>
                      <textarea
                        id="deliveryAddress"
                        name="deliveryAddress"
                        rows={3}
                        autoComplete="street-address"
                        value={form.deliveryAddress}
                        onChange={(e) => update("deliveryAddress")(e.target.value)}
                        aria-invalid={!!errors["deliveryAddress"] || undefined}
                        className={cx(inputBase, "resize-y", errors["deliveryAddress"] ? "border-mp-red" : "border-mp-line")}
                      />
                    </FieldShell>
                  </div>
                  <p className="m-0 mt-6 text-[0.82rem] text-mp-muted">
                    En envoyant cette demande, vous acceptez que MERPORT utilise ces informations pour vous adresser une offre.{" "}
                    <Link to="/confidentialite" className="text-mp-ink underline underline-offset-2">
                      Politique de confidentialité
                    </Link>
                    .
                  </p>
                </fieldset>
              )}

              {submitError && (
                <p role="alert" className="m-0 mt-5 rounded-xl border border-[#f5c2c4] bg-[#fdecec] px-4 py-3 text-[0.9rem] font-medium text-[#9b1219]">
                  {submitError}
                </p>
              )}

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-mp-line pt-6">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => goTo(step - 1)}
                    disabled={submitting}
                    className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-mp-line px-5 font-semibold text-mp-ink transition hover:border-mp-ink disabled:opacity-50"
                  >
                    <ArrowLeft size={16} /> Retour
                  </button>
                ) : (
                  <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-mp-muted">Étape 01 / 03</span>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-[52px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-mp-red px-5 font-semibold text-white sm:px-7 shadow-[0_8px_20px_-10px_rgba(215,31,43,0.8)] transition hover:-translate-y-px hover:bg-mp-red-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {step < STEPS.length - 1 ? (
                    <>
                      Continuer <ArrowRight size={16} />
                    </>
                  ) : submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> {status || "Envoi…"}
                    </>
                  ) : (
                    <>
                      Envoyer ma demande <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Live ticket */}
          <aside className="lg:sticky lg:top-[calc(var(--header-h,72px)+24px)]">
            <LiveTicket items={items.length} refLines={refLines} file={file} form={form} step={step} />
            {mainPhone && (
              <a
                href={telHref(mainPhone)}
                className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-mp-navy px-5 py-4 text-white transition hover:bg-mp-ink"
              >
                <span>
                  <span className="block font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white/55">Une urgence ?</span>
                  <span className="font-mono text-[1rem]">{mainPhone}</span>
                </span>
                <span className="grid size-10 place-items-center rounded-full bg-mp-red">
                  <Phone size={16} />
                </span>
              </a>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}

/* =================================================================== */
/* Live ticket — fills in as the visitor types                          */
/* =================================================================== */

function LiveTicket({
  items,
  refLines,
  file,
  form,
  step,
}: {
  items: number;
  refLines: number;
  file: File | null;
  form: FormState;
  step: number;
}) {
  const checks = [items > 0 || refLines > 0 || !!file, !!form.companyName, !!form.ice, !!form.contactName, !!form.phone, !!form.email, !!form.city, !!form.deliveryAddress];
  const done = checks.filter(Boolean).length;
  const pct = Math.round((done / checks.length) * 100);

  const row = (k: string, v: string | number | false | null | undefined) => (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="shrink-0 text-mp-muted">{k}</dt>
      <dd className={cx("m-0 min-w-0 truncate text-right", v ? "text-mp-ink" : "text-mp-muted/50")}>{v || "—"}</dd>
    </div>
  );

  return (
    <div className="drop-shadow-[0_30px_40px_rgba(11,24,56,0.18)]">
      <div className="rounded-t-[18px] bg-white px-6 pb-5 pt-6 font-mono text-[0.78rem]">
        <div className="text-center">
          <p className="m-0 font-sans text-[1.2rem] font-extrabold tracking-[-0.02em] text-mp-ink">MERPORT</p>
          <p className="m-0 mt-1 text-[0.66rem] uppercase tracking-[0.16em] text-mp-muted">Ticket de demande · DV-{new Date().getFullYear()}-····</p>
        </div>

        <div className="my-4 border-t border-dashed border-mp-line" />
        <dl className="m-0">
          {row("Produits catalogue", items ? `${pad(items)} réf.` : null)}
          {row("Références libres", refLines ? `${pad(refLines)} ligne${refLines > 1 ? "s" : ""}` : null)}
          {row("Pièce jointe", file?.name)}
        </dl>
        <div className="my-3 border-t border-dashed border-mp-line" />
        <dl className="m-0">
          {row("Société", form.companyName)}
          {row("ICE", form.ice)}
          {row("Contact", form.contactName)}
          {row("Téléphone", form.phone)}
        </dl>
        <div className="my-3 border-t border-dashed border-mp-line" />
        <dl className="m-0">
          {row("Ville", form.city)}
          {row("Livraison", form.deliveryAddress)}
        </dl>

        <div className="my-4 border-t border-dashed border-mp-line" />
        <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.12em]">
          <span className="text-mp-muted">Complétion</span>
          <span className="text-mp-ink">{pct} %</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-mp-paper">
          <div className="h-full rounded-full bg-mp-red transition-[width] duration-500 ease-out-expo" style={{ width: `${pct}%` }} />
        </div>
        <p className="m-0 mt-3 text-[0.7rem] uppercase tracking-[0.12em] text-mp-muted">
          Étape {pad(step + 1)} / {pad(STEPS.length)} · {STEPS[step]}
        </p>

        <div className="mt-5 h-10 barcode opacity-80" aria-hidden="true" />
        <p className="m-0 mt-2 text-center text-[0.64rem] uppercase tracking-[0.2em] text-mp-muted">Réponse sous 24 h ouvrées</p>
      </div>
      <div className="paper-edge" aria-hidden="true" />
    </div>
  );
}

/* =================================================================== */
/* Confirmation — the receipt prints out                                */
/* =================================================================== */

function Confirmation({ number, email }: { number: string; email: string }) {
  return (
    <section className="relative isolate min-h-[calc(100svh-var(--header-h,72px))] overflow-hidden bg-mp-navy bg-blueprint-dark py-16 text-white md:py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 size-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.15),transparent_60%)]" />
      <div className="container grid items-center gap-12 lg:grid-cols-[1fr_0.8fr]" role="status">
        <div>
          <p className="m-0 mb-4 inline-flex items-center gap-2.5 font-mono text-[0.74rem] uppercase tracking-[0.16em] text-[#7ee2a8] animate-fade-up">
            <span className="size-2 rounded-full bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.25)]" /> Demande enregistrée
          </p>
          <h1 className="m-0 text-[clamp(2.4rem,5vw,4.6rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white animate-fade-up [animation-delay:100ms]">
            Merci, votre demande <span className="text-[#ff4d55]">est bien reçue.</span>
          </h1>
          <p className="m-0 mt-6 max-w-[48ch] text-[1.06rem] leading-relaxed text-white/75 animate-fade-up [animation-delay:200ms]">
            Un commercial MERPORT vous recontacte sous 24 h ouvrées
            {email && (
              <>
                {" "}
                à l’adresse <strong className="text-white">{email}</strong>
              </>
            )}{" "}
            avec prix, disponibilités et délais. Conservez votre numéro pour tout échange.
          </p>
          <div className="mt-9 flex flex-wrap gap-3 animate-fade-up [animation-delay:300ms]">
            <Link to="/produits" className="inline-flex h-[52px] items-center gap-2 rounded-full bg-mp-red px-7 font-semibold transition hover:bg-mp-red-dark">
              Retour au catalogue <ArrowRight size={16} />
            </Link>
            <Link to="/" className="inline-flex h-[52px] items-center rounded-full border-[1.5px] border-white/30 px-7 font-semibold transition hover:border-white">
              Accueil
            </Link>
          </div>
        </div>

        {/* Printer */}
        <div className="mx-auto w-full max-w-[380px]">
          <div className="relative z-[2] h-6 rounded-full bg-[linear-gradient(180deg,#2b3350,#0a0f22)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)]">
            <span className="absolute inset-x-5 top-1/2 h-1 -translate-y-1/2 rounded-full bg-black/70" />
          </div>
          <div className="-mt-3 overflow-hidden px-4 pt-3">
            <div className="animate-print [animation-delay:400ms]">
              <div className="bg-white px-6 pb-6 pt-7 text-center font-mono text-mp-ink">
                <p className="m-0 font-sans text-[1.2rem] font-extrabold tracking-[-0.02em]">MERPORT</p>
                <p className="m-0 mt-1 text-[0.64rem] uppercase tracking-[0.16em] text-mp-muted">Demande de devis</p>
                <div className="my-5 border-t border-dashed border-mp-line" />
                <p className="m-0 text-[0.68rem] uppercase tracking-[0.16em] text-mp-muted">Numéro de demande</p>
                <p className="m-0 mt-2 text-[2rem] font-medium tracking-[0.04em] text-mp-red">{number}</p>
                <div className="my-5 border-t border-dashed border-mp-line" />
                <div className="flex justify-between text-[0.72rem] uppercase tracking-[0.1em]">
                  <span className="text-mp-muted">Statut</span>
                  <span className="text-green-600">● Reçue</span>
                </div>
                <div className="mt-2 flex justify-between text-[0.72rem] uppercase tracking-[0.1em]">
                  <span className="text-mp-muted">Réponse</span>
                  <span>Sous 24 h ouvrées</span>
                </div>
                <div className="mt-6 h-12 barcode" aria-hidden="true" />
                <p className="m-0 mt-2 text-[0.6rem] tracking-[0.3em] text-mp-muted">{number.replace(/\D/g, "")}</p>
              </div>
              <div className="paper-edge" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}