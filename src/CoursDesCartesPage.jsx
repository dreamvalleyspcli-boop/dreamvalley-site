import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from "lucide-react";

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
const positive = "#8fd19e";
const negative = "#e08a7d";

const display = { fontFamily: "'Fraunces', serif" };
const mono = { fontFamily: "'JetBrains Mono', monospace" };

const API_URL = "https://dreamvalley-card-prices.dreamvalleyspcli.workers.dev/card-trends";

const LANGUAGE_LABELS = {
  english: "Anglais",
  japanese: "Japonais",
  french: "Francais",
};

function formatPrice(item) {
  const symbol = item.currency === "EUR" ? "EUR " : "$";
  return symbol + item.price.toFixed(2);
}

function Sparkline({ history }) {
  if (!history || history.length < 2) {
    return (
      <p style={{ ...mono, fontSize: 13, color: colors.ink, opacity: 0.6 }}>
        Pas encore assez d'historique pour tracer un graphique (revient dans quelques jours).
      </p>
    );
  }

  const width = 600;
  const height = 180;
  const padding = 30;

  const prices = history.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const points = history.map((p, i) => {
    const x = padding + (i / (history.length - 1)) * (width - padding * 2);
    const y = height - padding - ((p.price - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const isUp = history[history.length - 1].price >= history[0].price;
  const lineColor = isUp ? positive : negative;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "auto" }}>
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={lineColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {history.map((p, i) => {
        const [x, y] = points[i].split(",");
        return <circle key={p.date} cx={x} cy={y} r="2.5" fill={lineColor} />;
      })}
      <text x={padding} y={height - 8} style={{ ...mono, fontSize: 11, fill: colors.ink, opacity: 0.6 }}>
        {history[0].date}
      </text>
      <text
        x={width - padding}
        y={height - 8}
        textAnchor="end"
        style={{ ...mono, fontSize: 11, fill: colors.ink, opacity: 0.6 }}
      >
        {history[history.length - 1].date}
      </text>
    </svg>
  );
}

function CardRow({ item }) {
  const [open, setOpen] = useState(false);
  const hasChange = item.change7d !== null && item.change7d !== undefined;
  const isUp = hasChange && item.change7d > 0;

  return (
    <div style={{ borderBottom: `1px solid ${colors.ink}20`, cursor: "pointer" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 8px" }}
      >
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt=""
            style={{ width: 40, height: 56, objectFit: "contain", flexShrink: 0 }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              ...display,
              fontSize: 16,
              fontWeight: 600,
              color: colors.ink,
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.name}
          </p>
          <p style={{ ...mono, fontSize: 12, color: colors.ink, opacity: 0.6, margin: "2px 0 0" }}>
            {item.setName} - {item.type === "sealed" ? "Produit scelle" : "Carte"} - {LANGUAGE_LABELS[item.language] || item.language}
          </p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ ...mono, fontSize: 16, fontWeight: 600, color: colors.ink, margin: 0 }}>
            {formatPrice(item)}
          </p>
          {hasChange ? (
            <p
              style={{
                ...mono,
                fontSize: 13,
                margin: "2px 0 0",
                color: isUp ? positive : negative,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 4,
              }}
            >
              {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isUp ? "+" : ""}
              {item.change7d}% (7j)
            </p>
          ) : (
            <p style={{ ...mono, fontSize: 12, color: colors.ink, opacity: 0.4, margin: "2px 0 0" }}>
              -- (bientot)
            </p>
          )}
        </div>
        {open ? <ChevronUp size={18} color={colors.ink} /> : <ChevronDown size={18} color={colors.ink} />}
      </div>
      {open && (
        <div style={{ padding: "0 8px 20px" }}>
          <Sparkline history={item.history} />
        </div>
      )}
    </div>
  );
}

export default function CoursDesCartesPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [langFilter, setLangFilter] = useState("all");

  useEffect(() => {
    fetch(API_URL)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError(true));
  }, []);

  const items = data?.items || [];
  const filtered = items.filter((i) => {
    const typeOk = filter === "all" || i.type === filter;
    const langOk = langFilter === "all" || i.language === langFilter;
    return typeOk && langOk;
  });

  return (
    <div style={{ backgroundColor: colors.parchment, minHeight: "100vh" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "64px 20px 100px" }}>
        <a href="/#top" style={{ ...mono, fontSize: 13, color: colors.ink, opacity: 0.6, textDecoration: "none" }}>
          Retour a l'accueil
        </a>

        <h1 style={{ ...display, fontSize: 40, fontWeight: 700, color: colors.ink, margin: "16px 0 8px" }}>
          Cours des cartes
        </h1>
        <p style={{ ...mono, fontSize: 14, color: colors.ink, opacity: 0.7, marginBottom: 24 }}>
          {data?.updatedAt
            ? "Mis a jour le " + new Date(data.updatedAt).toLocaleDateString("fr-FR") + " - Suivi quotidien automatique"
            : "Chargement des prix..."}
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {[
            { key: "all", label: "Tout" },
            { key: "card", label: "Cartes" },
            { key: "sealed", label: "Produits scelles" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                ...mono,
                fontSize: 13,
                padding: "8px 16px",
                borderRadius: 999,
                border: `1px solid ${colors.ink}30`,
                backgroundColor: filter === f.key ? colors.goldBright : "transparent",
                color: filter === f.key ? colors.bark : colors.ink,
                cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { key: "all", label: "Toutes langues" },
            { key: "english", label: "Anglais" },
            { key: "japanese", label: "Japonais" },
            { key: "french", label: "Francais" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setLangFilter(f.key)}
              style={{
                ...mono,
                fontSize: 12,
                padding: "6px 14px",
                borderRadius: 999,
                border: `1px solid ${colors.teal}50`,
                backgroundColor: langFilter === f.key ? colors.teal : "transparent",
                color: langFilter === f.key ? colors.bark : colors.tealGlow,
                cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <p style={{ ...mono, color: negative }}>
            Impossible de charger les donnees pour le moment, reessaie un peu plus tard.
          </p>
        )}

        {!error && !data && <p style={{ ...mono, color: colors.ink, opacity: 0.6 }}>Chargement...</p>}

        {!error && data && filtered.length === 0 && (
          <p style={{ ...mono, color: colors.ink, opacity: 0.6 }}>Rien a afficher pour ce filtre.</p>
        )}

        <div>
          {filtered.map((item) => (
            <CardRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}