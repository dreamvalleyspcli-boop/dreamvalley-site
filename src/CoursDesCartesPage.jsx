import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp, X, ExternalLink } from "lucide-react";

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
const DETAIL_API_URL = "https://dreamvalley-card-prices.dreamvalleyspcli.workers.dev/card-detail";

const LANGUAGE_LABELS = {
  english: "Anglais",
  japanese: "Japonais",
  french: "Francais",
};

const GRADE_ORDER = ["psa10", "psa9", "psa8", "psa7", "psa6", "cgc10", "cgc9", "cgc8", "bgs9_5", "bgs9", "bgs8_5", "ungraded"];
const GRADE_LABELS = {
  psa10: "PSA 10",
  psa9: "PSA 9",
  psa8: "PSA 8",
  psa7: "PSA 7",
  psa6: "PSA 6",
  cgc10: "CGC 10",
  cgc9: "CGC 9",
  cgc8: "CGC 8",
  bgs9_5: "BGS 9.5",
  bgs9: "BGS 9",
  bgs8_5: "BGS 8.5",
  ungraded: "Non gradee",
};

function formatPrice(item) {
  const symbol = item.currency === "EUR" ? "EUR " : "$";
  return symbol + item.price.toFixed(2);
}

function Sparkline({ history }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const svgRef = React.useRef(null);

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

  function indexFromClientX(clientX) {
    const rect = svgRef.current.getBoundingClientRect();
    const fraction = (clientX - rect.left) / rect.width;
    const xSvg = fraction * width;
    const raw = ((xSvg - padding) / (width - padding * 2)) * (history.length - 1);
    return Math.max(0, Math.min(history.length - 1, Math.round(raw)));
  }

  function handleMove(clientX) {
    setHoverIndex(indexFromClientX(clientX));
  }

  const hovered = hoverIndex !== null ? history[hoverIndex] : null;
  const hoveredPoint = hoverIndex !== null ? points[hoverIndex].split(",").map(Number) : null;

  // Tooltip : on évite qu'il déborde du cadre en le recalant près des bords.
  let tooltipX = hoveredPoint ? hoveredPoint[0] : 0;
  const tooltipWidth = 96;
  if (tooltipX < tooltipWidth / 2 + padding) tooltipX = tooltipWidth / 2 + padding;
  if (tooltipX > width - tooltipWidth / 2 - padding) tooltipX = width - tooltipWidth / 2 - padding;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: "100%", height: "auto", cursor: "crosshair", touchAction: "pan-y" }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseLeave={() => setHoverIndex(null)}
      onTouchStart={(e) => handleMove(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={() => setHoverIndex(null)}
    >
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

      {hoveredPoint && (
        <>
          {/* Ligne verticale de repère */}
          <line
            x1={hoveredPoint[0]}
            y1={padding * 0.3}
            x2={hoveredPoint[0]}
            y2={height - padding}
            stroke={colors.ink}
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          {/* Point mis en évidence */}
          <circle cx={hoveredPoint[0]} cy={hoveredPoint[1]} r="5" fill={colors.goldBright} stroke={colors.bark} strokeWidth="1.5" />

          {/* Info-bulle */}
          <g transform={`translate(${tooltipX - tooltipWidth / 2}, ${Math.max(2, hoveredPoint[1] - 46)})`}>
            <rect width={tooltipWidth} height={36} rx={6} fill={colors.bark} stroke={colors.goldBright} strokeWidth="1" />
            <text x={tooltipWidth / 2} y={14} textAnchor="middle" style={{ ...mono, fontSize: 9, fill: colors.ink, opacity: 0.7 }}>
              {hovered.date}
            </text>
            <text x={tooltipWidth / 2} y={28} textAnchor="middle" style={{ ...mono, fontSize: 13, fontWeight: 700, fill: colors.goldBright }}>
              ${hovered.price.toFixed(2)}
            </text>
          </g>
        </>
      )}

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

const RANGE_OPTIONS = [
  { key: "7", label: "7J", days: 7 },
  { key: "30", label: "30J", days: 30 },
  { key: "90", label: "90J", days: 90 },
  { key: "all", label: "TOUT", days: null },
];

function DetailChart({ history, currency }) {
  const [range, setRange] = useState("30");

  if (!history || history.length < 2) {
    return (
      <p style={{ ...mono, fontSize: 13, color: colors.ink, opacity: 0.6 }}>
        Pas encore assez d'historique pour tracer un graphique.
      </p>
    );
  }

  const activeRange = RANGE_OPTIONS.find((r) => r.key === range);
  const sliced = activeRange.days ? history.slice(-activeRange.days) : history;
  const points = sliced.length >= 2 ? sliced : history.slice(-2);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {RANGE_OPTIONS.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            style={{
              ...mono,
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 999,
              border: `1px solid ${colors.ink}25`,
              backgroundColor: range === r.key ? colors.goldBright : "transparent",
              color: range === r.key ? colors.bark : colors.ink,
              cursor: "pointer",
            }}
          >
            {r.label}
          </button>
        ))}
      </div>
      <Sparkline history={points} />
      <p style={{ ...mono, fontSize: 10, color: colors.ink, opacity: 0.4, marginTop: 4 }}>
        Prix "Near Mint" ({currency === "EUR" ? "Cardmarket" : "TCGPlayer"})
      </p>
    </div>
  );
}

function CardDetailModal({ item, onClose }) {
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setDetail(null);
    const params = new URLSearchParams({
      tcgPlayerId: item.tcgPlayerId || item.id.split("-").pop(),
      language: item.language || "english",
    });
    fetch(`${DETAIL_API_URL}?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setDetail(d);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [item]);

  const gradesWithData = detail
    ? GRADE_ORDER.filter((g) => detail.psaPrices?.[g]?.price != null)
    : [];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(13,27,42,0.85)",
        zIndex: 50,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 16px",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: colors.parchmentSoft,
          borderRadius: 16,
          maxWidth: 640,
          width: "100%",
          padding: 24,
          border: `1px solid ${colors.ink}15`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 14 }}>
            {item.imageUrl && (
              <img src={item.imageUrl} alt="" style={{ width: 64, height: 90, objectFit: "contain", flexShrink: 0 }} />
            )}
            <div>
              <p style={{ ...display, fontSize: 20, fontWeight: 600, color: colors.ink, margin: 0 }}>{item.name}</p>
              <p style={{ ...mono, fontSize: 12, color: colors.ink, opacity: 0.6, margin: "4px 0 0" }}>
                {item.setName} - {LANGUAGE_LABELS[item.language] || item.language}
              </p>
              {detail?.tcgPlayerUrl && (
                <a
                  href={detail.tcgPlayerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...mono, fontSize: 11, color: colors.tealGlow, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6, textDecoration: "none" }}
                >
                  Voir sur TCGPlayer <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}>
            <X size={20} color={colors.ink} />
          </button>
        </div>

        {loading && <p style={{ ...mono, fontSize: 13, color: colors.ink, opacity: 0.6 }}>Chargement des details...</p>}

        {error && (
          <p style={{ ...mono, fontSize: 13, color: negative }}>
            Details indisponibles pour le moment, reessaie un peu plus tard.
          </p>
        )}

        {detail && !error && (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 140, backgroundColor: colors.bark, borderRadius: 10, padding: 12 }}>
                <p style={{ ...mono, fontSize: 10, color: colors.moss, margin: 0, letterSpacing: 0.5 }}>TCGPLAYER (USD)</p>
                <p style={{ ...display, fontSize: 22, fontWeight: 600, color: colors.ink, margin: "4px 0 0" }}>
                  {detail.priceUsd != null ? `$${detail.priceUsd.toFixed(2)}` : "--"}
                </p>
              </div>
              {detail.cardmarket && (
                <div style={{ flex: 1, minWidth: 140, backgroundColor: colors.bark, borderRadius: 10, padding: 12 }}>
                  <p style={{ ...mono, fontSize: 10, color: colors.gold, margin: 0, letterSpacing: 0.5 }}>CARDMARKET (EUR)</p>
                  <p style={{ ...display, fontSize: 22, fontWeight: 600, color: colors.ink, margin: "4px 0 0" }}>
                    {detail.cardmarket.marketEur != null ? `EUR ${detail.cardmarket.marketEur.toFixed(2)}` : "--"}
                  </p>
                </div>
              )}
            </div>

            {gradesWithData.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ ...mono, fontSize: 11, color: colors.moss, margin: "0 0 8px", letterSpacing: 0.5 }}>
                  PRIX GRADES (D'APRES LES VENTES EBAY)
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 8 }}>
                  {gradesWithData.map((g) => {
                    const g_ = detail.psaPrices[g];
                    return (
                      <div key={g} style={{ backgroundColor: colors.bark, borderRadius: 8, padding: "8px 10px" }}>
                        <p style={{ ...mono, fontSize: 10, color: colors.goldBright, margin: 0 }}>{GRADE_LABELS[g] || g}</p>
                        <p style={{ ...mono, fontSize: 14, fontWeight: 600, color: colors.ink, margin: "2px 0 0" }}>
                          ${g_.price.toFixed(0)}
                        </p>
                        <p style={{ ...mono, fontSize: 9, color: colors.ink, opacity: 0.45, margin: "1px 0 0" }}>
                          {g_.sales} vente{g_.sales > 1 ? "s" : ""}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <p style={{ ...mono, fontSize: 11, color: colors.moss, margin: "0 0 8px", letterSpacing: 0.5 }}>
                HISTORIQUE DE PRIX
              </p>
              <DetailChart history={detail.rawHistory} currency="USD" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CardRow({ item }) {
  const [open, setOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const hasChange = item.change7d !== null && item.change7d !== undefined;
  const isUp = hasChange && item.change7d > 0;
  const days = item.changeDays || 7;
  const isApprox = !!item.changeIsApproximate;

  return (
    <div style={{ borderBottom: `1px solid ${colors.ink}20` }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 8px", cursor: "pointer" }}
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
            <>
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
                {item.change7d}% ({days}j)
              </p>
              {isApprox && (
                <p style={{ ...mono, fontSize: 10, color: colors.ink, opacity: 0.45, margin: "1px 0 0" }}>
                  estimation, historique encore court
                </p>
              )}
            </>
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDetail(true);
            }}
            style={{
              ...mono,
              fontSize: 12,
              fontWeight: 600,
              padding: "8px 16px",
              borderRadius: 999,
              border: "none",
              backgroundColor: colors.goldBright,
              color: colors.bark,
              cursor: "pointer",
              marginTop: 10,
            }}
          >
            Voir tous les details (EUR, PSA, historique complet)
          </button>
        </div>
      )}
      {showDetail && <CardDetailModal item={item} onClose={() => setShowDetail(false)} />}
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