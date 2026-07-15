import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import { Check, ShieldCheck, Users, ArrowRight, Menu, X, ShoppingBag, Plus, Minus, Leaf, Lock, CheckCircle2, XCircle } from "lucide-react";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/fraunces/500-italic.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";

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

// ---------- Animation globale ----------
function GlobalMotionStyles() {
  return (
    <style>{`
      @keyframes dv-fall {
        0% { transform: translate(0,-10px) rotate(0deg); opacity: 0; }
        10% { opacity: 0.85; }
        100% { transform: translate(var(--dx,20px), 340px) rotate(200deg); opacity: 0; }
      }
      @keyframes dv-river-flow {
        to { stroke-dashoffset: -200; }
      }
      @keyframes dv-twinkle {
        0%, 100% { opacity: 0.25; }
        50% { opacity: 0.9; }
      }
      .dv-petal { animation: dv-fall linear infinite; }
      .dv-river-anim { animation: dv-river-flow 6s linear infinite; }
      .dv-star { animation: dv-twinkle 3s ease-in-out infinite; }
      .dv-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.7s ease, transform 0.7s ease; }
      .dv-reveal.dv-in { opacity: 1; transform: translateY(0); }
      @media (prefers-reduced-motion: reduce) {
        .dv-petal, .dv-river-anim, .dv-star { animation: none !important; }
        .dv-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
      }
    `}</style>
  );
}

// ---------- Révélation au scroll ----------
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`dv-reveal ${inView ? "dv-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ---------- Pétales flottants (décoratif) ----------
function Petals({ count = 10 }) {
  const petals = React.useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        left: `${(i * 97) % 100}%`,
        size: 6 + ((i * 13) % 8),
        duration: 9 + ((i * 7) % 6),
        delay: -(i * 2.3),
        dx: `${((i % 5) - 2) * 18}px`,
      })),
    [count]
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="dv-petal absolute rounded-full"
          style={{
            left: p.left,
            top: "-10px",
            width: p.size,
            height: p.size * 0.7,
            backgroundColor: colors.tealGlow,
            opacity: 0.7,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--dx": p.dx,
          }}
        />
      ))}
    </div>
  );
}

// ---------- Bannière illustrée (originale, nuit/torii/cerisiers) ----------
function HeroBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: "clamp(220px,32vw,340px)", backgroundColor: colors.bark }}>
      <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f3ead0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f3ead0" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="1200" height="400" fill={colors.bark} />
        <circle cx="620" cy="130" r="150" fill="url(#moonGlow)" />
        <circle cx="620" cy="130" r="70" fill="#efe6cf" />
        <circle cx="645" cy="105" r="7" fill="#d8cfae" opacity="0.5" />
        <circle cx="600" cy="150" r="5" fill="#d8cfae" opacity="0.5" />

        {[...Array(18)].map((_, i) => (
          <circle
            key={i}
            className="dv-star"
            cx={(i * 137) % 1200}
            cy={20 + ((i * 53) % 160)}
            r={i % 3 === 0 ? 1.6 : 1}
            fill="#e8dfc4"
            style={{ animationDelay: `${(i % 5) * 0.6}s` }}
          />
        ))}

        <path d="M0 300 C 200 260, 340 320, 520 285 C 700 250, 820 300, 1000 270 C 1080 258, 1150 268, 1200 275 L1200 400 L0 400 Z" fill="#132c42" />
        <path d="M0 340 C 220 315, 380 355, 560 335 C 760 312, 900 350, 1200 330 L1200 400 L0 400 Z" fill="#0f2233" />

        <g fill="#173a2c" opacity="0.9">
          <path d="M90 340 L130 260 L170 340 Z" />
          <path d="M150 350 L185 285 L220 350 Z" />
          <path d="M980 345 L1020 270 L1060 345 Z" />
          <path d="M1040 352 L1075 292 L1110 352 Z" />
        </g>

        <path d="M470 340 C 520 320 680 320 730 340 C 690 375 660 400 600 400 C 540 400 510 375 470 340 Z" fill={colors.tealGlow} opacity="0.55" />

        <g stroke="#241407" strokeWidth="9" fill="none" strokeLinecap="round">
          <line x1="545" y1="330" x2="545" y2="392" />
          <line x1="655" y1="330" x2="655" y2="392" />
          <line x1="530" y1="338" x2="670" y2="338" />
          <line x1="536" y1="356" x2="664" y2="356" />
        </g>

        <g stroke="#5a3420" strokeWidth="3.5" fill="none" opacity="0.9">
          <path d="M60 60 C 100 40 130 55 150 90" />
          <path d="M100 55 C 118 50 130 42 138 30" />
        </g>
        <g fill={colors.tealGlow}>
          <circle cx="150" cy="90" r="8" />
          <circle cx="138" cy="30" r="6" />
          <circle cx="115" cy="45" r="6.5" />
          <circle cx="80" cy="52" r="6" />
          <circle cx="60" cy="60" r="5.5" />
        </g>

        <g stroke="#5a3420" strokeWidth="3.5" fill="none" opacity="0.9">
          <path d="M1140 55 C 1100 38 1070 52 1050 86" />
          <path d="M1100 50 C 1082 46 1070 38 1063 27" />
        </g>
        <g fill={colors.tealGlow}>
          <circle cx="1050" cy="86" r="8" />
          <circle cx="1063" cy="27" r="6" />
          <circle cx="1086" cy="42" r="6.5" />
          <circle cx="1121" cy="49" r="6" />
          <circle cx="1140" cy="55" r="5.5" />
        </g>
      </svg>
      <Petals count={12} />
    </div>
  );
}

// ---------- Produits ----------
// La liste des produits vit maintenant côté serveur (KV) -- modifiable depuis /admin.

function ProductImage({ images, className, onClick, zoomable = false }) {
  const image = images && images.length > 0 ? images[0] : null;
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
      {zoomable && images && images.length > 1 && (
        <span
          className="absolute bottom-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ ...mono, backgroundColor: "rgba(13,27,42,0.7)", color: colors.parchment }}
        >
          +{images.length - 1}
        </span>
      )}
    </div>
  );
}

function ProductModal({ product, onClose }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const { cart, addToCart, removeFromCart, isOutOfStock, remainingStock } = useCart();

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [product]);

  if (!product) return null;
  const images = product.images && product.images.length > 0 ? product.images : [null];
  const hasMultiple = images.length > 1;
  const outOfStock = !product.soon && isOutOfStock(product.id);

  const prevImg = (e) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
  };
  const nextImg = (e) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      style={{ backgroundColor: "rgba(13,27,42,0.85)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md"
        style={{ perspective: "1600px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-11 right-0 p-1 z-10"
          aria-label="Fermer"
        >
          <X size={26} color={colors.parchment} />
        </button>

        <div
          className="relative w-full transition-transform duration-700"
          style={{
            aspectRatio: "3 / 4",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ---- Face avant : visuel ---- */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden border-2 flex flex-col"
            style={{ backfaceVisibility: "hidden", borderColor: colors.goldBright, backgroundColor: colors.parchmentSoft }}
          >
            <div className="relative flex-1">
              {images[index] ? (
                <img src={images[index]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Leaf size={64} color={colors.moss} strokeWidth={1.2} />
                </div>
              )}

              {hasMultiple && (
                <>
                  <button onClick={prevImg} aria-label="Image précédente" className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(13,27,42,0.6)" }}>
                    <ArrowRight size={14} color={colors.parchment} style={{ transform: "rotate(180deg)" }} />
                  </button>
                  <button onClick={nextImg} aria-label="Image suivante" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(13,27,42,0.6)" }}>
                    <ArrowRight size={14} color={colors.parchment} />
                  </button>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {images.map((_, i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i === index ? colors.goldBright : "rgba(245,241,230,0.5)" }} />
                    ))}
                  </div>
                </>
              )}

              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px]" style={{ ...mono, backgroundColor: "rgba(13,27,42,0.7)", color: colors.tealGlow, letterSpacing: "0.06em" }}>
                {product.tag}
              </div>
            </div>

            <div className="p-5" style={{ backgroundColor: colors.parchment }}>
              <p style={{ ...display, color: colors.bark, fontSize: "19px" }}>{product.name}</p>
              <button
                onClick={() => setFlipped(true)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold underline"
                style={{ color: colors.moss }}
              >
                Voir les détails →
              </button>
            </div>
          </div>

          {/* ---- Face arrière : détails ---- */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden border-2 flex flex-col"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderColor: colors.goldBright, backgroundColor: colors.parchment }}
          >
            <div className="flex-1 overflow-y-auto p-6">
              <span className="text-xs uppercase" style={{ ...mono, color: colors.gold, letterSpacing: "0.1em" }}>{product.tag}</span>
              <h3 className="mt-1.5" style={{ ...display, color: colors.bark, fontSize: "22px" }}>{product.name}</h3>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: colors.ink, opacity: 0.78 }}>{product.text}</p>

              {product.specs && product.specs.length > 0 && (
                <ul className="mt-4 space-y-1.5 border-t pt-4" style={{ borderColor: "rgba(22,50,74,0.1)" }}>
                  {product.specs.map((s) => (
                    <li key={s.label} className="flex items-center justify-between gap-3 text-xs">
                      <span style={{ ...mono, color: colors.moss, letterSpacing: "0.03em" }}>{s.label}</span>
                      <span style={{ color: colors.ink, opacity: 0.85, textAlign: "right" }}>{s.value}</span>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => setFlipped(false)}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold underline"
                style={{ color: colors.moss }}
              >
                ← Revoir le visuel
              </button>
            </div>

            {!product.soon && (
              <div className="p-5 border-t flex items-center justify-between gap-3" style={{ borderColor: "rgba(22,50,74,0.12)", backgroundColor: colors.parchmentSoft }}>
                <span className="font-semibold" style={{ ...display, color: colors.bark, fontSize: "20px" }}>{Number(product.price).toFixed(2)} €</span>
                {outOfStock ? (
                  <span className="text-xs font-semibold" style={{ color: "#b3413a" }}>Rupture de stock</span>
                ) : cart[product.id] ? (
                  <div className="flex items-center gap-3">
                    <button onClick={() => removeFromCart(product.id)} className="w-8 h-8 rounded-full border font-bold" style={{ borderColor: colors.ink, color: colors.ink }}>−</button>
                    <span style={mono}>{cart[product.id]}</span>
                    <button onClick={() => addToCart(product.id)} disabled={remainingStock(product.id) <= 0} className="w-8 h-8 rounded-full border font-bold disabled:opacity-40" style={{ borderColor: colors.ink, color: colors.ink }}>+</button>
                  </div>
                ) : (
                  <button onClick={() => addToCart(product.id)} className="rounded-full px-5 py-2.5 text-sm font-semibold" style={{ backgroundColor: colors.ink, color: colors.parchment }}>
                    Ajouter au panier
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
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
      if (typeof max === "number" && current >= max) return c;
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
    images: p.images,
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
                <ProductImage images={item.images} className="w-14 h-14 rounded-lg shrink-0" />
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
      <svg viewBox="0 0 1120 420" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 w-full h-full opacity-40 pointer-events-none">
        <path className="dv-river-anim" d="M-20 40 C 180 90, 120 180, 320 210 S 560 300, 480 360 S 780 400, 1140 380" stroke={colors.tealGlow} strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="10 14" />
        <path d="M-20 40 C 180 90, 120 180, 320 210 S 560 300, 480 360 S 780 400, 1140 380" stroke={colors.gold} strokeWidth="1" fill="none" strokeDasharray="1 10" strokeLinecap="round" />
      </svg>
      <div className="relative max-w-6xl mx-auto px-5 sm:px-6">
        <Reveal>
          <HeroBanner />
        </Reveal>

        <Reveal delay={100}>
          <Eyebrow>DreamValleyTCG — Revendeur indépendant</Eyebrow>
        </Reveal>
        <Reveal delay={180}>
          <h1 className="mt-4 max-w-xl" style={{ ...display, fontWeight: 600, fontSize: "clamp(38px,6vw,64px)", lineHeight: 1.08, color: colors.bark }}>
            Chaque produit a une histoire <span style={{ fontStyle: "italic", color: colors.moss, fontWeight: 500 }}>avant</span> d'arriver chez vous.
          </h1>
        </Reveal>
        <Reveal delay={260}>
          <p className="mt-5 max-w-md text-lg" style={{ color: colors.ink, opacity: 0.85 }}>
            Nous sélectionnons et vérifions des produits Pokémon TCG scellés, pour que chaque commande soit une découverte — jamais un pari.
          </p>
        </Reveal>
        <Reveal delay={340}>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#catalogue" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold no-underline transition-transform hover:-translate-y-0.5" style={{ backgroundColor: colors.ink, color: colors.parchment }}>
              Voir le catalogue
            </a>
            <a href="#communaute" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold no-underline border-2 transition-transform hover:-translate-y-0.5" style={{ borderColor: colors.ink, color: colors.ink }}>
              Rejoindre le Discord
            </a>
          </div>
        </Reveal>
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
      <Reveal>
        <div className="max-w-xl mb-12">
          <Eyebrow>Ce qui guide chaque envoi</Eyebrow>
          <h2 className="mt-3" style={{ ...display, fontSize: "clamp(28px,4vw,38px)", color: colors.bark }}>Trois principes, aucun compromis.</h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
        {items.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 100}>
            <div className="rounded-2xl p-7 border h-full transition-transform hover:-translate-y-1" style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(22,50,74,0.1)" }}>
              <Icon size={28} color={colors.ink} strokeWidth={2.2} />
              <h3 className="mt-4 text-lg font-semibold" style={{ color: colors.bark }}>{title}</h3>
              <p className="mt-2 text-sm" style={{ color: colors.ink, opacity: 0.78 }}>{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Catalogue() {
  const { cart, addToCart, removeFromCart, isOutOfStock, remainingStock, products } = useCart();
  const [activeProduct, setActiveProduct] = useState(null);

  return (
    <section id="catalogue" className="py-16 sm:py-20" style={{ backgroundColor: colors.parchmentSoft }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <Reveal>
          <div className="max-w-xl mb-9 sm:mb-11">
            <Eyebrow>Ce que l'on propose</Eyebrow>
            <h2 className="mt-3" style={{ ...display, fontSize: "clamp(26px,4vw,38px)", color: colors.bark }}>Le catalogue, en bref.</h2>
          </div>
        </Reveal>

        {products.length === 0 && (
          <p className="text-sm" style={{ color: colors.ink, opacity: 0.6 }}>Chargement du catalogue...</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {products.map((p, i) => {
            const outOfStock = !p.soon && isOutOfStock(p.id);
            return (
              <Reveal key={p.id} delay={(i % 3) * 100}>
                <div
                  onClick={() => setActiveProduct(p)}
                  className="rounded-2xl border flex flex-col overflow-hidden h-full cursor-pointer transition-shadow hover:shadow-lg"
                  style={{ backgroundColor: colors.parchment, borderColor: "rgba(22,50,74,0.1)", opacity: p.soon ? 0.75 : 1 }}
                >
                  <ProductImage images={p.images} className="w-full h-44 sm:h-40" zoomable />
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
                    <div className="px-6 pb-6 pt-4 flex items-center justify-between gap-3 flex-wrap" onClick={(e) => e.stopPropagation()}>
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
                        <button onClick={() => addToCart(p.id)} className="rounded-full px-4 py-2 text-xs font-semibold transition-transform hover:-translate-y-0.5" style={{ backgroundColor: colors.ink, color: colors.parchment }}>
                          Ajouter au panier
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
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
        <Reveal>
          <Eyebrow dark>Où nous retrouver</Eyebrow>
          <h2 className="mt-3 max-w-md" style={{ ...display, fontSize: "clamp(28px,4vw,38px)", color: colors.parchment }}>La boutique ne dort jamais sur une seule plateforme.</h2>
          <p className="mt-4 max-w-lg" style={{ color: colors.parchment, opacity: 0.72 }}>Chaque canal a un rôle précis — des lives aux échanges quotidiens avec la communauté.</p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {links.map((l, i) => (
            <Reveal key={l.name} delay={(i % 4) * 80}>
              <a href="#" className="flex items-center justify-between rounded-2xl px-5 py-4 no-underline border transition-colors hover:border-opacity-60" style={{ borderColor: "rgba(245,241,230,0.18)", color: colors.parchment }}>
                <span>
                  <span className="block font-semibold text-[15px]">{l.name}</span>
                  <span className="block mt-0.5 text-[11px]" style={{ ...mono, color: colors.tealGlow, letterSpacing: "0.04em" }}>{l.role}</span>
                </span>
                <ArrowRight size={18} color={colors.tealGlow} />
              </a>
            </Reveal>
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
        <div className="flex flex-col items-start sm:items-end gap-2">
          <a href="/mentions-legales" className="text-xs no-underline" style={{ color: "rgba(245,241,230,0.7)" }}>
            Mentions légales · CGV · Confidentialité
          </a>
          <p className="max-w-md text-xs leading-relaxed" style={{ color: "rgba(245,241,230,0.55)" }}>
            Revendeur indépendant de produits Pokémon TCG scellés. Aucune affiliation avec The Pokémon Company, Nintendo, Game Freak ou Asmodée. © 2026 DreamValleyTCG.
          </p>
        </div>
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
  const [editingId, setEditingId] = useState(null);
  const [addError, setAddError] = useState("");
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", tag: "", text: "", imagesText: "", specsText: "", soon: false });

  async function handleFileUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setAddError("");
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      const res = await fetch(`${CHECKOUT_API_URL}/api/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.urls) {
        setForm((f) => ({
          ...f,
          imagesText: [f.imagesText, ...data.urls].filter(Boolean).join("\n"),
        }));
        if (data.skipped && data.skipped.length > 0) {
          setAddError(`Ignorés : ${data.skipped.join(", ")}`);
        }
      } else {
        setAddError(data.error || "Échec de l'envoi des images");
      }
    } catch {
      setAddError("Erreur lors de l'envoi des images");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function startEdit(p) {
    setForm({
      name: p.name || "",
      price: p.soon ? "" : String(p.price ?? ""),
      tag: p.tag || "",
      text: p.text || "",
      imagesText: (p.images || []).join("\n"),
      specsText: (p.specs || []).map((s) => `${s.label}: ${s.value}`).join("\n"),
      soon: !!p.soon,
    });
    setEditingId(p.id);
    setAddError("");
    setShowAddForm(true);
  }

  function resetForm() {
    setForm({ name: "", price: "", tag: "", text: "", imagesText: "", specsText: "", soon: false });
    setEditingId(null);
    setAddError("");
  }

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

  async function handleSubmitProduct(e) {
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

      const images = form.imagesText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      const endpoint = editingId ? "/api/admin/products/edit" : "/api/admin/products/add";
      const payload = {
        name: form.name.trim(),
        price: form.price,
        tag: form.tag.trim(),
        text: form.text.trim(),
        images,
        specs,
        soon: form.soon,
      };
      if (editingId) payload.id = editingId;

      const res = await fetch(`${CHECKOUT_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
        resetForm();
        setShowAddForm(false);
      } else {
        setAddError(data.error || "Erreur lors de l'enregistrement");
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
        <div className="w-full max-w-sm">
          <a href="/" className="inline-flex items-center gap-1.5 text-sm no-underline mb-4" style={{ color: colors.parchment, opacity: 0.7 }}>
            <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Retour au site
          </a>
          <form onSubmit={handleLogin} className="p-8 rounded-2xl" style={{ backgroundColor: colors.parchment }}>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 sm:px-6 py-12" style={{ backgroundColor: colors.parchment }}>
      <div className="max-w-2xl mx-auto">
        <a href="/" className="inline-flex items-center gap-1.5 text-sm no-underline mb-4" style={{ color: colors.ink, opacity: 0.65 }}>
          <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Retour au site
        </a>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <h1 style={{ ...display, color: colors.bark, fontSize: "28px" }}>Catalogue & stock</h1>
          <button
            onClick={() => {
              if (showAddForm) {
                setShowAddForm(false);
                resetForm();
              } else {
                resetForm();
                setShowAddForm(true);
              }
            }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
            style={{ backgroundColor: colors.ink, color: colors.parchment }}
          >
            <Plus size={14} /> {showAddForm ? "Annuler" : "Ajouter un produit"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmitProduct} className="mb-8 p-6 rounded-xl border space-y-3" style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(22,50,74,0.15)" }}>
            <p className="text-sm font-semibold" style={{ color: colors.bark }}>
              {editingId ? "Modifier le produit" : "Nouveau produit"}
            </p>
            <input placeholder="Nom du produit *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(22,50,74,0.2)" }} />
            <div className="flex gap-3 flex-wrap">
              <input placeholder="Prix (ex: 12.90 ou 12,90)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} disabled={form.soon} className="flex-1 min-w-[140px] px-3 py-2 rounded-lg border disabled:opacity-50" style={{ borderColor: "rgba(22,50,74,0.2)" }} />
              <input placeholder="Étiquette (ex: Scellé — à l'unité)" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="flex-[2] min-w-[200px] px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(22,50,74,0.2)" }} />
            </div>
            <textarea placeholder="Description" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(22,50,74,0.2)" }} />
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: colors.ink }}>
                Importer des photos depuis ton ordinateur
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full text-sm"
              />
              {uploading && <p className="text-xs mt-1.5" style={{ color: colors.moss }}>Envoi en cours...</p>}
            </div>
            <textarea
              placeholder={"URLs des images (rempli automatiquement après import, ou colle des liens directs ici)"}
              value={form.imagesText}
              onChange={(e) => setForm({ ...form, imagesText: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border"
              style={{ borderColor: "rgba(22,50,74,0.2)" }}
            />
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
              {adding ? "Enregistrement..." : editingId ? "Enregistrer les modifications" : "Créer le produit"}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between flex-wrap gap-3 p-5 rounded-xl border" style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(22,50,74,0.1)" }}>
              <div className="flex items-center gap-3 min-w-0">
                <ProductImage images={p.images} className="w-12 h-12 rounded-lg shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold truncate" style={{ color: colors.bark }}>{p.name}</p>
                  <p className="text-xs mt-1" style={mono}>{p.soon ? "À venir" : `${Number(p.price).toFixed(2)} €`}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: colors.moss }}>
                    {p.images && p.images.length > 0 ? `${p.images.length} image(s) enregistrée(s)` : "Aucune image enregistrée"}
                  </p>
                </div>
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
                  onClick={() => startEdit(p)}
                  className="rounded-full px-4 py-2 text-xs font-semibold border"
                  style={{ borderColor: colors.ink, color: colors.ink }}
                >
                  Modifier
                </button>
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

// ---------- Numéro masqué (anti-scraping bots) ----------
function PhoneReveal({ number }) {
  const [revealed, setRevealed] = useState(false);
  if (revealed) {
    return (
      <a href={`tel:${number.replace(/\s|\./g, "")}`} style={{ color: colors.ink, textDecoration: "underline" }}>
        {number}
      </a>
    );
  }
  return (
    <button
      onClick={() => setRevealed(true)}
      className="underline text-sm"
      style={{ color: colors.moss, background: "none", border: "none", cursor: "pointer", padding: 0 }}
    >
      Afficher le numéro
    </button>
  );
}

// ---------- Mentions légales / CGV / Confidentialité ----------
function LegalPage() {
  const Section = ({ id, title, children }) => (
    <div id={id} className="mb-12 scroll-mt-24">
      <h2 style={{ ...display, color: colors.bark, fontSize: "22px" }} className="mb-4">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: colors.ink, opacity: 0.85 }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: colors.parchment, minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-12">
        <a href="/" className="inline-flex items-center gap-1.5 text-sm no-underline mb-8" style={{ color: colors.ink, opacity: 0.65 }}>
          <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Retour au site
        </a>

        <h1 style={{ ...display, color: colors.bark, fontSize: "32px" }} className="mb-2">Informations légales</h1>
        <p className="text-sm mb-10" style={{ color: colors.moss }}>
          <a href="#mentions" style={{ color: colors.moss }}>Mentions légales</a> · <a href="#cgv" style={{ color: colors.moss }}>CGV</a> · <a href="#retractation" style={{ color: colors.moss }}>Droit de rétractation</a> · <a href="#confidentialite" style={{ color: colors.moss }}>Confidentialité</a>
        </p>

        <Section id="mentions" title="Mentions légales">
          <p><strong>Éditeur du site</strong> — DreamValleyTCG, entreprise individuelle (auto-entrepreneur).</p>
          <p>N° SIRET : 887 853 976 00025</p>
          <p>Siège de l'activité : 1 place de la Libération, 59660 Merville, France</p>
          <p>Email : dreamvalleyspcli@gmail.com</p>
          <p>Téléphone : <PhoneReveal number="07 44 42 99 59" /></p>
          <p>Directeur de la publication : <em>[à compléter — nom et prénom de la personne physique responsable, obligatoire pour une entreprise individuelle]</em></p>
          <p><strong>Hébergement</strong> — Cloudflare, Inc., 101 Townsend St, San Francisco, CA 94107, États-Unis — cloudflare.com</p>
        </Section>

        <Section id="cgv" title="Conditions Générales de Vente">
          <p><strong>Produits</strong> — DreamValleyTCG propose à la vente des produits scellés Pokémon TCG et articles liés, présentés sur le catalogue du site avec leurs caractéristiques principales.</p>
          <p><strong>Prix</strong> — Les prix sont indiqués en euros. TVA non applicable, article 293 B du Code Général des Impôts (franchise en base de TVA) — <em>à vérifier selon ta situation fiscale réelle au moment de la mise en ligne</em>.</p>
          <p><strong>Paiement</strong> — Le paiement s'effectue en ligne par carte bancaire via Stripe, prestataire de paiement sécurisé. DreamValleyTCG n'a à aucun moment accès aux données bancaires du client.</p>
          <p><strong>Livraison</strong> — Livraison en France métropolitaine et pays limitrophes via Mondial Relay (casier, point relais ou domicile, 3 à 5 jours ouvrés) ou Chronopost (point relais, sous 24h). Les frais de livraison sont affichés avant validation du paiement.</p>
          <p><strong>Responsabilité</strong> — DreamValleyTCG s'engage à vérifier l'authenticité de chaque produit avant expédition. En cas de produit non conforme, le client dispose des garanties légales de conformité et des vices cachés prévues par le Code civil et le Code de la consommation.</p>
          <p><strong>Litiges</strong> — En cas de litige, le client peut recourir gratuitement à un médiateur de la consommation. Droit applicable : droit français.</p>
        </Section>

        <Section id="retractation" title="Droit de rétractation">
          <p>Conformément à l'article L221-18 du Code de la consommation, le client dispose d'un délai de <strong>14 jours</strong> à compter de la réception du produit pour exercer son droit de rétractation, sans avoir à justifier de motif.</p>
          <p>Pour exercer ce droit, le client contacte DreamValleyTCG à l'adresse dreamvalleyspcli@gmail.com. Le produit doit être retourné dans son état d'origine.</p>
          <p><em>Point à vérifier avant mise en ligne publique : le statut d'un produit scellé une fois ouvert au regard des exceptions au droit de rétractation (article L221-28) n'est pas évident à trancher seul — une vérification par un professionnel du droit est recommandée pour sécuriser cette clause.</em></p>
        </Section>

        <Section id="confidentialite" title="Politique de confidentialité (RGPD)">
          <p><strong>Données collectées</strong> — Lors d'une commande : nom, email, adresse postale, numéro de téléphone, collectés via le formulaire de paiement Stripe.</p>
          <p><strong>Finalité</strong> — Ces données sont utilisées exclusivement pour le traitement, l'expédition et le suivi de la commande.</p>
          <p><strong>Destinataires</strong> — Stripe (traitement du paiement), Cloudflare (hébergement technique). Aucune donnée n'est vendue ou transmise à des fins commerciales tierces.</p>
          <p><strong>Durée de conservation</strong> — Les données sont conservées le temps nécessaire au traitement de la commande et aux obligations comptables légales.</p>
          <p><strong>Cookies et traceurs</strong> — Ce site n'utilise pas de cookies de suivi ni d'outils d'analyse d'audience. Les polices de caractères sont auto-hébergées (aucune requête vers Google Fonts).</p>
          <p><strong>Vos droits</strong> — Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Pour l'exercer, contactez dreamvalleyspcli@gmail.com.</p>
        </Section>
      </div>
    </div>
  );
}

function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: colors.parchment }}>
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
  if (path.startsWith("/mentions-legales")) return <LegalPage />;

  return (
    <CartProvider>
      <GlobalMotionStyles />
      <div id="top" style={{ backgroundColor: colors.parchment, minHeight: "100vh" }}>
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