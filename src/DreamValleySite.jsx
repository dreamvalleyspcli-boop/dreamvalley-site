import React, { useState } from "react";
import { Check, ShieldCheck, Users, ArrowRight, Menu, X } from "lucide-react";

const colors = {
  parchment: "#f5ecd9",
  parchmentSoft: "#efe2c6",
  ink: "#1f3d2c",
  bark: "#14231a",
  gold: "#b8862f",
  goldBright: "#d4a544",
  moss: "#4f7a5c",
  teal: "#2f8fa3",
  tealGlow: "#7dd3e0",
};

const display = { fontFamily: "'Fraunces', serif" };
const mono = { fontFamily: "'JetBrains Mono', monospace" };

function Eyebrow({ children, dark }) {
  return (
    <span
      style={{ ...mono, color: dark ? colors.tealGlow : colors.moss, letterSpacing: "0.14em" }}
      className="text-xs uppercase"
    >
      {children}
    </span>
  );
}

function NavBar() {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="sticky top-0 z-20 backdrop-blur border-b"
      style={{ backgroundColor: "rgba(245,236,217,0.88)", borderColor: "rgba(31,61,44,0.12)" }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2 no-underline" style={{ ...display, fontStyle: "italic", fontWeight: 600, fontSize: "20px", color: colors.ink }}>
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 shrink-0">
            <path d="M12 3c3 2 5 6 3.5 10.5C14.5 16.8 12 18 12 21c0-3-2.5-4.2-3.5-7.5C7 9 9 5 12 3Z" fill={colors.goldBright} />
          </svg>
          DreamValley
          <span style={{ fontStyle: "normal", color: colors.moss, fontSize: "14px" }}>TCG</span>
        </a>

        <a
          href="#communaute"
          className="hidden sm:inline-flex items-center rounded-full px-4 py-2 text-xs no-underline transition-colors"
          style={{ ...mono, backgroundColor: colors.ink, color: colors.parchment, letterSpacing: "0.04em" }}
        >
          Rejoindre le Discord
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden p-2 rounded-md"
          style={{ color: colors.ink }}
          aria-label="Ouvrir le menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="sm:hidden px-6 pb-4">
          <a
            href="#communaute"
            onClick={() => setOpen(false)}
            className="block text-center rounded-full px-4 py-2 text-xs no-underline"
            style={{ ...mono, backgroundColor: colors.ink, color: colors.parchment }}
          >
            Rejoindre le Discord
          </a>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20">
      <svg
        viewBox="0 0 1120 420"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
      >
        <path
          d="M-20 40 C 180 90, 120 180, 320 210 S 560 300, 480 360 S 780 400, 1140 380"
          stroke={colors.tealGlow}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M-20 40 C 180 90, 120 180, 320 210 S 560 300, 480 360 S 780 400, 1140 380"
          stroke={colors.gold}
          strokeWidth="1"
          fill="none"
          strokeDasharray="1 10"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative max-w-6xl mx-auto px-6">
        <Eyebrow>DreamValleyTCG — Revendeur indépendant</Eyebrow>
        <h1
          className="mt-4 max-w-xl"
          style={{ ...display, fontWeight: 600, fontSize: "clamp(38px,6vw,64px)", lineHeight: 1.08, color: colors.bark }}
        >
          Chaque produit a une histoire{" "}
          <span style={{ fontStyle: "italic", color: colors.moss, fontWeight: 500 }}>avant</span> d'arriver chez vous.
        </h1>
        <p className="mt-5 max-w-md text-lg" style={{ color: colors.ink, opacity: 0.85 }}>
          Nous sélectionnons et vérifions des produits Pokémon TCG scellés, pour que chaque commande soit une découverte — jamais un pari.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#communaute"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold no-underline transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: colors.ink, color: colors.parchment }}
          >
            Rejoindre le Discord
          </a>
          <a
            href="#catalogue"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold no-underline border-2 transition-colors"
            style={{ borderColor: colors.ink, color: colors.ink }}
          >
            Voir le catalogue
          </a>
        </div>
      </div>
    </section>
  );
}

function Principles() {
  const items = [
    {
      icon: Check,
      title: "Authenticité vérifiée",
      text: "Chaque scellé est contrôlé avant expédition — poids, hologramme, numéro de lot. Un doute, et le produit ne part pas.",
    },
    {
      icon: ShieldCheck,
      title: "Transparence totale",
      text: "Bons comme mauvais tirages sont montrés, jamais cachés. Le marché mérite des chiffres réels, pas une vitrine triée.",
    },
    {
      icon: Users,
      title: "Communauté avant tout",
      text: "Les infos et alertes marché sont partagées avec la communauté avant d'être exploitées commercialement.",
    },
  ];
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="max-w-xl mb-12">
        <Eyebrow>Ce qui guide chaque envoi</Eyebrow>
        <h2 className="mt-3" style={{ ...display, fontSize: "clamp(28px,4vw,38px)", color: colors.bark }}>
          Trois principes, aucun compromis.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {items.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-2xl p-7 border"
            style={{ backgroundColor: colors.parchmentSoft, borderColor: "rgba(31,61,44,0.1)" }}
          >
            <Icon size={28} color={colors.ink} strokeWidth={2.2} />
            <h3 className="mt-4 text-lg font-semibold" style={{ color: colors.bark }}>
              {title}
            </h3>
            <p className="mt-2 text-sm" style={{ color: colors.ink, opacity: 0.78 }}>
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Catalogue() {
  const cards = [
    { tag: "Scellé — grand format", title: "Displays complets", text: "Boîtes scellées d'origine, contrôlées à réception et avant expédition. Idéal pour les collectionneurs qui veulent l'intégralité d'un tirage." },
    { tag: "Scellé — à l'unité", title: "Boosters individuels", text: "Pour tester une extension ou compléter une collection sans engager tout un display." },
    { tag: "À venir", title: "Gamme FR / JP officielle", text: "Produits français et japonais via un futur partenariat distributeur officiel — authenticité garantie à 100%.", soon: true },
  ];
  return (
    <section id="catalogue" className="py-20" style={{ backgroundColor: colors.parchmentSoft }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-11">
          <Eyebrow>Ce que l'on propose</Eyebrow>
          <h2 className="mt-3" style={{ ...display, fontSize: "clamp(28px,4vw,38px)", color: colors.bark }}>
            Le catalogue, en bref.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border flex flex-col overflow-hidden"
              style={{ backgroundColor: colors.parchment, borderColor: "rgba(31,61,44,0.1)", opacity: c.soon ? 0.75 : 1 }}
            >
              <span className="px-6 pt-5 text-xs uppercase" style={{ ...mono, color: colors.gold, letterSpacing: "0.1em" }}>
                {c.tag}
              </span>
              <h3 className="px-6 pt-2 text-xl" style={{ ...display, color: colors.bark }}>
                {c.title}
              </h3>
              <p className="px-6 pt-2 pb-4 text-sm flex-1" style={{ color: colors.ink, opacity: 0.75 }}>
                {c.text}
              </p>
              {c.soon && (
                <span
                  className="mx-6 mb-5 w-fit rounded-md border border-dashed px-2.5 py-1 text-[11px]"
                  style={{ ...mono, color: colors.moss, borderColor: colors.moss }}
                >
                  En préparation
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
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
    <section id="communaute" className="py-20" style={{ backgroundColor: colors.bark }}>
      <div className="max-w-6xl mx-auto px-6">
        <Eyebrow dark>Où nous retrouver</Eyebrow>
        <h2 className="mt-3 max-w-md" style={{ ...display, fontSize: "clamp(28px,4vw,38px)", color: colors.parchment }}>
          La boutique ne dort jamais sur une seule plateforme.
        </h2>
        <p className="mt-4 max-w-lg" style={{ color: colors.parchment, opacity: 0.72 }}>
          Chaque canal a un rôle précis — des lives aux échanges quotidiens avec la communauté.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {links.map((l) => (
            <a
              key={l.name}
              href="#"
              className="flex items-center justify-between rounded-2xl px-5 py-4 no-underline border transition-colors"
              style={{ borderColor: "rgba(245,236,217,0.18)", color: colors.parchment }}
            >
              <span>
                <span className="block font-semibold text-[15px]">{l.name}</span>
                <span className="block mt-0.5 text-[11px]" style={{ ...mono, color: colors.tealGlow, letterSpacing: "0.04em" }}>
                  {l.role}
                </span>
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
    <footer className="py-10" style={{ backgroundColor: colors.bark, borderTop: "1px solid rgba(245,236,217,0.12)" }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-start justify-between gap-4">
        <span style={{ ...display, fontStyle: "italic", fontWeight: 600, color: colors.parchment }}>DreamValleyTCG</span>
        <p className="max-w-md text-xs leading-relaxed" style={{ color: "rgba(245,236,217,0.55)" }}>
          Revendeur indépendant de produits Pokémon TCG scellés. Aucune affiliation avec The Pokémon Company, Nintendo, Game Freak ou Asmodée. Tous les noms et logos de produits cités appartiennent à leurs propriétaires respectifs. © 2026 DreamValleyTCG.
        </p>
      </div>
    </footer>
  );
}

export default function DreamValleySite() {
  return (
    <div id="top" style={{ backgroundColor: colors.parchment, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>
      <NavBar />
      <Hero />
      <Principles />
      <Catalogue />
      <Community />
      <Footer />
    </div>
  );
}
