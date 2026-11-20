import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  ClipboardList,
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  PackageCheck,
  Phone,
  Receipt,
  RotateCcw,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { seo } from "@/lib/seo";
import { site } from "@/config/site";
import {
  demoClient,
  demoDocuments,
  demoOrders,
  demoQuotes,
  type DocType,
  type Line,
  type Order,
  type OrderStatus,
  type Quote,
  type QuoteStatus,
} from "@/data/portal-demo";
import { WhatsAppIcon, telHref } from "@/components/merport/site-shell";
// Espace Client — démo front-end (données fictives, aucune connexion réelle).
// Tailwind tokens/utilities: src/home.css

type View = "tableau" | "commandes" | "devis" | "documents" | "compte";
const VIEWS: View[] = ["tableau", "commandes", "devis", "documents", "compte"];

export const Route = createFileRoute("/espace-client")({
  validateSearch: (search: Record<string, unknown>): { vue?: View | undefined; id?: string | undefined } => ({
    vue: VIEWS.includes(search["vue"] as View) ? (search["vue"] as View) : undefined,
    id: typeof search["id"] === "string" ? search["id"].slice(0, 40) : undefined,
  }),
  head: () =>
    seo({
      title: "Espace client",
      description: "Espace client MERPORT : suivi de commandes, devis, factures et bons de livraison.",
      noindex: true,
    }),
  component: PortalPage,
});

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const SESSION_KEY = "merport-demo-session";
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const mad = (n: number) => `${n.toLocaleString("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`;
const date = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
const totalHT = (lines: Line[]) => lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
const unitLabel = (l: Line) => (l.unit === "m" ? "m" : l.unit === "touret" ? "touret(s)" : "u");

const ORDER_STEPS: { key: OrderStatus; label: string; icon: typeof Check }[] = [
  { key: "confirmee", label: "Confirmée", icon: ClipboardList },
  { key: "preparation", label: "En préparation", icon: Package },
  { key: "expediee", label: "Expédiée", icon: Truck },
  { key: "livree", label: "Livrée", icon: PackageCheck },
];

const ORDER_BADGE: Record<OrderStatus, { label: string; cls: string }> = {
  confirmee: { label: "Confirmée", cls: "bg-blue-50 text-blue-700 ring-blue-200" },
  preparation: { label: "En préparation", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  expediee: { label: "Expédiée", cls: "bg-violet-50 text-violet-700 ring-violet-200" },
  livree: { label: "Livrée", cls: "bg-green-50 text-green-700 ring-green-200" },
};

const QUOTE_BADGE: Record<QuoteStatus, { label: string; cls: string }> = {
  chiffrage: { label: "En cours de chiffrage", cls: "bg-slate-100 text-slate-700 ring-slate-200" },
  a_valider: { label: "À valider", cls: "bg-red-50 text-mp-red ring-red-200" },
  accepte: { label: "Accepté", cls: "bg-green-50 text-green-700 ring-green-200" },
  refuse: { label: "Refusé", cls: "bg-slate-100 text-slate-500 ring-slate-200" },
  expire: { label: "Expiré", cls: "bg-slate-100 text-slate-500 ring-slate-200" },
};

function Badge({ label, cls }: { label: string; cls: string }) {
  return <span className={cx("inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[0.74rem] font-semibold ring-1 ring-inset", cls)}>{label}</span>;
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("rounded-[22px] border border-mp-line bg-white", className)}>{children}</div>;
}

function CardHead({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-mp-line px-5 py-4">
      <h2 className="m-0 text-[1.05rem] font-bold text-mp-ink">{title}</h2>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

function PortalPage() {
  const [logged, setLogged] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      setLogged(sessionStorage.getItem(SESSION_KEY) === "1");
    } catch {
      setLogged(false);
    }
  }, []);

  const login = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setLogged(true);
    window.scrollTo({ top: 0 });
  };
  const logout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setLogged(false);
  };

  if (logged === null) return <div className="min-h-[70vh] bg-mp-paper" />;
  return logged ? <Portal onLogout={logout} /> : <Login onLogin={login} />;
}

/* =================================================================== */
/* LOGIN                                                                */
/* =================================================================== */

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    onLogin();
  };
  const benefits = ["Suivi de vos commandes et livraisons", "Devis à valider en un clic", "Factures et bons de livraison téléchargeables", "Un commercial dédié"];

  return (
    <section className="bg-mp-paper">
      <div className="grid min-h-[calc(100svh-var(--header-h,72px))] lg:grid-cols-2">
        {/* Left — brand panel */}
        <div className="relative isolate hidden overflow-hidden bg-mp-navy bg-blueprint-dark p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute -left-40 -top-40 -z-10 size-[600px] rounded-full bg-[radial-gradient(circle,rgba(215,31,43,0.25),transparent_65%)]" />
          <span className="font-mono text-[0.74rem] uppercase tracking-[0.16em] text-[#ff8a8f]">Espace client · professionnels</span>
          <div>
            <h1 className="m-0 max-w-[14ch] text-[clamp(2.4rem,4vw,3.8rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-white">
              Votre compte pro, <span className="text-[#ff4d55]">24 h/24.</span>
            </h1>
            <ul className="m-0 mt-10 grid list-none gap-4 p-0">
              {benefits.map((b, i) => (
                <li key={b} className="flex items-center gap-4 text-white/85 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-mp-red/20 text-[#ff6b72]">
                    <Check size={16} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <span className="text-[0.86rem] text-white/50">MERPORT SARL · Casablanca · depuis 1988</span>
        </div>

        {/* Right — form */}
        <div className="flex items-center justify-center px-5 py-14">
          <div className="w-full max-w-[420px]">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-mp-red lg:hidden">Espace client</span>
            <h2 className="m-0 mt-2 text-[2rem] font-extrabold tracking-[-0.03em] text-mp-ink">Connexion</h2>
            <p className="m-0 mt-2 text-mp-muted">Accédez à vos commandes, devis et documents.</p>

            <button
              type="button"
              onClick={onLogin}
              className="mt-8 flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-mp-red/50 bg-mp-red/5 px-5 py-4 text-left transition hover:border-mp-red hover:bg-mp-red/10"
            >
              <span>
                <strong className="block text-mp-ink">Accès démo</strong>
                <span className="text-[0.86rem] text-mp-muted">Découvrir l’espace avec un compte fictif</span>
              </span>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mp-red text-white">
                <ArrowRight size={18} />
              </span>
            </button>

            <div className="my-7 flex items-center gap-4 text-[0.8rem] text-mp-muted">
              <span className="h-px flex-1 bg-mp-line" /> ou <span className="h-px flex-1 bg-mp-line" />
            </div>

            <form onSubmit={submit} className="grid gap-4">
              <div className="grid gap-1.5">
                <label htmlFor="login-email" className="text-[0.86rem] font-semibold text-mp-ink">
                  E-mail professionnel
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@entreprise.ma"
                  className="w-full rounded-xl border-[1.5px] border-mp-line bg-white px-4 py-3.5 text-mp-ink outline-none transition focus:border-mp-ink"
                />
              </div>
              <div className="grid gap-1.5">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="login-password" className="text-[0.86rem] font-semibold text-mp-ink">
                    Mot de passe
                  </label>
                  <span className="text-[0.8rem] text-mp-muted">Mot de passe oublié ?</span>
                </div>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border-[1.5px] border-mp-line bg-white px-4 py-3.5 text-mp-ink outline-none transition focus:border-mp-ink"
                />
              </div>
              <button type="submit" className="mt-2 inline-flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-full bg-mp-ink font-semibold text-white transition hover:bg-black">
                Se connecter <ArrowRight size={16} />
              </button>
            </form>

            <p className="m-0 mt-6 text-center text-[0.88rem] text-mp-muted">
              Pas encore de compte pro ?{" "}
              <Link to="/contact" className="font-semibold text-mp-red underline underline-offset-2">
                Demander l’ouverture
              </Link>
            </p>
            <p className="m-0 mt-8 rounded-xl bg-white px-4 py-3 text-center font-mono text-[0.7rem] uppercase tracking-[0.12em] text-mp-muted">
              Version de démonstration · données fictives
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================================================================== */
/* PORTAL SHELL                                                         */
/* =================================================================== */

const NAV: { key: View; label: string; icon: typeof Check }[] = [
  { key: "tableau", label: "Tableau de bord", icon: LayoutDashboard },
  { key: "commandes", label: "Commandes", icon: Package },
  { key: "devis", label: "Devis", icon: FileText },
  { key: "documents", label: "Documents", icon: Receipt },
  { key: "compte", label: "Mon compte", icon: UserRound },
];

function Portal({ onLogout }: { onLogout: () => void }) {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const view: View = search.vue ?? "tableau";
  const [quotes, setQuotes] = useState<Quote[]>(demoQuotes);
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [toast, setToast] = useState("");

  const go = (vue: View, id?: string) => {
    navigate({ search: { vue, id }, replace: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2800);
  };

  const acceptQuote = (q: Quote) => {
    setQuotes((all) => all.map((x) => (x.id === q.id ? { ...x, status: "accepte" } : x)));
    const today = new Date().toISOString().slice(0, 10);
    const order: Order = {
      id: `CMD-2026-${String(430 + orders.length).padStart(4, "0")}`,
      date: today,
      clientRef: q.subject.toUpperCase().slice(0, 18).replace(/\s+/g, "-"),
      status: "confirmee",
      site: demoClient.addresses[0] ?? "",
      lines: q.lines,
      steps: [{ status: "confirmee", date: today }, { status: "preparation" }, { status: "expediee" }, { status: "livree" }],
      documents: [],
    };
    setOrders((all) => [order, ...all]);
    notify(`Devis ${q.id} accepté · commande ${order.id} créée`);
  };
  const refuseQuote = (q: Quote) => {
    setQuotes((all) => all.map((x) => (x.id === q.id ? { ...x, status: "refuse" } : x)));
    notify(`Devis ${q.id} refusé`);
  };

  const toValidate = quotes.filter((q) => q.status === "a_valider").length;

  return (
    <section className="min-h-[calc(100svh-var(--header-h,72px))] bg-mp-paper">
      {/* Top bar */}
      <div className="border-b border-mp-line bg-white">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-mp-ink text-[0.95rem] font-bold text-white">
              {demoClient.company.slice(0, 2).toUpperCase()}
            </span>
            <span>
              <strong className="block leading-tight text-mp-ink">{demoClient.company}</strong>
              <span className="text-[0.84rem] text-mp-muted">{demoClient.contact}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-amber-50 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-amber-700 ring-1 ring-inset ring-amber-200 sm:inline">
              Démo · données fictives
            </span>
            <button
              type="button"
              onClick={() => go("devis")}
              aria-label="Notifications"
              className="relative grid size-10 cursor-pointer place-items-center rounded-full border border-mp-line text-mp-ink transition hover:border-mp-ink"
            >
              <Bell size={17} />
              {toValidate > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-mp-red text-[0.66rem] font-bold text-white">{toValidate}</span>}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-mp-line px-4 text-[0.86rem] font-semibold text-mp-ink transition hover:border-mp-ink"
            >
              <LogOut size={15} /> <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container grid grid-cols-[minmax(0,1fr)] items-start gap-6 py-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-8 lg:py-8">
        {/* Nav */}
        <nav aria-label="Espace client" className="min-w-0 lg:sticky lg:top-[calc(var(--header-h,72px)+24px)]">
          <ul className="m-0 flex list-none gap-1.5 overflow-x-auto p-0 [scrollbar-width:none] lg:flex-col lg:rounded-[22px] lg:border lg:border-mp-line lg:bg-white lg:p-2">
            {NAV.map(({ key, label, icon: Icon }) => {
              const on = view === key;
              return (
                <li key={key} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => go(key)}
                    aria-current={on ? "page" : undefined}
                    className={cx(
                      "flex w-full cursor-pointer items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[0.9rem] font-semibold transition",
                      on ? "bg-mp-ink text-white" : "bg-white text-mp-ink hover:bg-mp-paper max-lg:border max-lg:border-mp-line",
                    )}
                  >
                    <Icon size={17} className={on ? "text-[#ff8a8f]" : "text-mp-muted"} />
                    {label}
                    {key === "devis" && toValidate > 0 && (
                      <span className={cx("ml-auto grid size-5 place-items-center rounded-full text-[0.66rem] font-bold", on ? "bg-mp-red text-white" : "bg-mp-red/10 text-mp-red")}>{toValidate}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          <RepCard className="mt-4 hidden lg:block" />
        </nav>

        {/* Content */}
        <div className="min-w-0" key={`${view}-${search.id ?? ""}`}>
          <div className="animate-fade-up [animation-duration:450ms]">
            {view === "tableau" && <Dashboard orders={orders} quotes={quotes} go={go} />}
            {view === "commandes" &&
              (search.id ? (
                <OrderDetail order={orders.find((o) => o.id === search.id)} go={go} notify={notify} />
              ) : (
                <OrdersList orders={orders} go={go} />
              ))}
            {view === "devis" &&
              (search.id ? (
                <QuoteDetail quote={quotes.find((q) => q.id === search.id)} go={go} onAccept={acceptQuote} onRefuse={refuseQuote} notify={notify} />
              ) : (
                <QuotesList quotes={quotes} go={go} />
              ))}
            {view === "documents" && <Documents notify={notify} />}
            {view === "compte" && <Account notify={notify} />}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div role="status" className="fixed inset-x-4 bottom-6 z-[70] mx-auto flex w-fit max-w-[520px] items-center gap-2.5 rounded-2xl bg-mp-ink px-5 py-3 text-[0.9rem] font-medium text-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] animate-fade-up [animation-duration:300ms]">
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-green-500">
            <Check size={12} />
          </span>
          {toast}
        </div>
      )}
    </section>
  );
}

function RepCard({ className }: { className?: string }) {
  return (
    <div className={cx("rounded-[22px] bg-mp-navy p-5 text-white", className)}>
      <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-white/50">Votre commercial</span>
      <p className="m-0 mt-2 text-[1.05rem] font-bold">{demoClient.rep.name}</p>
      <p className="m-0 text-[0.82rem] text-white/60">{demoClient.rep.role}</p>
      <div className="mt-4 grid gap-2">
        <a href={`https://wa.me/${site.whatsappDigits}`} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#25d366] text-[0.86rem] font-semibold">
          <span className="inline-flex size-4 [&_svg]:size-full">
            <WhatsAppIcon />
          </span>
          WhatsApp
        </a>
        <a href={telHref(site.phones[0] ?? "")} className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/25 text-[0.86rem] font-semibold">
          <Phone size={14} /> Appeler
        </a>
      </div>
    </div>
  );
}

/* =================================================================== */
/* DASHBOARD                                                            */
/* =================================================================== */

function Dashboard({ orders, quotes, go }: { orders: Order[]; quotes: Quote[]; go: (v: View, id?: string) => void }) {
  const inProgress = orders.filter((o) => o.status !== "livree");
  const toValidate = quotes.filter((q) => q.status === "a_valider");
  const delivered = orders.filter((o) => o.status === "livree").length;
  const invoiced = demoDocuments.filter((d) => d.type === "facture").reduce((s, d) => s + (d.amount ?? 0), 0);

  const kpis = [
    { label: "Commandes en cours", value: String(inProgress.length).padStart(2, "0"), icon: Package, to: "commandes" as View },
    { label: "Devis à valider", value: String(toValidate.length).padStart(2, "0"), icon: FileText, to: "devis" as View, hot: toValidate.length > 0 },
    { label: "Commandes livrées", value: String(delivered).padStart(2, "0"), icon: PackageCheck, to: "commandes" as View },
    { label: "Facturé (HT)", value: `${Math.round(invoiced / 1000)} k`, icon: Receipt, to: "documents" as View },
  ];

  return (
    <div className="grid gap-6">
      <div>
        <p className="m-0 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-mp-red">Tableau de bord</p>
        <h1 className="m-0 mt-2 text-[clamp(1.8rem,3.2vw,2.6rem)] font-extrabold tracking-[-0.035em] text-mp-ink">Bonjour, {demoClient.firstName}.</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, to, hot }) => (
          <button
            key={label}
            type="button"
            onClick={() => go(to)}
            className={cx(
              "group cursor-pointer rounded-[20px] border p-4 text-left transition hover:-translate-y-0.5 sm:p-5",
              hot ? "border-mp-red bg-mp-red text-white" : "border-mp-line bg-white text-mp-ink hover:border-mp-ink",
            )}
          >
            <span className={cx("grid size-9 place-items-center rounded-xl", hot ? "bg-white/20" : "bg-mp-paper text-mp-muted")}>
              <Icon size={17} />
            </span>
            <span className="mt-4 block font-mono text-[clamp(1.6rem,3vw,2.2rem)] font-medium leading-none">{value}</span>
            <span className={cx("mt-1.5 block text-[0.82rem]", hot ? "text-white/80" : "text-mp-muted")}>{label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card>
          <CardHead
            title="Commandes en cours"
            action={
              <button type="button" onClick={() => go("commandes")} className="cursor-pointer text-[0.84rem] font-semibold text-mp-red">
                Tout voir
              </button>
            }
          />
          <ul className="m-0 list-none p-0">
            {inProgress.slice(0, 4).map((o) => (
              <li key={o.id}>
                <button type="button" onClick={() => go("commandes", o.id)} className="block w-full cursor-pointer border-b border-mp-line px-5 py-4 text-left transition last:border-b-0 hover:bg-mp-paper/60">
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-[0.86rem] font-medium text-mp-ink">{o.id}</span>
                    <Badge {...ORDER_BADGE[o.status]} />
                  </span>
                  <span className="mt-1 block truncate text-[0.84rem] text-mp-muted">
                    {o.site} · {date(o.date)}
                  </span>
                  <MiniTrack status={o.status} />
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-6">
          <Card>
            <CardHead title="Devis à valider" />
            {toValidate.length ? (
              <ul className="m-0 list-none p-0">
                {toValidate.map((q) => (
                  <li key={q.id} className="px-5 py-4">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[0.86rem] text-mp-ink">{q.id}</span>
                      <span className="font-mono text-[0.9rem] font-medium text-mp-ink">{mad(totalHT(q.lines))}</span>
                    </span>
                    <span className="mt-1 block text-[0.86rem] text-mp-muted">{q.subject}</span>
                    <span className="mt-1 block text-[0.78rem] font-semibold text-mp-red">Valable jusqu’au {date(q.validUntil)}</span>
                    <button type="button" onClick={() => go("devis", q.id)} className="mt-3 inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-mp-red px-4 text-[0.86rem] font-semibold text-white transition hover:bg-mp-red-dark">
                      Consulter et valider <ArrowRight size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="m-0 px-5 py-6 text-[0.9rem] text-mp-muted">Aucun devis en attente.</p>
            )}
          </Card>

          <Card>
            <CardHead title="Commander à nouveau" />
            <ul className="m-0 list-none p-0">
              {demoOrders
                .flatMap((o) => o.lines)
                .slice(0, 3)
                .map((l) => (
                  <li key={l.reference} className="flex items-center gap-3 border-b border-mp-line px-5 py-3 last:border-b-0">
                    <img src={l.image} alt="" width={80} height={80} loading="lazy" className="size-11 rounded-xl bg-mp-paper object-contain p-0.5" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.88rem] font-semibold text-mp-ink">{l.name}</span>
                      <span className="font-mono text-[0.7rem] text-mp-muted">{l.reference}</span>
                    </span>
                    <Link to="/devis" className="grid size-9 shrink-0 place-items-center rounded-full border-[1.5px] border-mp-ink text-mp-ink transition hover:bg-mp-ink hover:text-white" aria-label={`Recommander ${l.name}`}>
                      <RotateCcw size={14} />
                    </Link>
                  </li>
                ))}
            </ul>
          </Card>

          <RepCard className="lg:hidden" />
        </div>
      </div>
    </div>
  );
}

function MiniTrack({ status }: { status: OrderStatus }) {
  const idx = ORDER_STEPS.findIndex((s) => s.key === status);
  return (
    <span className="mt-3 flex items-center gap-1.5" aria-hidden="true">
      {ORDER_STEPS.map((s, i) => (
        <span key={s.key} className={cx("h-1.5 flex-1 rounded-full", i <= idx ? "bg-mp-red" : "bg-mp-line")} />
      ))}
    </span>
  );
}

/* =================================================================== */
/* ORDERS                                                               */
/* =================================================================== */

function PageTitle({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="m-0 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-mp-red">{kicker}</p>
        <h1 className="m-0 mt-2 text-[clamp(1.8rem,3.2vw,2.4rem)] font-extrabold tracking-[-0.035em] text-mp-ink">{title}</h1>
      </div>
      {children}
    </div>
  );
}

function OrdersList({ orders, go }: { orders: Order[]; go: (v: View, id?: string) => void }) {
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const list = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <PageTitle kicker="Suivi" title="Mes commandes" />
      <div className="mb-4 flex gap-2 overflow-x-auto [scrollbar-width:none]">
        {(["all", ...ORDER_STEPS.map((s) => s.key)] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={cx(
              "shrink-0 cursor-pointer rounded-full border-[1.5px] px-3.5 py-1.5 text-[0.84rem] font-semibold transition",
              filter === k ? "border-mp-ink bg-mp-ink text-white" : "border-mp-line bg-white text-mp-ink hover:border-mp-ink",
            )}
          >
            {k === "all" ? `Toutes (${orders.length})` : ORDER_BADGE[k].label}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="hidden grid-cols-[150px_110px_minmax(0,1fr)_130px_140px_24px] gap-4 bg-mp-ink px-5 py-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/60 md:grid">
          <span>N° commande</span>
          <span>Date</span>
          <span>Réf. client · chantier</span>
          <span className="text-right">Montant HT</span>
          <span>Statut</span>
          <span />
        </div>
        <ul className="m-0 list-none p-0">
          {list.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                onClick={() => go("commandes", o.id)}
                className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-t border-mp-line px-5 py-4 text-left transition first:border-t-0 hover:bg-mp-paper/60 md:grid-cols-[150px_110px_minmax(0,1fr)_130px_140px_24px]"
              >
                <span className="font-mono text-[0.88rem] font-medium text-mp-ink">{o.id}</span>
                <span className="text-[0.86rem] text-mp-muted max-md:hidden">{date(o.date)}</span>
                <span className="min-w-0 max-md:col-span-2 max-md:row-start-2">
                  <span className="block truncate text-[0.88rem] font-semibold text-mp-ink">{o.clientRef}</span>
                  <span className="block truncate text-[0.8rem] text-mp-muted">
                    {o.site}
                    <span className="md:hidden"> · {date(o.date)}</span>
                  </span>
                </span>
                <span className="text-right font-mono text-[0.88rem] text-mp-ink max-md:col-span-2 max-md:row-start-3 max-md:text-left">{mad(totalHT(o.lines))}</span>
                <span className="max-md:col-start-2 max-md:row-start-1">
                  <Badge {...ORDER_BADGE[o.status]} />
                </span>
                <ChevronRight size={18} className="text-mp-muted max-md:hidden" />
              </button>
            </li>
          ))}
          {!list.length && <li className="px-5 py-10 text-center text-mp-muted">Aucune commande avec ce statut.</li>}
        </ul>
      </Card>
    </div>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} className="mb-5 inline-flex cursor-pointer items-center gap-2 text-[0.88rem] font-semibold text-mp-muted transition hover:text-mp-ink">
      <ArrowLeft size={16} /> {label}
    </button>
  );
}

function LinesTable({ lines, showDelivered }: { lines: Line[]; showDelivered?: boolean }) {
  const ht = totalHT(lines);
  return (
    <>
      <ul className="m-0 list-none p-0">
        {lines.map((l) => {
          const partial = showDelivered && l.delivered !== undefined && l.delivered < l.qty;
          return (
            <li key={l.reference} className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-3 border-b border-mp-line px-5 py-3.5 sm:grid-cols-[48px_minmax(0,1fr)_90px_130px]">
              <img src={l.image} alt="" width={96} height={96} loading="lazy" className="size-12 rounded-xl bg-mp-paper object-contain p-0.5" />
              <span className="min-w-0">
                <span className="block text-[0.9rem] font-semibold leading-snug text-mp-ink">{l.name}</span>
                <span className="block font-mono text-[0.72rem] text-mp-muted">
                  {l.reference} · {l.unitPrice ? `${mad(l.unitPrice)} / ${unitLabel(l)}` : "prix en cours"}
                </span>
                {showDelivered && l.delivered !== undefined && (
                  <span className={cx("mt-1 inline-block text-[0.74rem] font-semibold", partial ? "text-amber-700" : "text-green-700")}>
                    Livré {l.delivered} / {l.qty} {unitLabel(l)}
                    {partial && ` · reste ${l.qty - l.delivered}`}
                  </span>
                )}
              </span>
              <span className="text-right font-mono text-[0.86rem] text-mp-ink max-sm:hidden">
                {l.qty} {unitLabel(l)}
              </span>
              <span className="text-right font-mono text-[0.88rem] font-medium text-mp-ink">
                {l.unitPrice ? mad(l.qty * l.unitPrice) : "—"}
                <span className="block text-[0.72rem] font-normal text-mp-muted sm:hidden">
                  {l.qty} {unitLabel(l)}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
      {ht > 0 && (
        <dl className="m-0 ml-auto grid max-w-[320px] gap-1.5 px-5 py-4 text-[0.9rem]">
          <div className="flex justify-between gap-4">
            <dt className="text-mp-muted">Total HT</dt>
            <dd className="m-0 font-mono text-mp-ink">{mad(ht)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-mp-muted">TVA 20 %</dt>
            <dd className="m-0 font-mono text-mp-ink">{mad(ht * 0.2)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-mp-line pt-2 text-[1rem] font-bold">
            <dt className="text-mp-ink">Total TTC</dt>
            <dd className="m-0 font-mono text-mp-ink">{mad(ht * 1.2)}</dd>
          </div>
        </dl>
      )}
    </>
  );
}

function OrderDetail({ order, go, notify }: { order: Order | undefined; go: (v: View, id?: string) => void; notify: (m: string) => void }) {
  if (!order) {
    return (
      <div>
        <BackButton onClick={() => go("commandes")} label="Mes commandes" />
        <Card className="p-8 text-center text-mp-muted">Commande introuvable.</Card>
      </div>
    );
  }
  const idx = ORDER_STEPS.findIndex((s) => s.key === order.status);
  const docs = demoDocuments.filter((d) => order.documents.includes(d.id));

  return (
    <div>
      <BackButton onClick={() => go("commandes")} label="Mes commandes" />
      <PageTitle kicker={`Commande du ${date(order.date)}`} title={order.id}>
        <Badge {...ORDER_BADGE[order.status]} />
      </PageTitle>

      {/* Tracking */}
      <Card className="mb-6 p-5 sm:p-7">
        <div className="relative">
          <span className="absolute left-[20px] right-[20px] top-[20px] hidden h-[3px] rounded-full bg-mp-line sm:block" />
          <span
            className="absolute left-[20px] top-[20px] hidden h-[3px] rounded-full current-x animate-flow-x sm:block"
            style={{ width: `calc((100% - 40px) * ${idx / (ORDER_STEPS.length - 1)})` }}
          />
          <ol className="relative m-0 grid list-none gap-5 p-0 sm:grid-cols-4 sm:gap-2">
            {ORDER_STEPS.map((s, i) => {
              const done = i <= idx;
              const Icon = s.icon;
              const stepDate = order.steps.find((x) => x.status === s.key)?.date;
              return (
                <li key={s.key} className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-2 sm:text-center">
                  <span
                    className={cx(
                      "grid size-10 shrink-0 place-items-center rounded-full border-2 transition",
                      i === idx && "border-mp-red bg-mp-red text-white shadow-[0_0_0_6px_rgba(215,31,43,0.15)]",
                      i < idx && "border-mp-ink bg-mp-ink text-white",
                      !done && "border-mp-line bg-white text-mp-muted",
                    )}
                  >
                    {i < idx ? <Check size={16} /> : <Icon size={16} />}
                  </span>
                  <span>
                    <span className={cx("block text-[0.9rem] font-semibold", done ? "text-mp-ink" : "text-mp-muted")}>{s.label}</span>
                    <span className="block font-mono text-[0.72rem] text-mp-muted">{stepDate ? date(stepDate) : "—"}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </Card>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <CardHead title={`Articles (${order.lines.length})`} />
          <LinesTable lines={order.lines} showDelivered />
        </Card>

        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-6">
          <Card className="p-5">
            <dl className="m-0 grid gap-3 text-[0.9rem]">
              <div>
                <dt className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-mp-muted">Réf. client</dt>
                <dd className="m-0 mt-0.5 font-semibold text-mp-ink">{order.clientRef}</dd>
              </div>
              <div>
                <dt className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-mp-muted">Livraison</dt>
                <dd className="m-0 mt-0.5 flex gap-2 font-semibold text-mp-ink">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-mp-red" /> {order.site}
                </dd>
              </div>
            </dl>
          </Card>
          <Card>
            <CardHead title="Documents" />
            {docs.length ? (
              <ul className="m-0 list-none p-0">
                {docs.map((d) => (
                  <DocRow key={d.id} doc={d} notify={notify} />
                ))}
              </ul>
            ) : (
              <p className="m-0 px-5 py-5 text-[0.88rem] text-mp-muted">Les documents apparaîtront à l’expédition.</p>
            )}
          </Card>
          <a
            href={`https://wa.me/${site.whatsappDigits}?text=${encodeURIComponent(`Bonjour, question sur la commande ${order.id}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-[1.5px] border-mp-line bg-white font-semibold text-mp-ink transition hover:border-[#25d366] hover:text-[#1a9e4c]"
          >
            <span className="inline-flex size-4 [&_svg]:size-full">
              <WhatsAppIcon />
            </span>
            Une question sur cette commande
          </a>
        </div>
      </div>
    </div>
  );
}

/* =================================================================== */
/* QUOTES                                                               */
/* =================================================================== */

function QuotesList({ quotes, go }: { quotes: Quote[]; go: (v: View, id?: string) => void }) {
  return (
    <div>
      <PageTitle kicker="Offres" title="Mes devis">
        <Link to="/devis" className="inline-flex h-11 items-center gap-2 rounded-full bg-mp-red px-5 text-[0.9rem] font-semibold text-white transition hover:bg-mp-red-dark">
          Nouvelle demande <ArrowRight size={15} />
        </Link>
      </PageTitle>
      <div className="grid gap-3">
        {quotes.map((q) => {
          const ht = totalHT(q.lines);
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => go("devis", q.id)}
              className={cx(
                "grid cursor-pointer gap-3 rounded-[20px] border bg-white p-5 text-left transition hover:-translate-y-0.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center",
                q.status === "a_valider" ? "border-mp-red" : "border-mp-line hover:border-mp-ink",
              )}
            >
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[0.88rem] font-medium text-mp-ink">{q.id}</span>
                  <Badge {...QUOTE_BADGE[q.status]} />
                </span>
                <span className="mt-1.5 block truncate font-semibold text-mp-ink">{q.subject}</span>
                <span className="block text-[0.82rem] text-mp-muted">
                  {date(q.date)} · {q.lines.length} article{q.lines.length > 1 ? "s" : ""} · valable jusqu’au {date(q.validUntil)}
                </span>
              </span>
              <span className="flex items-center justify-between gap-4 sm:justify-end">
                <span className="font-mono text-[1rem] font-medium text-mp-ink">{ht ? mad(ht) : "En cours"}</span>
                <ChevronRight size={18} className="text-mp-muted" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuoteDetail({
  quote,
  go,
  onAccept,
  onRefuse,
  notify,
}: {
  quote: Quote | undefined;
  go: (v: View, id?: string) => void;
  onAccept: (q: Quote) => void;
  onRefuse: (q: Quote) => void;
  notify: (m: string) => void;
}) {
  const [asking, setAsking] = useState(false);
  const [note, setNote] = useState("");
  if (!quote) {
    return (
      <div>
        <BackButton onClick={() => go("devis")} label="Mes devis" />
        <Card className="p-8 text-center text-mp-muted">Devis introuvable.</Card>
      </div>
    );
  }
  const pending = quote.status === "a_valider";

  return (
    <div>
      <BackButton onClick={() => go("devis")} label="Mes devis" />
      <PageTitle kicker={`Devis du ${date(quote.date)} · valable jusqu’au ${date(quote.validUntil)}`} title={quote.id}>
        <Badge {...QUOTE_BADGE[quote.status]} />
      </PageTitle>

      {pending && (
        <div className="mb-6 flex flex-col gap-4 rounded-[22px] bg-mp-navy p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <span>
            <strong className="block text-[1.05rem]">Ce devis attend votre validation.</strong>
            <span className="text-[0.88rem] text-white/65">En l’acceptant, la commande est créée et la préparation démarre.</span>
          </span>
          <span className="flex flex-wrap gap-2">
            <button type="button" onClick={() => onAccept(quote)} className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-mp-red px-5 font-semibold transition hover:bg-mp-red-dark">
              <Check size={16} /> Accepter
            </button>
            <button type="button" onClick={() => setAsking((v) => !v)} className="inline-flex h-11 cursor-pointer items-center rounded-full border border-white/25 px-4 font-semibold transition hover:border-white">
              Demander une modification
            </button>
            <button type="button" onClick={() => onRefuse(quote)} className="inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-white/70 transition hover:text-white">
              <X size={15} /> Refuser
            </button>
          </span>
        </div>
      )}

      {asking && (
        <Card className="mb-6 p-5">
          <label htmlFor="quote-note" className="text-[0.88rem] font-semibold text-mp-ink">
            Votre demande de modification
          </label>
          <textarea
            id="quote-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Quantités, références, délai…"
            className="mt-2 w-full resize-y rounded-xl border-[1.5px] border-mp-line px-4 py-3 text-mp-ink outline-none focus:border-mp-ink"
          />
          <button
            type="button"
            onClick={() => {
              setAsking(false);
              setNote("");
              notify("Demande de modification envoyée à votre commercial");
            }}
            className="mt-3 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-mp-ink px-5 font-semibold text-white transition hover:bg-black"
          >
            Envoyer <ArrowRight size={15} />
          </button>
        </Card>
      )}

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Card className="overflow-hidden">
          <CardHead
            title={quote.subject}
            action={
              <button type="button" onClick={() => notify("PDF de démonstration")} className="inline-flex cursor-pointer items-center gap-1.5 text-[0.84rem] font-semibold text-mp-red">
                <Download size={15} /> PDF
              </button>
            }
          />
          {quote.status === "chiffrage" && (
            <p className="m-0 border-b border-mp-line bg-mp-paper px-5 py-3 text-[0.86rem] text-mp-muted">
              Votre commercial prépare les prix et disponibilités. Vous serez notifié dès que le devis est prêt.
            </p>
          )}
          <LinesTable lines={quote.lines} />
        </Card>
        <RepCard />
      </div>
    </div>
  );
}

/* =================================================================== */
/* DOCUMENTS                                                            */
/* =================================================================== */

const DOC_ICON: Record<DocType, typeof Check> = { facture: Receipt, bl: Truck, devis: FileText };

function DocRow({ doc, notify }: { doc: (typeof demoDocuments)[number]; notify: (m: string) => void }) {
  const Icon = DOC_ICON[doc.type];
  return (
    <li className="flex items-center gap-3 border-b border-mp-line px-5 py-3.5 last:border-b-0">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mp-paper text-mp-ink">
        <Icon size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.9rem] font-semibold text-mp-ink">
          {doc.label} <span className="font-mono text-[0.8rem] font-normal text-mp-muted">{doc.id}</span>
        </span>
        <span className="block truncate text-[0.8rem] text-mp-muted">
          {date(doc.date)} · {doc.ref}
          {doc.amount ? ` · ${mad(doc.amount)} HT` : ""}
        </span>
      </span>
      <button
        type="button"
        onClick={() => notify(`${doc.id} · document de démonstration`)}
        aria-label={`Télécharger ${doc.id}`}
        className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border-[1.5px] border-mp-line text-mp-ink transition hover:border-mp-ink hover:bg-mp-ink hover:text-white"
      >
        <Download size={16} />
      </button>
    </li>
  );
}

function Documents({ notify }: { notify: (m: string) => void }) {
  const [type, setType] = useState<DocType | "all">("all");
  const list = useMemo(() => (type === "all" ? demoDocuments : demoDocuments.filter((d) => d.type === type)), [type]);
  const tabs: { key: DocType | "all"; label: string }[] = [
    { key: "all", label: "Tous" },
    { key: "facture", label: "Factures" },
    { key: "bl", label: "Bons de livraison" },
    { key: "devis", label: "Devis" },
  ];
  return (
    <div>
      <PageTitle kicker="Archives" title="Mes documents" />
      <div className="mb-4 flex gap-2 overflow-x-auto [scrollbar-width:none]">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setType(t.key)}
            className={cx(
              "shrink-0 cursor-pointer rounded-full border-[1.5px] px-3.5 py-1.5 text-[0.84rem] font-semibold transition",
              type === t.key ? "border-mp-ink bg-mp-ink text-white" : "border-mp-line bg-white text-mp-ink hover:border-mp-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <Card className="overflow-hidden">
        <ul className="m-0 list-none p-0">
          {list.map((d) => (
            <DocRow key={d.id} doc={d} notify={notify} />
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* =================================================================== */
/* ACCOUNT                                                              */
/* =================================================================== */

function Account({ notify }: { notify: (m: string) => void }) {
  const rows = [
    ["Raison sociale", demoClient.company],
    ["ICE", demoClient.ice],
    ["Contact", demoClient.contact],
    ["E-mail", demoClient.email],
    ["Téléphone", demoClient.phone],
    ["Conditions", demoClient.discount],
  ];
  return (
    <div>
      <PageTitle kicker="Paramètres" title="Mon compte" />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-2">
        <Card>
          <CardHead
            title="Société"
            action={
              <button type="button" onClick={() => notify("Modification enregistrée (démo)")} className="cursor-pointer text-[0.84rem] font-semibold text-mp-red">
                Modifier
              </button>
            }
          />
          <dl className="m-0">
            {rows.map(([k, v]) => (
              <div key={k} className="grid gap-1 border-b border-mp-line px-5 py-3.5 last:border-b-0 sm:grid-cols-[150px_1fr] sm:gap-4">
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-mp-muted">{k}</dt>
                <dd className="m-0 font-medium text-mp-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-6">
          <Card>
            <CardHead
              title="Adresses de livraison"
              action={
                <button type="button" onClick={() => notify("Adresse ajoutée (démo)")} className="cursor-pointer text-[0.84rem] font-semibold text-mp-red">
                  Ajouter
                </button>
              }
            />
            <ul className="m-0 list-none p-0">
              {demoClient.addresses.map((a, i) => (
                <li key={a} className="flex items-start gap-3 border-b border-mp-line px-5 py-3.5 text-[0.9rem] text-mp-ink last:border-b-0">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-mp-red" />
                  <span className="flex-1">{a}</span>
                  {i === 0 && <span className="rounded-full bg-mp-paper px-2 py-0.5 font-mono text-[0.64rem] uppercase text-mp-muted">Principale</span>}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <strong className="block text-mp-ink">Notifications</strong>
            {["Devis prêt à valider", "Commande expédiée", "Nouvelle facture"].map((n) => (
              <label key={n} className="mt-3 flex cursor-pointer items-center justify-between gap-3 text-[0.9rem] text-mp-ink">
                {n}
                <input type="checkbox" defaultChecked className="size-4 accent-[var(--red)]" />
              </label>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}