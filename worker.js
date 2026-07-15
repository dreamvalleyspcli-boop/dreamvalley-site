const API_URL = "https://dreamvalley-api.dreamvalleyspcli.workers.dev";
const SITE_URL = "https://dreamvalleytcg.fr";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/sitemap.xml") {
      return handleSitemap();
    }

    const match = url.pathname.match(/^\/produit\/([a-z0-9-]+)\/?$/);
    if (match) {
      return handleProductPage(match[1], request, env);
    }

    // Tout le reste (accueil, /admin, /merci, etc.) continue de fonctionner exactement comme avant.
    return env.ASSETS.fetch(request);
  },
};

async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/api/products`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function handleSitemap() {
  const products = await getProducts();
  const urls = [
    { loc: `${SITE_URL}/`, priority: "1.0" },
    { loc: `${SITE_URL}/mentions-legales`, priority: "0.3" },
    ...products
      .filter((p) => !p.soon)
      .map((p) => ({ loc: `${SITE_URL}/produit/${p.slug || p.id}`, priority: "0.8" })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=UTF-8" } });
}

async function handleProductPage(slug, request, env) {
  const products = await getProducts();
  const product = products.find((p) => p.slug === slug || p.id === slug);

  const indexRes = await env.ASSETS.fetch(new URL("/index.html", request.url));
  let html = await indexRes.text();

  if (!product) {
    // Produit introuvable : on sert quand même la page (React affichera le catalogue), en 404 pour les robots.
    return new Response(html, { status: 404, headers: { "Content-Type": "text/html; charset=UTF-8" } });
  }

  const title = `${product.name} — DreamValleyTCG`;
  const description = escapeHtml((product.text || "").slice(0, 155).replace(/\s+/g, " "));
  const pageUrl = `${SITE_URL}/produit/${slug}`;
  const image = product.images && product.images[0] ? product.images[0] : "";

  html = html
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta property="og:title" content=".*?"\s*\/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/>/, `<meta property="og:url" content="${pageUrl}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/>/, `<link rel="canonical" href="${pageUrl}" />`)
    .replace(/<meta name="twitter:title" content=".*?"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
    .replace(/<meta name="twitter:description" content=".*?"\s*\/>/, `<meta name="twitter:description" content="${description}" />`);

  const extraTags = [];
  if (image) {
    extraTags.push(`<meta property="og:image" content="${escapeHtml(image)}" />`);
    extraTags.push(`<meta name="twitter:image" content="${escapeHtml(image)}" />`);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.text || "",
    image: product.images || [],
  };
  if (!product.soon && product.price != null) {
    jsonLd.offers = {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: pageUrl,
    };
  }
  extraTags.push(`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);

  // Contenu visible minimal pour les robots qui n'exécutent pas le JavaScript (Discord, aperçus de liens...)
  const crawlerContent = `<noscript><h1>${escapeHtml(product.name)}</h1><p>${description}</p></noscript>`;

  html = html
    .replace("</head>", `${extraTags.join("\n")}\n</head>`)
    .replace('<div id="root">', `${crawlerContent}\n<div id="root">`);

  return new Response(html, { headers: { "Content-Type": "text/html; charset=UTF-8" } });
}