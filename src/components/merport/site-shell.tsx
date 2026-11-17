import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X, Zap } from "lucide-react";
import { categories } from "@/data/categories";
import { site } from "@/config/site";
import { QUOTE_BASKET_EVENT, QUOTE_BASKET_KEY, type QuoteItem } from "@/lib/quote-basket";
import { BrandMark } from "./brand-mark";
import { Button } from "@/components/ui/button";

function useBasketCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => {
      try {
        const saved: QuoteItem[] = JSON.parse(localStorage.getItem(QUOTE_BASKET_KEY) ?? "[]");
        setCount(saved.reduce((sum, item) => sum + item.quantity, 0));
      } catch { setCount(0); }
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener(QUOTE_BASKET_EVENT, update);
    return () => { window.removeEventListener("storage", update); window.removeEventListener(QUOTE_BASKET_EVENT, update); };
  }, []);
  return count;
}

export function SiteHeader() {
  const count = useBasketCount();
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="header-brand" aria-label="MERPORT, accueil"><BrandMark compact /></Link>
        <nav className="desktop-nav" aria-label="Navigation principale">
          <div className="nav-products" onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
            <Link to="/produits" className="nav-link nav-link-arrow" aria-expanded={productsOpen}>Produits <ArrowDown size={13} /></Link>
            {productsOpen && <div className="mega-menu"><div className="mega-label">NOS 8 FAMILLES</div><div className="mega-grid">{categories.map((category, index) => <Link key={category.slug} to="/produits/$category" params={{ category: category.slug }} onClick={() => setProductsOpen(false)}><span className="mega-index">0{index + 1}</span><span>{category.name}</span><ArrowUpRight size={14} /></Link>)}</div><Link to="/produits" className="mega-all">Voir le catalogue <ArrowRight size={15} /></Link></div>}
          </div>
          <Link to="/marques" className="nav-link">Marques</Link>
          <Link to="/secteurs" className="nav-link">Secteurs</Link>
          <Link to="/a-propos" className="nav-link">À propos</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>
        <div className="header-actions"><a className="header-phone" href={`tel:${site.phones[0].replaceAll(" ", "")}`}>{site.phones[0]}</a><Button asChild className="button-red header-quote"><Link to="/devis">Demander un devis <ArrowRight size={15} /></Link></Button><Link to="/devis" className="header-basket" aria-label={`Voir le devis, ${count} produit${count === 1 ? "" : "s"}`}><span>DEVIS</span><span className="basket-number">{count}</span></Link></div>
        <Button variant="ghost" size="icon" className="mobile-menu-button" aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open && <nav className="mobile-nav" aria-label="Navigation mobile"><Link to="/produits" onClick={() => setOpen(false)}>Produits <ArrowRight size={15}/></Link>{categories.map((category) => <Link key={category.slug} to="/produits/$category" params={{ category: category.slug }} onClick={() => setOpen(false)} className="mobile-sub-link">{category.name}</Link>)}{[["Marques", "/marques"], ["Secteurs", "/secteurs"], ["À propos", "/a-propos"], ["Contact", "/contact"]].map(([label, to]) => <Link key={to} to={to as "/marques"} onClick={() => setOpen(false)}>{label} <ArrowRight size={15}/></Link>)}<Button asChild className="button-red"><Link to="/devis" onClick={() => setOpen(false)}>Demander un devis</Link></Button></nav>}
    </header>
  );
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-lines" aria-hidden="true"/><div className="footer-top"><div className="footer-brand"><BrandMark/><p>L’énergie de vos projets,<br/>livrée sans détour.</p><a href={`https://wa.me/${site.whatsappDigits}`} target="_blank" rel="noreferrer" className="footer-whatsapp">WhatsApp <ArrowUpRight size={15}/></a></div><div className="footer-col"><span>EXPLORER</span><Link to="/produits">Catalogue</Link><Link to="/marques">Nos marques</Link><Link to="/secteurs">Secteurs</Link><Link to="/a-propos">À propos</Link></div><div className="footer-col"><span>VOTRE PROJET</span><Link to="/devis">Demander un devis</Link><Link to="/contact">Nous contacter</Link><a href={`tel:${site.phones[0].replaceAll(" ", "")}`}>{site.phones[0]}</a><a href={`mailto:${site.email}`}>{site.email}</a></div><div className="footer-col footer-address"><span>CASABLANCA</span><p>{site.address}</p><span className="footer-since"><Zap size={14}/> Depuis 1988</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} MERPORT SARL</span><span>{site.legal}</span><div><Link to="/mentions-legales">Mentions légales</Link><Link to="/confidentialite">Confidentialité</Link></div></div></footer>;
}

export function WhatsAppFloat() { return <a href={`https://wa.me/${site.whatsappDigits}`} className="whatsapp-float" target="_blank" rel="noreferrer" aria-label="Contacter MERPORT sur WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.87 11.87 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.15 1.6 5.95L.05 24l6.28-1.65a11.9 11.9 0 0 0 5.75 1.47h.01c6.57 0 11.92-5.35 11.92-11.93a11.85 11.85 0 0 0-3.49-8.41ZM12.09 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.73.98 1-3.64-.23-.37a9.88 9.88 0 0 1-1.52-5.25c0-5.48 4.46-9.94 9.94-9.94a9.9 9.9 0 0 1 7.03 2.92 9.88 9.88 0 0 1 2.91 7.03c0 5.48-4.46 9.94-9.94 9.94Zm5.45-7.44c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.8.37s-1.05 1.02-1.05 2.49 1.08 2.89 1.23 3.09c.15.2 2.12 3.24 5.14 4.55.72.31 1.28.5 1.72.64.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.18-1.42-.07-.13-.27-.2-.57-.35Z"/></svg></a>; }
