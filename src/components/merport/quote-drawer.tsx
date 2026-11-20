import { Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { removeItem, setBasketDrawerOpen, setQuantity, useBasketDrawerOpen, useQuoteBasket, type QuoteItem } from "@/lib/quote-basket";

export function QuantityStepper({ item, compact = false }: { item: QuoteItem; compact?: boolean }) {
  return (
    <div className={compact ? "qty-stepper qty-stepper-compact" : "qty-stepper"}>
      <button type="button" onClick={() => setQuantity(item.slug, item.quantity - 1)} disabled={item.quantity <= 1} aria-label={`Diminuer la quantité de ${item.name}`}><Minus size={14} /></button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={999}
        value={item.quantity}
        onChange={(event) => setQuantity(item.slug, Number(event.target.value))}
        aria-label={`Quantité pour ${item.name}`}
      />
      <button type="button" onClick={() => setQuantity(item.slug, item.quantity + 1)} disabled={item.quantity >= 999} aria-label={`Augmenter la quantité de ${item.name}`}><Plus size={14} /></button>
    </div>
  );
}

export function BasketLine({ item }: { item: QuoteItem }) {
  return (
    <li className="basket-line">
      {item.image ? <img src={item.image} alt="" width={1200} height={1200} loading="lazy" decoding="async" /> : <span className="basket-line-placeholder" />}
      <div className="basket-line-info">
        <span className="basket-line-name">{item.name}</span>
        <span className="basket-line-ref">Réf. {item.reference}</span>
        <QuantityStepper item={item} compact />
      </div>
      <button type="button" className="basket-remove" onClick={() => removeItem(item.slug)} aria-label={`Retirer ${item.name} du devis`}><Trash2 size={16} /></button>
    </li>
  );
}

export function QuoteDrawer() {
  const open = useBasketDrawerOpen();
  const items = useQuoteBasket();
  const total = items.reduce((sum, item) => sum + item.quantity, 0);
  const close = () => setBasketDrawerOpen(false);

  return (
    <Sheet open={open} onOpenChange={setBasketDrawerOpen}>
      <SheetContent side="right" className="quote-drawer">
        <SheetHeader className="quote-drawer-header">
          <SheetTitle>Votre demande de devis</SheetTitle>
          <SheetDescription>{items.length ? `${items.length} référence${items.length > 1 ? "s" : ""} · ${total} article${total > 1 ? "s" : ""}` : "Aucun produit pour l’instant."}</SheetDescription>
        </SheetHeader>
        {items.length ? (
          <ul className="basket-list">{items.map((item) => <BasketLine key={item.slug} item={item} />)}</ul>
        ) : (
          <div className="basket-empty">
            <p>Ajoutez des produits depuis le catalogue, ou envoyez directement votre liste de références.</p>
            <Link to="/produits" className="button button-outline" onClick={close}>Parcourir le catalogue</Link>
          </div>
        )}
        <div className="quote-drawer-footer">
          <p>Prix et délais communiqués sur devis, sous 24 h ouvrées.</p>
          <Link to="/devis" className="button button-red" onClick={close}>{items.length ? "Finaliser ma demande" : "Envoyer une liste de références"} <ArrowRight size={15} /></Link>
          {items.length > 0 && <button type="button" className="text-button" onClick={close}>Continuer mes achats</button>}
        </div>
      </SheetContent>
    </Sheet>
  );
}
