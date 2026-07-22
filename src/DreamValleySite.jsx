import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import { Check, ShieldCheck, Users, ArrowRight, Menu, X, ShoppingBag, Plus, Minus, Leaf, Lock, CheckCircle2, XCircle, Trash2, ChevronUp, ChevronDown, Info, Bell, CreditCard, Cloud, Code2, Mail, Search, Truck, Star, TrendingUp } from "lucide-react";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/fraunces/500-italic.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import CoursDesCartesPage from "./CoursDesCartesPage";

const CHECKOUT_API_URL = "https://dreamvalley-api.dreamvalleyspcli.workers.dev";

const colors = {
  parchment: "#181F31",
  parchmentSoft: "#212a42",
  ink: "#f0ece0",
  bark: "#0d1b2a",
  gold: "#d9a441",
  goldBright: "#f0c674",
  moss: "#8ba3b8",
  teal: "#e8a8bf",
  tealGlow: "#f0c4d6",
};

const display = { fontFamily: "'Fraunces', serif" };
const mono = { fontFamily: "'JetBrains Mono', monospace" };
const CATEGORIES = ["Produits Chinois", "Produits Français", "Produits Japonais", "Produits Coréen", "Carte à l'unité"];

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
      @keyframes dv-shine {
        0% { transform: translateX(0) skewX(-18deg); }
        100% { transform: translateX(340%) skewX(-18deg); }
      }
      .dv-shine { animation: dv-shine 3.4s ease-in-out infinite; }
      .dv-petal { animation: dv-fall linear infinite; }
      .dv-river-anim { animation: dv-river-flow 6s linear infinite; }
      .dv-star { animation: dv-twinkle 3s ease-in-out infinite; }
      .dv-reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.7s ease, transform 0.7s ease; }
      .dv-reveal.dv-in { opacity: 1; transform: translateY(0); }
      @media (prefers-reduced-motion: reduce) {
        .dv-petal, .dv-river-anim, .dv-star, .dv-shine { animation: none !important; }
        .dv-reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
      }
    `}</style>
  );
}

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

const SPARKLE_PATH = "M0,-10 C1,-3 3,-1 10,0 C3,1 1,3 0,10 C-1,3 -3,1 -10,0 C-3,-1 -1,-3 0,-10 Z";

function HeroBanner() {
  const sparkles = [
    { top: "12%", left: "8%", scale: 0.5, delay: 0 },
    { top: "22%", left: "88%", scale: 0.4, delay: 0.6 },
    { top: "68%", left: "15%", scale: 0.45, delay: 1.1 },
    { top: "78%", left: "92%", scale: 0.55, delay: 0.3 },
    { top: "40%", left: "50%", scale: 0.35, delay: 1.6 },
    { top: "15%", left: "45%", scale: 0.4, delay: 0.9 },
    { top: "85%", left: "60%", scale: 0.5, delay: 1.3 },
  ];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: "clamp(220px,32vw,340px)", backgroundColor: colors.parchment }}>
      <img
        src="/banner.jpg"
        alt="DreamValleyTCG"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          maskImage: "radial-gradient(ellipse at center, black 45%, transparent 92%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 45%, transparent 92%)",
        }}
      />

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          {sparkles.map((s, i) => (
            <path
              key={i}
              className="dv-star"
              d={SPARKLE_PATH}
              transform={`translate(${parseFloat(s.left)} ${parseFloat(s.top)}) scale(${s.scale * 0.12})`}
              fill="#f5f1e6"
              style={{ animationDelay: `${s.delay}s` }}
            />
          ))}
        </svg>
      </div>

      <Petals count={14} />
    </div>
  );
}

function ProductImage({ images, className, onClick, zoomable = false, alt = "" }) {
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
          alt={alt}
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

  useEffect(() => {
    if (!product) return;
    const previousTitle = document.title;
    const previousPath = window.location.pathname;
    const slug = product.slug || product.id;

    document.title = `${product.name} — DreamValleyTCG`;
    const metaDesc = document.querySelector('meta[name="description"]');
    const previousDesc = metaDesc ? metaDesc.getAttribute("content") : null;
    if (metaDesc) {
      metaDesc.setAttribute("content", (product.text || "").slice(0, 155).replace(/\s+/g, " "));
    }

    if (previousPath !== `/produit/${slug}`) {
      window.history.pushState({}, "", `/produit/${slug}`);
    }

    return () => {
      document.title = previousTitle;
      if (metaDesc && previousDesc !== null) metaDesc.setAttribute("content", previousDesc);
      if (window.location.pathname.startsWith("/produit/")) {
        window.history.pushState({}, "", "/#catalogue");
      }
    };
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
          <X size={26} color={colors.ink} />
        </button>

        <div
          className="relative w-full transition-transform duration-700"
          style={{
            height: "min(600px, 78vh)",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden border-2 flex flex-col"
            style={{ backfaceVisibility: "hidden", borderColor: colors.goldBright, backgroundColor: colors.parchmentSoft }}
          >
            <div className="relative flex-1 min-h-0">
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
                    <ArrowRight size={14} color={colors.ink} style={{ transform: "rotate(180deg)" }} />
                  </button>
                  <button onClick={nextImg} aria-label="Image suivante" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(13,27,42,0.6)" }}>
                    <ArrowRight size={14} color={colors.ink} />
                  </button>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {images.map((_, i) => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i === index ? colors.goldBright : "rgba(240,236,224,0.4)" }} />
                    ))}
                  </div>
                </>
              )}

              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px]" style={{ ...mono, backgroundColor: "rgba(13,27,42,0.7)", color: colors.tealGlow, letterSpacing: "0.06em" }}>
                {product.tag}
              </div>

              <button
                onClick={() => setFlipped(true)}
                className="absolute top-3 right-3 z-10 rounded-full px-3 py-1.5 text-xs font-semibold shadow-md"
                style={{ backgroundColor: "rgba(13,27,42,0.75)", color: colors.ink }}
              >
                Voir détails
              </button>
            </div>

            <div className="p-5" style={{ backgroundColor: colors.parchmentSoft }}>
              <p className="line-clamp-2" style={{ ...display, color: colors.ink, fontSize: "19px" }}>{product.name}</p>

              {!product.soon && (
                <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                  <span className="font-semibold" style={{ ...display, color: colors.ink, fontSize: "18px" }}>{Number(product.price).toFixed(2)} €</span>
                  {outOfStock ? (
                    <span className="text-xs font-semibold" style={{ color: "#e08a7d" }}>Rupture de stock</span>
                  ) : cart[product.id] ? (
                    <div className="flex items-center gap-3">
                      <button onClick={() => removeFromCart(product.id)} className="w-7 h-7 rounded-full border font-bold" style={{ borderColor: colors.ink, color: colors.ink }}>−</button>
                      <span style={mono}>{cart[product.id]}</span>
                      <button onClick={() => addToCart(product.id)} disabled={remainingStock(product.id) <= 0} className="w-7 h-7 rounded-full border font-bold disabled:opacity-40" style={{ borderColor: colors.ink, color: colors.ink }}>+</button>
                    </div>
                  ) : (
                    <button onClick={() => addToCart(product.id)} className="rounded-full px-4 py-2 text-xs font-semibold" style={{ backgroundColor: colors.goldBright, color: colors.bark }}>
                      Ajouter au panier
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div
            className="absolute inset-0 rounded-2xl overflow-hidden border-2 flex flex-col"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderColor: colors.goldBright, backgroundColor: colors.parchmentSoft }}
          >
            <button
              onClick={() => setFlipped(false)}
              className="absolute top-3 right-3 z-10 rounded-full px-3 py-1.5 text-xs font-semibold shadow-md"
              style={{ backgroundColor: colors.goldBright, color: colors.bark }}
            >
              ← Voir la photo
            </button>

            <div className="flex-1 overflow-y-auto p-6 pr-32">
              <span className="text-xs uppercase" style={{ ...mono, color: colors.gold, letterSpacing: "0.1em" }}>{product.tag}</span>
              <h3 className="mt-1.5" style={{ ...display, color: colors.ink, fontSize: "22px" }}>{product.name}</h3>
              <p className="mt-3 text-sm leading-relaxed whitespace-pre-line" style={{ color: colors.ink, opacity: 0.78 }}>{product.text}</p>

              {product.specs && product.specs.length > 0 && (
                <ul className="mt-4 space-y-1.5 border-t pt-4" style={{ borderColor: "rgba(240,236,224,0.15)" }}>
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
              <div className="p-5 border-t flex items-center justify-between gap-3" style={{ borderColor: "rgba(240,236,224,0.15)", backgroundColor: colors.bark }}>
                <span className="font-semibold" style={{ ...display, color: colors.ink, fontSize: "20px" }}>{Number(product.price).toFixed(2)} €</span>
                {outOfStock ? (
                  <span className="text-xs font-semibold" style={{ color: "#e08a7d" }}>Rupture de stock</span>
                ) : cart[product.id] ? (
                  <div className="flex items-center gap-3">
                    <button onClick={() => removeFromCart(product.id)} className="w-8 h-8 rounded-full border font-bold" style={{ borderColor: colors.ink, color: colors.ink }}>−</button>
                    <span style={mono}>{cart[product.id]}</span>
                    <button onClick={() => addToCart(product.id)} disabled={remainingStock(product.id) <= 0} className="w-8 h-8 rounded-full border font-bold disabled:opacity-40" style={{ borderColor: colors.ink, color: colors.ink }}>+</button>
                  </div>
                ) : (
                  <button onClick={() => addToCart(product.id)} className="rounded-full px-5 py-2.5 text-sm font-semibold" style={{ backgroundColor: colors.goldBright, color: colors.bark }}>
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

const CartContext = createContext(null);
const useCart = () => useContext(CartContext);

function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("dv_cart");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [stock, setStock] = useState({});
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(CATEGORIES);
  const [activeCategory, setActiveCategory] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    try {
      localStorage.setItem("dv_cart", JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    fetch(`${CHECKOUT_API_URL}/api/stock`).then((r) => r.json()).then(setStock).catch(() => {});
    fetch(`${CHECKOUT_API_URL}/api/products`).then((r) => r.json()).then(setProducts).catch(() => {});
    fetch(`${CHECKOUT_API_URL}/api/categories`).then((r) => r.json()).then(setCategories).catch(() => {});
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

  const removeItemCompletely = (id) =>
    setCart((c) => {
      const next = { ...c };
      delete next[id];
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
      value={{ cart, cartItems, totalCount, total, addToCart, removeFromCart, removeItemCompletely, drawerOpen, setDrawerOpen, checkout, status, isOutOfStock, remainingStock, products, categories, activeCategory, setActiveCategory }}
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

const socialIconProps = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" };

function IconInstagram(props) {
  return (
    <svg {...socialIconProps} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconTikTok(props) {
  return (
    <svg {...socialIconProps} {...props}>
      <path d="M14 3v10.8a3.3 3.3 0 1 1-3.3-3.3" />
      <path d="M14 3c0 2.6 2.1 4.7 4.7 4.7" />
    </svg>
  );
}
function IconDiscord(props) {
  return (
    <svg {...socialIconProps} {...props}>
      <rect x="3" y="7.5" width="18" height="11" rx="5.5" />
      <path d="M8 7.5c0-2.2 1.8-4 4-4s4 1.8 4 4" />
      <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconVinted(props) {
  return (
    <svg {...socialIconProps} {...props}>
      <circle cx="12" cy="5" r="1.3" />
      <path d="M12 6.3v1.4" />
      <path d="M12 7.7c-4.5 2.6-8 5-8 7.3 0 1.1 3.6 2 8 2s8-.9 8-2c0-2.3-3.5-4.7-8-7.3Z" />
    </svg>
  );
}
function IconWhatnot(props) {
  return (
    <svg {...socialIconProps} {...props}>
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M10.5 12.5v4l3.5-2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconCardmarket(props) {
  return (
    <svg {...socialIconProps} {...props}>
      <rect x="8" y="3.3" width="11" height="15" rx="2" transform="rotate(9 13.5 11)" fill="currentColor" fillOpacity="0.12" />
      <rect x="5" y="5" width="11" height="15" rx="2" />
      <path d="M7.7 10.5h5.6M7.7 13.3h5.6M7.7 16.1h3.2" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { name: "Instagram", Icon: IconInstagram, href: "https://www.instagram.com/dreamvalleytcg/" },
  { name: "TikTok", Icon: IconTikTok, href: "https://www.tiktok.com/@dreamvalleytcg" },
  { name: "Discord", Icon: IconDiscord, href: "https://discord.gg/pNv9xPKGwV" },
  { name: "Vinted", Icon: IconVinted, href: "" },
  { name: "Whatnot", Icon: IconWhatnot, href: "https://www.whatnot.com/fr-FR/user/dreavalleytcg" },
  { name: "Cardmarket", Icon: IconCardmarket, href: "https://www.cardmarket.com/fr/Pokemon/Users/DreamValleytcg" },
];

function NavBar() {
  const { totalCount, setDrawerOpen } = useCart();

  const CartButton = ({ withLabel = true }) => (
    <button onClick={() => setDrawerOpen(true)} className="relative flex flex-col items-center gap-1 px-1.5 py-1 rounded-lg shrink-0" style={{ color: colors.ink }} aria-label="Ouvrir le panier">
      <ShoppingBag size={20} />
      {withLabel && <span className="text-[9px] sm:text-[10px] font-semibold leading-none" style={mono}>Panier</span>}
      {totalCount > 0 && (
        <span
          className="absolute -top-1 -right-1 text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold"
          style={{ backgroundColor: colors.goldBright, color: colors.bark }}
        >
          {totalCount}
        </span>
      )}
    </button>
  );

  return (
    <header className="sticky top-0 z-20 backdrop-blur border-b" style={{ backgroundColor: "rgba(13,27,42,0.92)", borderColor: "rgba(240,236,224,0.12)" }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-6 py-3">
        <a href="#top" className="flex items-center shrink-0">
          <img src="/favicon-logo.png" alt="DreamValleyTCG" className="h-14 sm:h-16 w-auto" />
        </a>

        {/* Desktop : icônes + libellés inline, inchangé */}
        <div className="hidden sm:flex items-end gap-3 flex-wrap justify-end">
          <a href="/avis" className="flex flex-col items-center gap-1 px-1.5 py-1 rounded-lg transition-colors no-underline" style={{ color: colors.ink }}>
            <Star width={20} height={20} />
            <span className="text-[10px] font-semibold leading-none whitespace-nowrap" style={mono}>Avis</span>
          </a>
          <a href="/cours-des-cartes" className="flex flex-col items-center gap-1 px-1.5 py-1 rounded-lg transition-colors no-underline" style={{ color: colors.ink }}>
            <TrendingUp width={20} height={20} />
            <span className="text-[10px] font-semibold leading-none whitespace-nowrap" style={mono}>Cours</span>
          </a>
          {SOCIAL_LINKS.filter((s) => s.href).map(({ name, Icon, href }) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 px-1.5 py-1 rounded-lg transition-colors no-underline" style={{ color: colors.ink }}>
              <Icon width={20} height={20} />
              <span className="text-[10px] font-semibold leading-none whitespace-nowrap" style={mono}>{name}</span>
            </a>
          ))}
          <CartButton />
        </div>

        {/* Mobile : seul le panier reste sur la rangée principale */}
        <div className="flex sm:hidden">
          <CartButton withLabel={false} />
        </div>
      </div>

      {/* Mobile : bande d'icônes dédiée, défilement horizontal */}
      <div className="sm:hidden border-t overflow-x-auto" style={{ borderColor: "rgba(240,236,224,0.1)" }}>
        <div className="flex items-center gap-4 px-5 py-2 whitespace-nowrap">
          <a href="/avis" className="flex flex-col items-center gap-1 shrink-0 no-underline" style={{ color: colors.ink }}>
            <Star width={19} height={19} />
            <span className="text-[9px] font-semibold leading-none" style={mono}>Avis</span>
          </a>
          <a href="/cours-des-cartes" className="flex flex-col items-center gap-1 shrink-0 no-underline" style={{ color: colors.ink }}>
            <TrendingUp width={19} height={19} />
            <span className="text-[9px] font-semibold leading-none" style={mono}>Cours</span>
          </a>
          {SOCIAL_LINKS.filter((s) => s.href).map(({ name, Icon, href }) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 shrink-0 no-underline" style={{ color: colors.ink }}>
              <Icon width={19} height={19} />
              <span className="text-[9px] font-semibold leading-none" style={mono}>{name}</span>
            </a>
          ))}
        </div>
      </div>

      <CategoryBar />
    </header>
  );
}

function CategoryBar() {
  const { categories, activeCategory, setActiveCategory } = useCart();

  function selectCategory(cat) {
    setActiveCategory(cat);
    const el = document.getElementById("catalogue");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="border-t overflow-x-auto" style={{ borderColor: "rgba(240,236,224,0.1)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6 flex items-center gap-2 py-2.5 whitespace-nowrap">
        <button
          onClick={() => selectCategory(null)}
          className="px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors"
          style={
            activeCategory === null
              ? { backgroundColor: colors.goldBright, color: colors.bark }
              : { backgroundColor: "transparent", color: colors.ink, border: "1px solid rgba(240,236,224,0.25)" }
          }
        >
          Tout
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => selectCategory(cat)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors"
            style={
              activeCategory === cat
                ? { backgroundColor: colors.goldBright, color: colors.bark }
                : { backgroundColor: "transparent", color: colors.ink, border: "1px solid rgba(240,236,224,0.25)" }
            }
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

function CartDrawer() {
  const { cartItems, totalCount, total, addToCart, removeFromCart, removeItemCompletely, drawerOpen, setDrawerOpen, checkout, status, remainingStock } = useCart();

  return (
    <>
      {drawerOpen && <div className="fixed inset-0 z-30" style={{ backgroundColor: "rgba(13,27,42,0.6)" }} onClick={() => setDrawerOpen(false)} />}
      <aside
        className="fixed top-0 right-0 h-full z-40 flex flex-col transition-transform duration-300"
        style={{
          width: "min(420px, 100vw)",
          backgroundColor: colors.parchmentSoft,
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          boxShadow: drawerOpen ? "-8px 0 24px rgba(13,27,42,0.4)" : "none",
        }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "rgba(240,236,224,0.12)" }}>
          <h3 style={{ ...display, color: colors.ink, fontSize: "20px" }}>Ton panier</h3>
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
              <div key={item.id} className="flex items-center gap-3 py-4 border-b" style={{ borderColor: "rgba(240,236,224,0.08)" }}>
                <ProductImage images={item.images} className="w-14 h-14 rounded-lg shrink-0" alt={item.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: colors.ink }}>{item.name}</p>
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
                  <button
                    onClick={() => removeItemCompletely(item.id)}
                    aria-label={`Retirer ${item.name} du panier`}
                    className="w-6 h-6 rounded-full flex items-center justify-center ml-1"
                    style={{ color: "#e08a7d" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="px-6 py-5 border-t" style={{ borderColor: "rgba(240,236,224,0.12)" }}>
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: colors.ink, opacity: 0.7 }} className="text-sm">Total ({totalCount} article{totalCount > 1 ? "s" : ""})</span>
              <span style={{ ...display, color: colors.ink, fontSize: "20px" }}>{total.toFixed(2)} €</span>
            </div>
            <button
              onClick={checkout}
              disabled={status === "loading"}
              className="w-full rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
              style={{ backgroundColor: colors.goldBright, color: colors.bark }}
            >
              {status === "loading" ? "Redirection..." : "Payer en sécurité"}
            </button>
            {status === "error" && (
              <p className="mt-3 text-xs" style={{ color: "#e08a7d" }}>Une erreur est survenue, réessaie dans un instant.</p>
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
          <Eyebrow>DreamValleyTCG — Boutique professionnelle</Eyebrow>
        </Reveal>
        <Reveal delay={180}>
          <h1 className="mt-4 max-w-xl" style={{ ...display, fontWeight: 600, fontSize: "clamp(38px,6vw,64px)", lineHeight: 1.08, color: colors.ink }}>
            DreamValleyTCG, là où <span style={{ fontStyle: "italic", color: colors.tealGlow, fontWeight: 500 }}>commence</span> votre aventure.
          </h1>
        </Reveal>
        <Reveal delay={260}>
          <p className="mt-5 max-w-md text-lg" style={{ color: colors.ink, opacity: 0.8 }}>
            Nous sommes un couple passionné par l'univers des cartes à collectionner. Que vous soyez collectionneur ou joueur invétéré, DreamValleyTCG vous accompagne dans votre quête de cartes et de souvenirs uniques.
          </p>
        </Reveal>
        <Reveal delay={340}>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#catalogue" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold no-underline transition-transform hover:-translate-y-0.5" style={{ backgroundColor: colors.goldBright, color: colors.bark }}>
              Voir le catalogue
            </a>
            <a href="https://discord.gg/pNv9xPKGwV" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold no-underline border-2 transition-transform hover:-translate-y-0.5" style={{ borderColor: colors.ink, color: colors.ink }}>
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
    { icon: Check, title: "Produits officiels", text: "Produits 100 % officiels, préparés avec soin, contrôlés puis expédiés sous 2 jours ouvrés." },
    { icon: ShieldCheck, title: "Transparence totale", text: "Une question, un doute ? Pose-la sur notre Discord, on te répond en toute transparence." },
    { icon: Users, title: "Notre communauté avant tout", text: "Plus vous commandez, plus vous progressez avec nous — jusqu'à débloquer des réductions fidélité." },
    { icon: Bell, title: "Avant-première sur Discord", text: "Chaque nouveauté est annoncée sur le Discord avant sa mise en ligne sur le site — tu es toujours prévenu en premier." }
  ];
  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
      <Reveal>
        <div className="max-w-xl mb-12">
          <Eyebrow>Nos ambitions, vos rêves</Eyebrow>
          <h2 className="mt-3" style={{ ...display, fontSize: "clamp(28px,4vw,38px)", color: colors.ink }}>Nos principes</h2>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
        {items.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 100}>
            <div className="rounded-2xl p-7 border h-full transition-transform hover:-translate-y-1" style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(240,236,224,0.1)" }}>
              <Icon size={28} color={colors.goldBright} strokeWidth={2.2} />
              <h3 className="mt-4 text-lg font-semibold" style={{ color: colors.ink }}>{title}</h3>
              <p className="mt-2 text-sm" style={{ color: colors.ink, opacity: 0.72 }}>{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CatalogueCard({ p, onOpenModal }) {
  const { cart, addToCart, removeFromCart, isOutOfStock, remainingStock } = useCart();
  const [flipped, setFlipped] = useState(false);
  const outOfStock = !p.soon && isOutOfStock(p.id);

  const CartControls = ({ size = "normal" }) =>
    p.soon ? (
      <span className="w-fit rounded-md border border-dashed px-2.5 py-1 text-[11px]" style={{ ...mono, color: colors.moss, borderColor: colors.moss }}>
        En préparation
      </span>
    ) : (
      <div className="flex items-center justify-between gap-3 flex-wrap" onClick={(e) => e.stopPropagation()}>
        <span className="font-semibold" style={{ ...display, color: colors.ink, fontSize: size === "small" ? "16px" : "18px" }}>{p.price.toFixed(2)} €</span>
        {outOfStock ? (
          <span className="text-xs font-semibold" style={{ color: "#e08a7d" }}>Rupture de stock</span>
        ) : cart[p.id] ? (
          <div className="flex items-center gap-3">
            <button onClick={() => removeFromCart(p.id)} className="w-7 h-7 rounded-full border font-bold" style={{ borderColor: colors.ink, color: colors.ink }}>−</button>
            <span style={mono}>{cart[p.id]}</span>
            <button onClick={() => addToCart(p.id)} disabled={remainingStock(p.id) <= 0} className="w-7 h-7 rounded-full border font-bold disabled:opacity-40" style={{ borderColor: colors.ink, color: colors.ink }}>+</button>
          </div>
        ) : (
          <button onClick={() => addToCart(p.id)} className="rounded-full px-4 py-2 text-xs font-semibold transition-transform hover:-translate-y-0.5" style={{ backgroundColor: colors.goldBright, color: colors.bark }}>
            Ajouter au panier
          </button>
        )}
      </div>
    );

  return (
    <div className="relative w-full" style={{ height: "700px", perspective: "1500px" }}>
      <div
        className="relative w-full transition-transform duration-700"
        style={{ height: "700px", transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div
          className="absolute inset-0 rounded-2xl border flex flex-col overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
          style={{ backfaceVisibility: "hidden", backgroundColor: colors.parchmentSoft, borderColor: "rgba(240,236,224,0.1)", opacity: p.soon ? 0.75 : 1 }}
          onClick={() => onOpenModal(p)}
        >
          <div className="relative shrink-0">
            <ProductImage images={p.images} className="w-full h-[440px] sm:h-[460px]" zoomable alt={p.name} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(true);
              }}
              className="absolute top-3 right-3 z-10 rounded-full px-3 py-1.5 text-xs font-semibold shadow-md"
              style={{ backgroundColor: "rgba(13,27,42,0.8)", color: colors.ink }}
            >
              Voir détails
            </button>
          </div>
          <span className="px-6 pt-4 text-xs uppercase" style={{ ...mono, color: colors.gold, letterSpacing: "0.1em" }}>{p.tag}</span>
          <h3 className="px-6 pt-1.5 text-xl" style={{ ...display, color: colors.ink }}>{p.name}</h3>
          <p className="px-6 pt-1.5 text-sm line-clamp-2 whitespace-pre-line" style={{ color: colors.ink, opacity: 0.7 }}>{p.text}</p>

          <div className="px-6 pb-5 pt-3">
            <CartControls />
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-2xl border flex flex-col overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", backgroundColor: colors.parchmentSoft, borderColor: colors.goldBright }}
        >
          <button
            onClick={() => setFlipped(false)}
            className="absolute top-3 right-3 z-10 rounded-full px-3 py-1.5 text-xs font-semibold shadow-md"
            style={{ backgroundColor: colors.goldBright, color: colors.bark }}
          >
            ← Retour
          </button>

          <div className="flex-1 overflow-y-auto p-6 pr-24">
            <span className="text-xs uppercase" style={{ ...mono, color: colors.gold, letterSpacing: "0.1em" }}>{p.tag}</span>
            <h3 className="mt-1.5" style={{ ...display, color: colors.ink, fontSize: "20px" }}>{p.name}</h3>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line" style={{ color: colors.ink, opacity: 0.75 }}>{p.text}</p>

            {p.specs && p.specs.length > 0 && (
              <ul className="mt-4 space-y-1.5 border-t pt-4" style={{ borderColor: "rgba(240,236,224,0.12)" }}>
                {p.specs.map((s) => (
                  <li key={s.label} className="flex items-center justify-between gap-3 text-xs">
                    <span style={{ ...mono, color: colors.moss, letterSpacing: "0.03em" }}>{s.label}</span>
                    <span style={{ color: colors.ink, opacity: 0.85, textAlign: "right" }}>{s.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-5 border-t" style={{ borderColor: "rgba(240,236,224,0.12)", backgroundColor: colors.bark }}>
            <CartControls size="small" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Catalogue() {
  const { products, activeCategory, categories } = useCart();
  const [activeProduct, setActiveProduct] = useState(null);

  useEffect(() => {
    if (products.length === 0) return;
    const match = window.location.pathname.match(/^\/produit\/([a-z0-9-]+)\/?$/);
    if (match) {
      const found = products.find((p) => p.slug === match[1] || p.id === match[1]);
      if (found) setActiveProduct(found);
    }
  }, [products]);

  const filtered = activeCategory ? products.filter((p) => p.category === activeCategory) : products;
  const isEmptyCategory = activeCategory && products.length > 0 && filtered.length === 0;

  return (
    <section id="catalogue" className="py-16 sm:py-20" style={{ backgroundColor: colors.parchment }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <Reveal>
          <div className="max-w-xl mb-9 sm:mb-11">
            <Eyebrow>{activeCategory || "Ce que l'on propose"}</Eyebrow>
            <h2 className="mt-3" style={{ ...display, fontSize: "clamp(26px,4vw,38px)", color: colors.ink }}>
              {activeCategory ? activeCategory : "Le catalogue, en bref."}
            </h2>
          </div>
        </Reveal>

        {products.length === 0 && (
          <p className="text-sm" style={{ color: colors.ink, opacity: 0.6 }}>Chargement du catalogue...</p>
        )}

        {isEmptyCategory && (
          <Reveal>
            <div className="rounded-2xl border border-dashed p-10 text-center" style={{ borderColor: colors.moss, backgroundColor: colors.parchmentSoft }}>
              <p style={{ ...display, color: colors.ink, fontSize: "22px" }}>Bientôt disponible</p>
              <p className="mt-2 text-sm max-w-md mx-auto" style={{ color: colors.ink, opacity: 0.7 }}>
                Les {activeCategory?.toLowerCase()} arrivent prochainement — reviens jeter un œil bientôt, ou rejoins le Discord pour être prévenu en avant-première.
              </p>
            </div>
          </Reveal>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 100}>
              <CatalogueCard p={p} onOpenModal={setActiveProduct} />
            </Reveal>
          ))}
        </div>
      </div>

      <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
    </section>
  );
}

function Testimonials() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${CHECKOUT_API_URL}/api/reviews`)
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => {});
  }, []);

  if (reviews.length === 0) return null;
  const featured = reviews.slice(0, 3);

  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-6 py-16 sm:py-20">
      <Reveal>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <Eyebrow>Ce que dit la communauté</Eyebrow>
            <h2 className="mt-3" style={{ ...display, fontSize: "clamp(28px,4vw,38px)", color: colors.ink }}>Ils nous font confiance.</h2>
          </div>
          <a href="/avis" className="text-sm font-semibold underline no-underline" style={{ color: colors.moss }}>Voir tous les avis →</a>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
        {featured.map((r, i) => (
          <Reveal key={r.id} delay={i * 100}>
            <div className="rounded-2xl p-6 border h-full flex flex-col" style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(240,236,224,0.1)" }}>
              <StarRating rating={r.rating} size={14} />
              <p className="mt-3 text-sm line-clamp-4 flex-1" style={{ color: colors.ink, opacity: 0.8 }}>{r.text}</p>
              <p className="mt-4 text-xs font-semibold" style={{ ...mono, color: colors.gold }}>{r.author}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Community() {
  const links = [
    { name: "Discord", role: "Communauté & annonces", href: "https://discord.gg/pNv9xPKGwV" },
    { name: "Whatnot", role: "Lives & ventes en direct", href: "https://www.whatnot.com/fr-FR/user/dreavalleytcg" },
    { name: "Cardmarket", role: "Vente à l'unité", href: "https://www.cardmarket.com/fr/Pokemon/Users/DreamValleytcg" },
    { name: "Instagram", role: "Coulisses & annonces", href: "https://www.instagram.com/dreamvalleytcg/" },
    { name: "TikTok", role: "Actu & curation TCG", href: "https://www.tiktok.com/@dreamvalleytcg" },
    { name: "Contact", role: "Une question, un partenariat", href: "mailto:dreamvalleyspcli@gmail.com" },
  ];
  return (
    <section id="communaute" className="py-16 sm:py-20" style={{ backgroundColor: colors.bark }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <Reveal>
          <Eyebrow dark>Où nous retrouver</Eyebrow>
          <h2 className="mt-3 max-w-md" style={{ ...display, fontSize: "clamp(28px,4vw,38px)", color: colors.ink }}>La boutique ne dort jamais sur une seule plateforme.</h2>
          <p className="mt-4 max-w-lg" style={{ color: colors.ink, opacity: 0.72 }}>Chaque canal a un rôle précis — des lives aux échanges quotidiens avec la communauté.</p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {links.filter((l) => l.href).map((l, i) => (
            <Reveal key={l.name} delay={(i % 4) * 80}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl px-5 py-4 no-underline border transition-colors hover:border-opacity-60" style={{ borderColor: "rgba(240,236,224,0.18)", color: colors.ink }}>
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
    <footer className="py-10" style={{ backgroundColor: colors.bark, borderTop: "1px solid rgba(240,236,224,0.12)" }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-start justify-between gap-4">
        <span style={{ ...display, fontStyle: "italic", fontWeight: 600, color: colors.ink }}>DreamValleyTCG</span>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <a href="/mentions-legales" className="text-xs no-underline" style={{ color: "rgba(240,236,224,0.7)" }}>
            Mentions légales · CGV · Confidentialité
          </a>
          <p className="max-w-md text-xs leading-relaxed" style={{ color: "rgba(240,236,224,0.5)" }}>
            Revendeur indépendant de produits Pokémon TCG scellés. Aucune affiliation avec The Pokémon Company, Nintendo, Game Freak ou Asmodée. © 2026 DreamValleyTCG.
          </p>
        </div>
      </div>
    </footer>
  );
}

const QUICK_LINKS = [
  { name: "Stripe", role: "Paiements & remboursements", Icon: CreditCard, href: "https://dashboard.stripe.com" },
  { name: "Cloudflare", role: "Site, API, stock, images", Icon: Cloud, href: "https://dash.cloudflare.com" },
  { name: "GitHub", role: "Code source du site", Icon: Code2, href: "https://github.com/dreamvalleyspcli-boop/dreamvalley-site" },
  { name: "Google Search Console", role: "Référencement", Icon: Search, href: "https://search.google.com/search-console" },
  { name: "Gmail", role: "Boîte mail pro", Icon: Mail, href: "https://mail.google.com" },
  { name: "Discord", role: "Communauté", Icon: IconDiscord, href: "https://discord.gg/pNv9xPKGwV" },
  { name: "Instagram", role: "Réseau social", Icon: IconInstagram, href: "https://www.instagram.com/dreamvalleytcg/" },
  { name: "TikTok", role: "Réseau social", Icon: IconTikTok, href: "https://www.tiktok.com/@dreamvalleytcg" },
  { name: "Whatnot", role: "Ventes en direct", Icon: IconWhatnot, href: "https://www.whatnot.com/fr-FR/user/dreavalleytcg" },
  { name: "Cardmarket", role: "Vente à l'unité", Icon: IconCardmarket, href: "https://www.cardmarket.com/fr/Pokemon/Users/DreamValleytcg" },
  { name: "Mondial Relay Pro", role: "Étiquettes d'envoi", Icon: Truck, href: "https://www.mondialrelay.fr" },
  { name: "Chronopost Pro", role: "Étiquettes d'envoi", Icon: Truck, href: "https://www.chronopost.fr" },
];

function QuickLinks() {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold mb-3" style={{ color: colors.ink }}>Liens rapides</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {QUICK_LINKS.map(({ name, role, Icon, href }) => (
          <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 no-underline border transition-colors hover:border-opacity-60" style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(240,236,224,0.12)" }}>
            <span className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.bark }}>
              <Icon size={16} color={colors.goldBright} />
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-semibold truncate" style={{ color: colors.ink }}>{name}</span>
              <span className="block text-[10px] truncate" style={{ ...mono, color: colors.moss }}>{role}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

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
  const [newImageUrl, setNewImageUrl] = useState("");
  const [form, setForm] = useState({ name: "", price: "", weight: "", tag: "", text: "", images: [], specsText: "", soon: false, category: "Produits Chinois" });

  function moveImage(index, direction) {
    setForm((f) => {
      const images = [...f.images];
      const target = index + direction;
      if (target < 0 || target >= images.length) return f;
      [images[index], images[target]] = [images[target], images[index]];
      return { ...f, images };
    });
  }

  function removeImage(index) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  }

  function addImageUrl() {
    const url = newImageUrl.trim();
    if (!url) return;
    setForm((f) => ({ ...f, images: [...f.images, url] }));
    setNewImageUrl("");
  }

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
        setForm((f) => ({ ...f, images: [...f.images, ...data.urls] }));
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
      weight: String(p.weight ?? ""),
      tag: p.tag || "",
      text: p.text || "",
      images: [...(p.images || [])],
      specsText: (p.specs || []).map((s) => `${s.label}: ${s.value}`).join("\n"),
      soon: !!p.soon,
      category: p.category || "Produits Chinois",
    });
    setEditingId(p.id);
    setAddError("");
    setShowAddForm(true);
  }

  function resetForm() {
    setForm({ name: "", price: "", weight: "", tag: "", text: "", images: [], specsText: "", soon: false, category: "Produits Chinois" });
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

      const endpoint = editingId ? "/api/admin/products/edit" : "/api/admin/products/add";
      const payload = {
        name: form.name.trim(),
        price: form.price,
        weight: form.weight,
        tag: form.tag.trim(),
        text: form.text.trim(),
        images: form.images,
        specs,
        soon: form.soon,
        category: form.category,
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
          <a href="/" className="inline-flex items-center gap-1.5 text-sm no-underline mb-4" style={{ color: colors.ink, opacity: 0.7 }}>
            <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Retour au site
          </a>
          <form onSubmit={handleLogin} className="p-8 rounded-2xl" style={{ backgroundColor: colors.parchmentSoft }}>
            <div className="flex items-center gap-2 mb-6">
              <Lock size={20} color={colors.ink} />
              <h1 style={{ ...display, color: colors.ink, fontSize: "22px" }}>Administration</h1>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="w-full px-4 py-3 rounded-lg border mb-4"
              style={{ borderColor: "rgba(240,236,224,0.25)", backgroundColor: colors.parchment, color: colors.ink }}
            />
            {error && <p className="text-sm mb-4" style={{ color: "#e08a7d" }}>{error}</p>}
            <button type="submit" className="w-full rounded-full px-6 py-3 text-sm font-semibold" style={{ backgroundColor: colors.goldBright, color: colors.bark }}>
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

        <QuickLinks />

        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <h1 style={{ ...display, color: colors.ink, fontSize: "28px" }}>Catalogue & stock</h1>
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
            style={{ backgroundColor: colors.goldBright, color: colors.bark }}
          >
            <Plus size={14} /> {showAddForm ? "Annuler" : "Ajouter un produit"}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmitProduct} className="mb-8 p-6 rounded-xl border space-y-3" style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(240,236,224,0.15)" }}>
            <p className="text-sm font-semibold" style={{ color: colors.ink }}>
              {editingId ? "Modifier le produit" : "Nouveau produit"}
            </p>
            <input placeholder="Nom du produit *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(240,236,224,0.25)", backgroundColor: colors.parchment, color: colors.ink }} />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(240,236,224,0.25)", backgroundColor: colors.parchment, color: colors.ink }}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex gap-3 flex-wrap">
              <input placeholder="Prix (ex: 12.90 ou 12,90)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} disabled={form.soon} className="flex-1 min-w-[140px] px-3 py-2 rounded-lg border disabled:opacity-50" style={{ borderColor: "rgba(240,236,224,0.25)", backgroundColor: colors.parchment, color: colors.ink }} />
              <input placeholder="Poids en grammes (ex: 1400)" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="flex-1 min-w-[160px] px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(240,236,224,0.25)", backgroundColor: colors.parchment, color: colors.ink }} />
              <input placeholder="Étiquette (ex: Scellé — à l'unité)" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="flex-[2] min-w-[200px] px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(240,236,224,0.25)", backgroundColor: colors.parchment, color: colors.ink }} />
            </div>
            <textarea placeholder={"Description (utilise Entrée pour aller à la ligne, ex: séparer les points par des retours à la ligne)"} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(240,236,224,0.25)", backgroundColor: colors.parchment, color: colors.ink }} />

            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: colors.ink }}>
                Photos ({form.images.length}) — la première sera l'image principale
              </label>

              {form.images.length > 0 && (
                <div className="space-y-2 mb-3">
                  {form.images.map((url, i) => (
                    <div key={`${url}-${i}`} className="flex items-center gap-2 p-2 rounded-lg border" style={{ borderColor: "rgba(240,236,224,0.2)", backgroundColor: colors.parchment }}>
                      <div className="w-12 h-12 rounded-md overflow-hidden shrink-0" style={{ backgroundColor: colors.bark }}>
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs flex-1 truncate" style={{ ...mono, color: colors.moss }}>{url}</span>
                      <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="w-6 h-6 rounded flex items-center justify-center disabled:opacity-30" style={{ color: colors.ink }} aria-label="Monter">
                        <ChevronUp size={16} />
                      </button>
                      <button type="button" onClick={() => moveImage(i, 1)} disabled={i === form.images.length - 1} className="w-6 h-6 rounded flex items-center justify-center disabled:opacity-30" style={{ color: colors.ink }} aria-label="Descendre">
                        <ChevronDown size={16} />
                      </button>
                      <button type="button" onClick={() => removeImage(i)} className="w-6 h-6 rounded flex items-center justify-center" style={{ color: "#e08a7d" }} aria-label="Retirer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full text-sm mb-2"
                style={{ color: colors.ink }}
              />
              {uploading && <p className="text-xs mb-2" style={{ color: colors.moss }}>Envoi en cours...</p>}

              <div className="flex gap-2">
                <input
                  placeholder="Ou colle une URL d'image directe"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImageUrl();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "rgba(240,236,224,0.25)", backgroundColor: colors.parchment, color: colors.ink }}
                />
                <button type="button" onClick={addImageUrl} className="rounded-lg px-3 py-2 text-xs font-semibold" style={{ backgroundColor: colors.parchment, color: colors.ink, border: "1px solid rgba(240,236,224,0.25)" }}>
                  Ajouter
                </button>
              </div>
            </div>

            <textarea
              placeholder={"Caractéristiques, une par ligne : Label: Valeur\nex: Langue: Français"}
              value={form.specsText}
              onChange={(e) => setForm({ ...form, specsText: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border"
              style={{ borderColor: "rgba(240,236,224,0.25)", backgroundColor: colors.parchment, color: colors.ink }}
            />
            <label className="flex items-center gap-2 text-sm" style={{ color: colors.ink }}>
              <input type="checkbox" checked={form.soon} onChange={(e) => setForm({ ...form, soon: e.target.checked })} />
              Produit "à venir" (pas encore en vente, sans prix ni ajout au panier)
            </label>
            {addError && <p className="text-sm" style={{ color: "#e08a7d" }}>{addError}</p>}
            <button type="submit" disabled={adding} className="rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: colors.goldBright, color: colors.bark }}>
              {adding ? "Enregistrement..." : editingId ? "Enregistrer les modifications" : "Créer le produit"}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between flex-wrap gap-3 p-5 rounded-xl border" style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(240,236,224,0.1)" }}>
              <div className="flex items-center gap-3 min-w-0">
                <ProductImage images={p.images} className="w-12 h-12 rounded-lg shrink-0" alt={p.name} />
                <div className="min-w-0">
                  <p className="font-semibold truncate" style={{ color: colors.ink }}>{p.name}</p>
                  <p className="text-xs mt-1" style={mono}>{p.soon ? "À venir" : `${Number(p.price).toFixed(2)} €`}{p.weight ? ` · ${p.weight} g` : ""}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: colors.gold }}>{p.category || "Sans catégorie"}</p>
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
                      style={{ borderColor: "rgba(240,236,224,0.25)", backgroundColor: colors.parchment, color: colors.ink }}
                      placeholder="—"
                    />
                    <button
                      onClick={() => updateStock(p.id, stock[p.id] ?? 0)}
                      disabled={saving[p.id]}
                      className="rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-60"
                      style={{ backgroundColor: colors.goldBright, color: colors.bark }}
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
                  style={{ borderColor: "#e08a7d", color: "#e08a7d" }}
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

        <ReviewsAdmin token={token} />
        <CalendarAdmin token={token} />
      </div>
    </div>
  );
}

function ReviewsAdmin({ token }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleting, setDeleting] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ author: "", rating: "5", text: "", date: "", source: "" });

  useEffect(() => {
    if (token) {
      fetch(`${CHECKOUT_API_URL}/api/reviews`).then((r) => r.json()).then(setReviews).catch(() => {});
    }
  }, [token]);

  function resetForm() {
    setForm({ author: "", rating: "5", text: "", date: "", source: "" });
    setEditingId(null);
    setError("");
  }

  function startEdit(r) {
    setForm({ author: r.author, rating: String(r.rating), text: r.text, date: r.date || "", source: r.source || "" });
    setEditingId(r.id);
    setError("");
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.author.trim() || !form.text.trim()) {
      setError("Le nom et le texte de l'avis sont requis.");
      return;
    }
    setSaving(true);
    try {
      const endpoint = editingId ? "/api/admin/reviews/edit" : "/api/admin/reviews/add";
      const payload = { author: form.author.trim(), rating: form.rating, text: form.text.trim(), date: form.date, source: form.source.trim() };
      if (editingId) payload.id = editingId;

      const res = await fetch(`${CHECKOUT_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data);
        resetForm();
        setShowForm(false);
      } else {
        setError(data.error || "Erreur lors de l'enregistrement");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Supprimer cet avis ?")) return;
    setDeleting((d) => ({ ...d, [id]: true }));
    try {
      const res = await fetch(`${CHECKOUT_API_URL}/api/admin/reviews/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
    } finally {
      setDeleting((d) => ({ ...d, [id]: false }));
    }
  }

  return (
    <div className="mt-14">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h2 style={{ ...display, color: colors.ink, fontSize: "22px" }}>Avis clients</h2>
        <button
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              resetForm();
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
          style={{ backgroundColor: colors.goldBright, color: colors.bark }}
        >
          <Plus size={14} /> {showForm ? "Annuler" : "Ajouter un avis"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 rounded-xl border space-y-3" style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(240,236,224,0.15)" }}>
          <p className="text-sm font-semibold" style={{ color: colors.ink }}>{editingId ? "Modifier l'avis" : "Nouvel avis"}</p>
          <div className="flex gap-3 flex-wrap">
            <input placeholder="Nom du client *" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="flex-1 min-w-[160px] px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(240,236,224,0.25)", backgroundColor: colors.parchment, color: colors.ink }} />
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(240,236,224,0.25)", backgroundColor: colors.parchment, color: colors.ink }}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} étoile{n > 1 ? "s" : ""}</option>
              ))}
            </select>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(240,236,224,0.25)", backgroundColor: colors.parchment, color: colors.ink }} />
          </div>
          <input placeholder="Source (ex: Vinted, Whatnot, Discord) — facultatif" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(240,236,224,0.25)", backgroundColor: colors.parchment, color: colors.ink }} />
          <textarea placeholder="Colle ici le texte de l'avis *" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={4} className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: "rgba(240,236,224,0.25)", backgroundColor: colors.parchment, color: colors.ink }} />
          {error && <p className="text-sm" style={{ color: "#e08a7d" }}>{error}</p>}
          <button type="submit" disabled={saving} className="rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: colors.goldBright, color: colors.bark }}>
            {saving ? "Enregistrement..." : editingId ? "Enregistrer les modifications" : "Ajouter l'avis"}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="flex items-start justify-between flex-wrap gap-3 p-4 rounded-xl border" style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(240,236,224,0.1)" }}>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm" style={{ color: colors.ink }}>{r.author}</span>
                <StarRating rating={r.rating} size={13} />
                {r.source && <span className="text-[10px]" style={{ ...mono, color: colors.gold }}>{r.source}</span>}
              </div>
              <p className="text-xs mt-1.5 line-clamp-2" style={{ color: colors.ink, opacity: 0.75 }}>{r.text}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => startEdit(r)} className="rounded-full px-3 py-1.5 text-xs font-semibold border" style={{ borderColor: colors.ink, color: colors.ink }}>Modifier</button>
              <button onClick={() => handleDelete(r.id)} disabled={deleting[r.id]} className="rounded-full px-3 py-1.5 text-xs font-semibold border disabled:opacity-60" style={{ borderColor: "#e08a7d", color: "#e08a7d" }}>
                {deleting[r.id] ? "..." : "Supprimer"}
              </button>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-sm" style={{ color: colors.ink, opacity: 0.6 }}>Aucun avis pour l'instant.</p>
        )}
      </div>
    </div>
  );
}

function CalendarAdmin({ token }) {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch(`${CHECKOUT_API_URL}/api/admin/calendar`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setWeeks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  function updateCell(weekIndex, dayIndex, field, value) {
    setWeeks((w) => {
      const next = [...w];
      const week = { ...next[weekIndex] };
      const days = [...week.days];
      days[dayIndex] = { ...days[dayIndex], [field]: value };
      week.days = days;
      next[weekIndex] = week;
      return next;
    });
  }

  function updateWeekTitle(weekIndex, value) {
    setWeeks((w) => {
      const next = [...w];
      next[weekIndex] = { ...next[weekIndex], title: value };
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`${CHECKOUT_API_URL}/api/admin/calendar/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ weeks }),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setWeeks(data);
        setMessage("Enregistré ✓");
      } else {
        setMessage(data.error || "Erreur");
      }
    } catch {
      setMessage("Erreur de connexion");
    } finally {
      setSaving(false);
    }
  }

  async function resetFromTemplate() {
    if (!window.confirm("Recharger le modèle du mois ? Les modifications non enregistrées seront perdues.")) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`${CHECKOUT_API_URL}/api/admin/calendar/reset`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setWeeks(data);
        setMessage("Modèle rechargé ✓");
      }
    } finally {
      setSaving(false);
    }
  }

  async function saveAsTemplate() {
    if (!window.confirm("Enregistrer la version actuelle comme modèle réutilisable chaque mois ?")) return;
    setSaving(true);
    setMessage("");
    try {
      await fetch(`${CHECKOUT_API_URL}/api/admin/calendar/save-template`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Modèle sauvegardé ✓");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm mt-14" style={{ color: colors.ink, opacity: 0.6 }}>Chargement du calendrier...</p>;
  }

  return (
    <div className="mt-14">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <h2 style={{ ...display, color: colors.ink, fontSize: "22px" }}>Calendrier de contenu</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {message && <span className="text-xs" style={{ color: colors.moss }}>{message}</span>}
          <button onClick={resetFromTemplate} disabled={saving} className="rounded-full px-4 py-2 text-xs font-semibold border disabled:opacity-60" style={{ borderColor: colors.ink, color: colors.ink }}>
            Réinitialiser depuis le modèle
          </button>
          <button onClick={saveAsTemplate} disabled={saving} className="rounded-full px-4 py-2 text-xs font-semibold border disabled:opacity-60" style={{ borderColor: colors.gold, color: colors.gold }}>
            Enregistrer comme modèle du mois
          </button>
          <button onClick={save} disabled={saving} className="rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-60" style={{ backgroundColor: colors.goldBright, color: colors.bark }}>
            {saving ? "..." : "Enregistrer"}
          </button>
        </div>
      </div>
      <p className="text-xs mb-6" style={{ color: colors.ink, opacity: 0.55 }}>
        Modifie librement chaque case. "Réinitialiser" recharge le modèle réutilisable ; "Enregistrer comme modèle" fige la version actuelle pour les mois suivants.
      </p>

      <div className="space-y-8">
        {weeks.map((week, wi) => (
          <div key={wi} className="rounded-xl border p-4" style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(240,236,224,0.1)" }}>
            <input
              value={week.title}
              onChange={(e) => updateWeekTitle(wi, e.target.value)}
              className="w-full mb-3 px-2.5 py-1.5 rounded-lg border text-sm font-semibold"
              style={{ borderColor: "rgba(240,236,224,0.2)", backgroundColor: colors.parchment, color: colors.ink }}
            />
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th className="text-left p-1.5" style={{ color: colors.moss }}>Jour</th>
                    <th className="text-left p-1.5" style={{ color: colors.moss }}>🌅 Matin</th>
                    <th className="text-left p-1.5" style={{ color: colors.moss }}>☀️ Midi</th>
                    <th className="text-left p-1.5" style={{ color: colors.moss }}>🌙 Soir</th>
                  </tr>
                </thead>
                <tbody>
                  {week.days.map((d, di) => (
                    <tr key={di}>
                      <td className="p-1.5 align-top font-semibold whitespace-nowrap" style={{ color: colors.ink }}>{d.day}</td>
                      {["morning", "midday", "evening"].map((field) => (
                        <td key={field} className="p-1.5 align-top">
                          <textarea
                            value={d[field]}
                            onChange={(e) => updateCell(wi, di, field, e.target.value)}
                            rows={2}
                            className="w-full min-w-[160px] px-2 py-1 rounded-md border text-xs resize-y"
                            style={{ borderColor: "rgba(240,236,224,0.15)", backgroundColor: colors.parchment, color: colors.ink }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

function StarRating({ rating, size = 15 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} sur 5 étoiles`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24" fill={n <= rating ? colors.goldBright : "none"} stroke={colors.goldBright} strokeWidth="1.5">
          <path d="M12 3.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6Z" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${CHECKOUT_API_URL}/api/reviews`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const average = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div style={{ backgroundColor: colors.parchment, minHeight: "100vh" }}>
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-12">
        <a href="/" className="inline-flex items-center gap-1.5 text-sm no-underline mb-8" style={{ color: colors.ink, opacity: 0.65 }}>
          <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Retour au site
        </a>

        <Eyebrow>Ce que dit la communauté</Eyebrow>
        <h1 style={{ ...display, color: colors.ink, fontSize: "clamp(28px,4vw,36px)" }} className="mt-2 mb-2">Avis clients</h1>

        {average && (
          <div className="flex items-center gap-2 mb-10">
            <StarRating rating={Math.round(average)} size={18} />
            <span className="text-sm" style={{ color: colors.ink, opacity: 0.75 }}>{average} / 5 · {reviews.length} avis</span>
          </div>
        )}

        {loading && <p className="text-sm" style={{ color: colors.ink, opacity: 0.6 }}>Chargement des avis...</p>}

        {!loading && reviews.length === 0 && (
          <div className="rounded-2xl border border-dashed p-10 text-center" style={{ borderColor: colors.moss, backgroundColor: colors.parchmentSoft }}>
            <p style={{ color: colors.ink, opacity: 0.7 }}>Aucun avis pour l'instant — les premiers arrivent bientôt !</p>
          </div>
        )}

        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border p-5" style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(240,236,224,0.1)" }}>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <span className="font-semibold text-sm" style={{ color: colors.ink }}>{r.author}</span>
                <StarRating rating={r.rating} />
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: colors.ink, opacity: 0.82 }}>{r.text}</p>
              <div className="flex items-center gap-2 mt-3">
                {r.date && <span className="text-[11px]" style={{ ...mono, color: colors.moss }}>{r.date}</span>}
                {r.source && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ ...mono, color: colors.gold, border: `1px solid ${colors.gold}` }}>{r.source}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LegalPage() {
  const Section = ({ id, title, children }) => (
    <div id={id} className="mb-12 scroll-mt-24">
      <h2 style={{ ...display, color: colors.ink, fontSize: "22px" }} className="mb-4">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: colors.ink, opacity: 0.8 }}>
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

        <h1 style={{ ...display, color: colors.ink, fontSize: "32px" }} className="mb-2">Informations légales</h1>
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
  useEffect(() => {
    try {
      localStorage.removeItem("dv_cart");
    } catch {}
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: colors.parchment }}>
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.goldBright }}>
          <CheckCircle2 size={32} color={colors.bark} />
        </div>
        <Eyebrow>Commande confirmée</Eyebrow>
        <h1 className="mt-3" style={{ ...display, fontSize: "clamp(28px,4vw,36px)", color: colors.ink }}>
          Merci pour ta commande.
        </h1>
        <p className="mt-4 text-base" style={{ color: colors.ink, opacity: 0.8 }}>
          Ton paiement a bien été reçu. Un email de confirmation Stripe vient d'arriver dans ta boîte mail, et l'expédition suit sous peu.
        </p>
        <a href="/" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold no-underline mt-8" style={{ backgroundColor: colors.goldBright, color: colors.bark }}>
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
        <h1 className="mt-3" style={{ ...display, fontSize: "clamp(28px,4vw,36px)", color: colors.ink }}>
          Aucun souci, rien n'a été débité.
        </h1>
        <p className="mt-4 text-base" style={{ color: colors.ink, opacity: 0.8 }}>
          Ta commande a été annulée avant paiement. Ton panier est toujours disponible si tu veux réessayer.
        </p>
        <a href="/#catalogue" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold no-underline mt-8" style={{ backgroundColor: colors.goldBright, color: colors.bark }}>
          Retour au catalogue
        </a>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: colors.parchment }}>
      <div className="max-w-md text-center">
        <p style={{ ...display, fontStyle: "italic", color: colors.goldBright, fontSize: "72px", lineHeight: 1 }}>404</p>
        <h1 className="mt-4" style={{ ...display, fontSize: "clamp(26px,4vw,32px)", color: colors.ink }}>
          Cette page s'est égarée dans la vallée.
        </h1>
        <p className="mt-4 text-base" style={{ color: colors.ink, opacity: 0.8 }}>
          Le lien est peut-être incorrect, ou la page n'existe plus. Retourne à l'accueil pour continuer ton exploration.
        </p>
        <a href="/" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold no-underline mt-8" style={{ backgroundColor: colors.goldBright, color: colors.bark }}>
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}

const KNOWN_PATH_PREFIXES = ["/admin", "/merci", "/achat-annule", "/mentions-legales", "/avis", "/produit", "/cours-des-cartes"];

export default function DreamValleySite() {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";

  if (path.startsWith("/admin")) return <AdminPage />;
  if (path.startsWith("/merci")) return <SuccessPage />;
  if (path.startsWith("/achat-annule")) return <CancelPage />;
  if (path.startsWith("/mentions-legales")) return <LegalPage />;
  if (path.startsWith("/avis")) return <ReviewsPage />;
  if (path.startsWith("/cours-des-cartes")) return <CoursDesCartesPage />;

  const isKnownPath = path === "/" || KNOWN_PATH_PREFIXES.some((p) => path.startsWith(p));
  if (!isKnownPath) return <NotFoundPage />;

  return (
    <CartProvider>
      <GlobalMotionStyles />
      <div id="top" style={{ backgroundColor: colors.parchment, minHeight: "100vh" }}>
        <NavBar />
        <CartDrawer />
        <Hero />
        <Principles />
        <Catalogue />
        <Testimonials />
        <Community />
        <Footer />
      </div>
    </CartProvider>
  );
}