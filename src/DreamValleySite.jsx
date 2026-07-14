import React, { useState, useEffect, createContext, useContext } from "react";
import { Check, ShieldCheck, Users, ArrowRight, Menu, X, ShoppingBag, Plus, Minus, Leaf, Lock, CheckCircle2, XCircle } from "lucide-react";

const CHECKOUT_API_URL = "https://dreamvalley-api.dreamvalleyspcli.workers.dev";

const colors = {
  parchment: "#f5f1e6",
  parchmentSoft: "#ece4d3",
  ink: "#16324a",
  bark: "#0d1b2a",
  gold: "#a9821f",
  goldBright: "#d9a441",
  moss: "#5c7a92",
  teal: "#b5567a",
  tealGlow: "#e8a8bf",
};

const display = { fontFamily: "'Fraunces', serif" };
const mono = { fontFamily: "'JetBrains Mono', monospace" };

// ---------- Produits ----------
// La liste des produits vit maintenant côté serveur (KV) -- modifiable depuis /admin.
// Ce composant se contente de l'afficher, plus besoin de toucher au code pour ajouter/retirer un article.

function ProductImage({ image, className, onClick, zoomable = false }) {
  return (
    <div
      onClick={onClick}
      className={`${className} overflow-hidden relative ${zoomable ? "cursor-zoom-in group" : ""}`}
      style={{ backgroundColor: colors.parchmentSoft }}
    >
      {image ? (
        <img
          src={image}
          alt=""
          className={`w-full h-full object-cover transition-transform duration-300 ${zoomable ? "group-hover:scale-105" : ""}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Leaf size={36} color={colors.moss} strokeWidth={1.6} />
        </div>
      )}
    </div>
  );
}

function ImageLightbox({ product, onClose }) {
  if (!product) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(13,27,42,0.85)" }}
      onClick={onClose}
    >
      <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-11 right-0 p-1" aria-label="Fermer">
          <X size={26} color={colors.parchment} />
        </button>
        <div className="rounded-2xl overflow-hidden aspect-square flex items-center justify-center" style={{ backgroundColor: colors.parchmentSoft }}>
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
          ) : (
            <Leaf size={72} color={colors.moss} strokeWidth={1.2} />
          )}
        </div>
        <p className="mt-3 text-center px-2" style={{ ...display, color: colors.parchment, fontSize: "18px" }}>
          {product.name}
        </p>
      </div>
    </div>
  );
}

// ---------- Panier (contexte global) ----------
const CartContext = createContext(null);
const useCart = () => useContext(CartContext);

function CartProvider({ children }) {
  const [cart, setCart] = useState({});
  const [stock, setStock] = useState({});
  const [products, setProducts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    fetch(`${CHECKOUT_API_URL}/api/stock`).then((r) => r.json()).then(setStock).catch(() => {});
    fetch(`${CHECKOUT_API_URL}/api/products`).then((r) => r.json()).then(setProducts).catch(() => {});
  }, []);

  const addToCart = (id) => {
    setCart((c) => {
      const current = c[id] || 0;
      const max = stock[id];
      if (typeof max === "number" && current >= max) return c; // stock atteint, on bloque
      return { ...c, [id]: current + 1 };
    });
  };
  const removeFromCart = (id) =>
    setCart((c) => {
      const next = { ...c };
      if (next[id] > 1) next[id] -= 1;
      else delete next[id];
      return next;
    });

  const remainingStock = (id) => {
    const max = stock[id];
    if (typeof max !== "number") return Infinity;
    return Math.max(0, max - (cart[id] || 0));
  };

  const cartItems = products.filter((p) => cart[p.id]).map((p) => ({
    id: p.id,
    name: p.name,
    unitAmount: Math.round(p.price * 100),
    quantity: cart[p.id],
    price: p.price,
  }));
  const totalCount = cartItems.reduce((n, i) => n + i.quantity, 0);
  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const isOutOfStock = (id) => stock[id] === 0;

  async function checkout() {
    if (cartItems.length === 0) return;
    setStatus("loading");
    try {
      const res = await fetch(CHECKOUT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          successUrl: window.location.origin + "/merci?session_id={CHECKOUT_SESSION_ID}",
          cancelUrl: window.location.origin + "/achat-annule",
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || "Erreur inconnue");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <CartContext.Provider
      value={{ cart, cartItems, totalCount, total, addToCart, removeFromCart, drawerOpen, setDrawerOpen, checkout, status, isOutOfStock, remainingStock, products }}
    >
      {children}
    </CartContext.Provider>
  );
}

function Eyebrow({ children, dark }) {
  return (
    <span style={{ ...mono, color: dark ? colors.tealGlow : colors.moss, letterSpacing: "0.14em" }} className="text-xs uppercase">
      {children}
    </span>
  );
}

// ---------- Nav ----------
function NavBar() {
  const [open, setOpen] = useState(false);
  const { totalCount, setDrawerOpen } = useCart();

  return (
    <header className="sticky top-0 z-20 backdrop-blur border-b" style={{ backgroundColor: "rgba(245,241,230,0.88)", borderColor: "rgba(22,50,74,0.12)" }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-6 py-4">
        <a href="#top" className="flex items-center gap-2 no-underline" style={{ ...display, fontStyle: "italic", fontWeight: 600, fontSize: "20px", color: colors.ink }}>
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 shrink-0">
            <path d="M12 3c3 2 5 6 3.5 10.5C14.5 16.8 12 18 12 21c0-3-2.5-4.2-3.5-7.5C7 9 9 5 12 3Z" fill={colors.goldBright} />
          </svg>
          DreamValley
          <span style={{ fontStyle: "normal", color: colors.moss, fontSize: "14px" }}>TCG</span>
        </a>

        <div className="flex items-center gap-3">
          <button onClick={() => setDrawerOpen(true)} className="relative p-2 rounded-full" style={{ color: colors.ink }} aria-label="Ouvrir le panier">
            <ShoppingBag size={22} />
            {totalCount > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold"
                style={{ backgroundColor: colors.goldBright, color: colors.bark }}
              >
                {totalCount}
              </span>
            )}
          </button>

          <a
            href="#communaute"
            className="hidden sm:inline-flex items-center rounded-full px-4 py-2 text-xs no-underline"
            style={{ ...mono, backgroundColor: colors.ink, color: colors.parchment, letterSpacing: "0.04em" }}
          >
            Rejoindre le Discord
          </a>

          <button onClick={() => setOpen(!open)} className="sm:hidden p-2 rounded-md" style={{ color: colors.ink }} aria-label="Ouvrir le menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="sm:hidden px-6 pb-4">
          <a href="#communaute" onClick={() => setOpen(false)} className="block text-center rounded-full px-4 py-2 text-xs no-underline" style={{ ...mono, backgroundColor: colors.ink, color: colors.parchment }}>
            Rejoindre le Discord
          </a>
        </div>
      )}
    </header>
  );
}

// ---------- Tiroir panier ----------
function CartDrawer() {
  const { cartItems, totalCount, total, addToCart, removeFromCart, drawerOpen, setDrawerOpen, checkout, status, remainingStock } = useCart();

  return (
    <>
      {drawerOpen && <div className="fixed inset-0 z-30" style={{ backgroundColor: "rgba(13,27,42,0.5)" }} onClick={() => setDrawerOpen(false)} />}
      <aside
        className="fixed top-0 right-0 h-full z-40 flex flex-col transition-transform duration-300"
        style={{
          width: "min(420px, 100vw)",
          backgroundColor: colors.parchment,
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          boxShadow: drawerOpen ? "-8px 0 24px rgba(13,27,42,0.2)" : "none",
        }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(22,50,74,0.12)" }}>
          <h3 style={{ ...display, color: colors.bark, fontSize: "20px" }}>Ton panier</h3>
          <button onClick={() => setDrawerOpen(false)} style={{ color: colors.ink }} aria-label="Fermer">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <p className="text-sm mt-8 text-center" style={{ color: colors.ink, opacity: 0.6 }}>
              Ton panier est vide pour l'instant.
            </p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-4 border-b" style={{ borderColor: "rgba(22,50,74,0.08)" }}>
                <ProductImage image={null} className="w-14 h-14 rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: colors.bark }}>{item.name}</p>
                  <p className="text-xs mt-0.5" style={{ ...mono, color: colors.moss }}>{item.price.toFixed(2)} €</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 rounded-full border flex items-center justify-center" style={{ borderColor: colors.ink }}>
                    <Minus size={12} color={colors.ink} />
                  </button>
                  <span style={mono} className="text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => addToCart(item.id)} disabled={remainingStock(item.id) <= 0} className="w-6 h-6 rounded-full border flex items-center justify-center disabled:opacity-40" style={{ borderColor: colors.ink }}>
                    <Plus size={12} color={colors.ink} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="px-6 py-5 border-t" style={{ borderColor: "rgba(22,50,74,0.12)" }}>
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: colors.ink, opacity: 0.7 }} className="text-sm">Total ({totalCount} article{totalCount > 1 ? "s" : ""})</span>
              <span style={{ ...display, color: colors.bark, fontSize: "20px" }}>{total.toFixed(2)} €</span>
            </div>
            <button
              onClick={checkout}
              disabled={status === "loading"}
              className="w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
              style={{ backgroundColor: colors.ink, color: colors.parchment }}
            >
              {status === "loading" ? "Redirection..." : "Payer en sécurité"}
            </button>
            {status === "error" && (
              <p className="mt-3 text-xs" style={{ color: "#b3413a" }}>Une erreur est survenue, réessaie dans un instant.</p>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 sm:pt-24 pb-14 sm:pb-20">
      <svg viewBox="0 0 1120 420" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 w-full h-full opacity-50 pointer-events-none">
        <path d="M-20 40 C 180 90, 120 180, 320 210 S 560 300, 480 360 S 780 400, 1140 380" stroke={colors.tealGlow} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M-20 40 C 180 90, 120 180, 320 210 S 560 300, 480 360 S 780 400, 1140 380" stroke={colors.gold} strokeWidth="1" fill="none" strokeDasharray="1 10" strokeLinecap="round" />
      </svg>
      <div className="relative max-w-6xl mx-auto px-5 sm:px-6">
        <Eyebrow>DreamValleyTCG — Revendeur indépendant</Eyebrow>
        <h1 className="mt-4 max-w-xl" style={{ ...display, fontWeight: 600, fontSize: "clamp(38px,6vw,64px)", lineHeight: 1.08, color: colors.bark }}>
          Chaque produit a une histoire <span style={{ fontStyle: "italic", color: colors.moss, fontWeight: 500 }}>avant</span> d'arriver chez vous.
        </h1>
        <p className="mt-5 max-w-md text-lg" style={{ color: colors.ink, opacity: 0.85 }}>
          Nous sélectionnons et vérifions des produits Pokémon TCG scellés, pour que chaque commande soit une découverte — jamais un pari.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#catalogue" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold no-underline" style={{ backgroundColor: colors.ink, color: colors.parchment }}>
            Voir le catalogue
          </a>
          <a href="#communaute" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold no-underline border-2" style={{ borderColor: colors.ink, color: colors.ink }}>
            Rejoindre le Discord
          </a>
        </div>
      </div>
    </section>
  );
}

function Principles() {
  const items = [
    { icon: Check, title: "Authenticité vérifiée", text: "Chaque scellé est contrôlé avant expédition — poids, hologramme, numéro de lot. Un doute, et le produit ne part pas." },
    { icon: ShieldCheck, title: "Transparence totale", text: "Bons comme mauvais tirages sont montrés, jamais cachés. Le marché mérite des chiffres réels, pas une vitrine triée." },
    { icon: Users, title: "Communauté avant tout", text: "Les infos et alertes marché sont partagées avec la communauté avant d'être exploitées commercialement." },
  ];
  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
      <div className="max-w-xl mb-12">
        <Eyebrow>Ce qui guide chaque envoi</Eyebrow>
        <h2 className="mt-3" style={{ ...display, fontSize: "clamp(28px,4vw,38px)", color: colors.bark }}>Trois principes, aucun compromis.</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-2xl p-7 border" style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(22,50,74,0.1)" }}>
            <Icon size={28} color={colors.ink} strokeWidth={2.2} />
            <h3 className="mt-4 text-lg font-semibold" style={{ color: colors.bark }}>{title}</h3>
            <p className="mt-2 text-sm" style={{ color: colors.ink, opacity: 0.78 }}>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Catalogue() {
  const { cart, addToCart, removeFromCart, isOutOfStock, remainingStock, products } = useCart();
  const [zoomProduct, setZoomProduct] = useState(null);

  return (
    <section id="catalogue" className="py-16 sm:py-20" style={{ backgroundColor: colors.parchmentSoft }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="max-w-xl mb-9 sm:mb-11">
          <Eyebrow>Ce que l'on propose</Eyebrow>
          <h2 className="mt-3" style={{ ...display, fontSize: "clamp(26px,4vw,38px)", color: colors.bark }}>Le catalogue, en bref.</h2>
        </div>

        {products.length === 0 && (
          <p className="text-sm" style={{ color: colors.ink, opacity: 0.6 }}>Chargement du catalogue...</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {products.map((p) => {
            const outOfStock = !p.soon && isOutOfStock(p.id);
            return (
              <div key={p.id} className="rounded-2xl border flex flex-col overflow-hidden" style={{ backgroundColor: colors.parchment, borderColor: "rgba(22,50,74,0.1)", opacity: p.soon ? 0.75 : 1 }}>
                <ProductImage image={p.image} className="w-full h-44 sm:h-40" onClick={() => setZoomProduct(p)} zoomable />
                <span className="px-6 pt-5 text-xs uppercase" style={{ ...mono, color: colors.gold, letterSpacing: "0.1em" }}>{p.tag}</span>
                <h3 className="px-6 pt-2 text-xl" style={{ ...display, color: colors.bark }}>{p.name}</h3>
                <p className="px-6 pt-2 text-sm" style={{ color: colors.ink, opacity: 0.75 }}>{p.text}</p>

                {p.specs && p.specs.length > 0 && (
                  <ul className="px-6 pt-3 space-y-1.5">
                    {p.specs.map((s) => (
                      <li key={s.label} className="flex items-center justify-between gap-3 text-xs">
                        <span style={{ ...mono, color: colors.moss, letterSpacing: "0.03em" }}>{s.label}</span>
                        <span style={{ color: colors.ink, opacity: 0.8, textAlign: "right" }}>{s.value}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex-1" />

                {p.soon ? (
                  <span className="mx-6 mt-4 mb-5 w-fit rounded-md border border-dashed px-2.5 py-1 text-[11px]" style={{ ...mono, color: colors.moss, borderColor: colors.moss }}>
                    En préparation
                  </span>
                ) : (
                  <div className="px-6 pb-6 pt-4 flex items-center justify-between gap-3 flex-wrap">
                    <span className="font-semibold" style={{ ...display, color: colors.bark, fontSize: "18px" }}>{p.price.toFixed(2)} €</span>
                    {outOfStock ? (
                      <span className="text-xs font-semibold" style={{ color: "#b3413a" }}>Rupture de stock</span>
                    ) : cart[p.id] ? (
                      <div className="flex items-center gap-3">
                        <button onClick={() => removeFromCart(p.id)} className="w-7 h-7 rounded-full border font-bold" style={{ borderColor: colors.ink, color: colors.ink }}>−</button>
                        <span style={mono}>{cart[p.id]}</span>
                        <button
                          onClick={() => addToCart(p.id)}
                          disabled={remainingStock(p.id) <= 0}
                          className="w-7 h-7 rounded-full border font-bold disabled:opacity-40"
                          style={{ borderColor: colors.ink, color: colors.ink }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => addToCart(p.id)} className="rounded-full px-4 py-2 text-xs font-semibold" style={{ backgroundColor: colors.ink, color: colors.parchment }}>
                        Ajouter au panier
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ImageLightbox product={zoomProduct} onClose={() => setZoomProduct(null)} />
    </section>
  );
}

function Community() {
  const links = [
    { name: "Discord", role: "Communauté & annonces" },
    { name: "Whatnot", role: "Lives & ventes en direct" },
    { name: "Cardmarket", role: "Vente à l'unité" },
    { name: "Instagram", role: "Coulisses & annonces" },
    { name: "TikTok", role: "Actu & curation TCG" },
    { name: "Contact", role: "Une question, un partenariat" },
  ];
  return (
    <section id="communaute" className="py-16 sm:py-20" style={{ backgroundColor: colors.bark }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <Eyebrow dark>Où nous retrouver</Eyebrow>
        <h2 className="mt-3 max-w-md" style={{ ...display, fontSize: "clamp(28px,4vw,38px)", color: colors.parchment }}>La boutique ne dort jamais sur une seule plateforme.</h2>
        <p className="mt-4 max-w-lg" style={{ color: colors.parchment, opacity: 0.72 }}>Chaque canal a un rôle précis — des lives aux échanges quotidiens avec la communauté.</p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {links.map((l) => (
            <a key={l.name} href="#" className="flex items-center justify-between rounded-2xl px-5 py-4 no-underline border" style={{ borderColor: "rgba(245,241,230,0.18)", color: colors.parchment }}>
              <span>
                <span className="block font-semibold text-[15px]">{l.name}</span>
                <span className="block mt-0.5 text-[11px]" style={{ ...mono, color: colors.tealGlow, letterSpacing: "0.04em" }}>{l.role}</span>
              </span>
              <ArrowRight size={18} color={colors.tealGlow} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-10" style={{ backgroundColor: colors.bark, borderTop: "1px solid rgba(245,241,230,0.12)" }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-start justify-between gap-4">
        <span style={{ ...display, fontStyle: "italic", fontWeight: 600, color: colors.parchment }}>DreamValleyTCG</span>
        <p className="max-w-md text-xs leading-relaxed" style={{ color: "rgba(245,241,230,0.55)" }}>
          Revendeur indépendant de produits Pokémon TCG scellés. Aucune affiliation avec The Pokémon Company, Nintendo, Game Freak ou Asmodée. © 2026 DreamValleyTCG.
        </p>
      </div>
    </footer>
  );
}

// ---------- Page Admin (cachée, protégée par mot de passe) ----------
function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem("dv_admin_token") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState({});
  const [saving, setSaving] = useState({});
  const [deleting, setDeleting] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", tag: "", text: "", image: "", specsText: "", soon: false });

  useEffect(() => {
    if (token) {
      fetch(`${CHECKOUT_API_URL}/api/stock`).then((r) => r.json()).then(setStock).catch(() => {});
      fetch(`${CHECKOUT_API_URL}/api/products`).then((r) => r.json()).then(setProducts).catch(() => {});
    }
  }, [token]);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${CHECKOUT_API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.token) {
        sessionStorage.setItem("dv_admin_token", data.token);
        setToken(data.token);
      } else {
        setError(data.error || "Erreur de connexion");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    }
  }

  async function updateStock(productId, quantity) {
    setSaving((s) => ({ ...s, [productId]: true }));
    try {
      const res = await fetch(`${CHECKOUT_API_URL}/api/admin/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (!data.error) setStock(data);
    } finally {
      setSaving((s) => ({ ...s, [productId]: false }));
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    setAddError("");
    if (!form.name.trim()) {
      setAddError("Le nom du produit est requis.");
      return;
    }
    setAdding(true);
    try {
      const specs = form.specsText
        .split("\n")
        .map((line) => line.split(":"))
        .filter((parts) => parts.length >= 2 && parts[0].trim())
        .map(([label, ...rest]) => ({ label: label.trim(), value: rest.join(":").trim() }));

      const res = await fetch(`${CHECKOUT_API_URL}/api/admin/products/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name.trim(),
          price: form.price,
          tag: form.tag.trim(),
          text: form.text.trim(),
          image: form.image.trim() || null,
          specs,
          soon: form.soon,
        }),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
        setForm({ name: "", price: "", tag: "", text: "", image: "", specsText: "", soon: false });
        setShowAddForm(false);
      } else {
        setAddError(data.error || "Erreur lors de l'ajout");
      }
    } catch {
      setAddError("Erreur de connexion au serveur");
    } finally {
      setAdding(false);
    }
  }

  async function handleDeleteProduct(id) {
    if (!window.confirm("Supprimer définitivement ce produit ?")) return;
    setDeleting((d) => ({ ...d, [id]: true }));
    try {
      const res = await fetch(`${CHECKOUT_API_URL}/api/admin/products/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } finally {
      setDeleting((d) => ({ ...d, [id]: false }));
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={{ backgroundColor: colors.bark }}>
        <form onSubmit={handleLogin} className="w-full max-w-sm p-8 rounded-2xl" style={{ backgroundColor: colors.parchment }}>
          <div className="flex items-center gap-2 mb-6">
            <Lock size={20} color={colors.ink} />
            <h1 style={{ ...display, color: colors.bark, fontSize: "22px" }}>Administration</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full px-4 py-3 rounded-lg border mb-4"
            style={{ borderColor: "rgba(22,50,74,0.2)", backgroundColor: "#fff" }}
          />
          {error && <p className="text-sm mb-4" style={{ color: "#b3413a" }}>{error}</p>}
          <button type="submit" className="w-full rounded-full px-6 py-3 text-sm font-semibold" style={{ backgroundColor: colors.ink, color: colors.parchment }}>
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 sm:px-6 py-12" style={{ backgroundColor: colors.parchment }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <h1 style={{ ...display, color: colors.bark, fontSize: "28px" }}>Catalogue & stock</h1>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
            style={{ backgroundColor: colors.ink, color: colors.parchment }}
          >
            <Plus size={14} /> {showAddForm ? "Annuler" : "Ajouter un produit"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddProduct} className="mb-8 p-6 rounded-xl border space-y-3" style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(22,50,74,0.15)" }}>
            <input placeholder="Nom du produit *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(22,50,74,0.2)" }} />
            <div className="flex gap-3 flex-wrap">
              <input placeholder="Prix (ex: 12.90)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} disabled={form.soon} className="flex-1 min-w-[140px] px-3 py-2 rounded-lg border disabled:opacity-50" style={{ borderColor: "rgba(22,50,74,0.2)" }} />
              <input placeholder="Étiquette (ex: Scellé — à l'unité)" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="flex-[2] min-w-[200px] px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(22,50,74,0.2)" }} />
            </div>
            <textarea placeholder="Description" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(22,50,74,0.2)" }} />
            <input placeholder="URL de l'image (facultatif)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(22,50,74,0.2)" }} />
            <textarea
              placeholder={"Caractéristiques, une par ligne : Label: Valeur\nex: Langue: Français"}
              value={form.specsText}
              onChange={(e) => setForm({ ...form, specsText: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border"
              style={{ borderColor: "rgba(22,50,74,0.2)" }}
            />
            <label className="flex items-center gap-2 text-sm" style={{ color: colors.ink }}>
              <input type="checkbox" checked={form.soon} onChange={(e) => setForm({ ...form, soon: e.target.checked })} />
              Produit "à venir" (pas encore en vente, sans prix ni ajout au panier)
            </label>
            {addError && <p className="text-sm" style={{ color: "#b3413a" }}>{addError}</p>}
            <button type="submit" disabled={adding} className="rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: colors.ink, color: colors.parchment }}>
              {adding ? "Ajout..." : "Créer le produit"}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between flex-wrap gap-3 p-5 rounded-xl border" style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(22,50,74,0.1)" }}>
              <div className="min-w-0">
                <p className="font-semibold" style={{ color: colors.bark }}>{p.name}</p>
                <p className="text-xs mt-1" style={mono}>{p.soon ? "À venir" : `${Number(p.price).toFixed(2)} €`}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {!p.soon && (
                  <>
                    <input
                      type="number"
                      min="0"
                      value={stock[p.id] ?? ""}
                      onChange={(e) => setStock((s) => ({ ...s, [p.id]: Number(e.target.value) }))}
                      className="w-20 px-3 py-2 rounded-lg border text-center"
                      style={{ borderColor: "rgba(22,50,74,0.2)" }}
                      placeholder="—"
                    />
                    <button
                      onClick={() => updateStock(p.id, stock[p.id] ?? 0)}
                      disabled={saving[p.id]}
                      className="rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-60"
                      style={{ backgroundColor: colors.ink, color: colors.parchment }}
                    >
                      {saving[p.id] ? "..." : "Enregistrer"}
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDeleteProduct(p.id)}
                  disabled={deleting[p.id]}
                  className="rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-60 border"
                  style={{ borderColor: "#b3413a", color: "#b3413a" }}
                >
                  {deleting[p.id] ? "..." : "Supprimer"}
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-sm" style={{ color: colors.ink, opacity: 0.6 }}>Aucun produit pour l'instant.</p>
          )}
        </div>
        <p className="text-xs mt-8" style={{ color: colors.ink, opacity: 0.6 }}>
          Stock : laisse le champ vide = non suivi (toujours disponible). Mets 0 pour afficher "Rupture de stock".
        </p>
      </div>
    </div>
  );
}

// ---------- Pages de confirmation ----------
function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: colors.parchment }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.ink }}>
          <CheckCircle2 size={32} color={colors.parchment} />
        </div>
        <Eyebrow>Commande confirmée</Eyebrow>
        <h1 className="mt-3" style={{ ...display, fontSize: "clamp(28px,4vw,36px)", color: colors.bark }}>
          Merci pour ta commande.
        </h1>
        <p className="mt-4 text-base" style={{ color: colors.ink, opacity: 0.8 }}>
          Ton paiement a bien été reçu. Un email de confirmation Stripe vient d'arriver dans ta boîte mail, et l'expédition suit sous peu.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold no-underline mt-8"
          style={{ backgroundColor: colors.ink, color: colors.parchment }}
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}

function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: colors.parchment }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center border-2" style={{ borderColor: colors.ink }}>
          <XCircle size={32} color={colors.ink} />
        </div>
        <Eyebrow>Paiement annulé</Eyebrow>
        <h1 className="mt-3" style={{ ...display, fontSize: "clamp(28px,4vw,36px)", color: colors.bark }}>
          Aucun souci, rien n'a été débité.
        </h1>
        <p className="mt-4 text-base" style={{ color: colors.ink, opacity: 0.8 }}>
          Ta commande a été annulée avant paiement. Ton panier est toujours disponible si tu veux réessayer.
        </p>
        <a
          href="/#catalogue"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold no-underline mt-8"
          style={{ backgroundColor: colors.ink, color: colors.parchment }}
        >
          Retour au catalogue
        </a>
      </div>
    </div>
  );
}

// ---------- Racine ----------
export default function DreamValleySite() {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";

  if (path.startsWith("/admin")) return <AdminPage />;
  if (path.startsWith("/merci")) return <SuccessPage />;
  if (path.startsWith("/achat-annule")) return <CancelPage />;

  return (
    <CartProvider>
      <div id="top" style={{ backgroundColor: colors.parchment, minHeight: "100vh" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=JetBrains+Mono:wght@400;500&display=swap');
        `}</style>
        <NavBar />
        <CartDrawer />
        <Hero />
        <Principles />
        <Catalogue />
        <Community />
        <Footer />
      </div>
    </CartProvider>
  );
}