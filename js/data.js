/* ============================================================
   ATELIER LUEUR — Product Data (London / New York capsule)
   ============================================================ */

const PRODUCTS = [
  /* ---------- WOMEN ---------- */
  {
    id: "w1", name: "Mayfair Silk Slip Dress", category: "women", subcategory: "dresses",
    price: 4999, oldPrice: 6499, colors: [{ n: "Champagne", h: "#E7D6BF" }, { n: "Fuchsia", h: "#C25A7A" }, { n: "Emerald", h: "#2E6E5C" }],
    sizes: ["Free"], rating: 4.9, reviews: 312, tag: "bestseller",
    desc: "A bias-cut silk slip in the spirit of a Mayfair atelier. Clings to the light, pours over the skin — gallery night or rooftop, it carries the room.",
    fabric: "Heavy Silk Satin, Bias Cut", fit: "Classic slip, midi",
    img: { pose: "w-saree", tone: 1 }
  },
  {
    id: "w2", name: "Camden Poplin Shirt", category: "women", subcategory: "shirts",
    price: 1499, colors: [{ n: "Indigo", h: "#33415C" }, { n: "Blush", h: "#E8C4BC" }, { n: "Mustard", h: "#D9A441" }],
    sizes: ["XS", "S", "M", "L", "XL"], rating: 4.6, reviews: 128, tag: "new",
    desc: "A crisp Oxford poplin shirt cut with an easy Canadian tuxedo ease. Boardroom in the morning, Camden market by evening — still immaculate.",
    fabric: "Cotton Oxford Poplin", fit: "Relaxed, regular",
    img: { pose: "w-kurti", tone: 2 }
  },
  {
    id: "w3", name: "Sloane Wide-Leg Set", category: "women", subcategory: "bottoms",
    price: 2199, oldPrice: 2599, colors: [{ n: "Sand", h: "#D8C6A5" }, { n: "Black", h: "#2E2A28" }],
    sizes: ["XS", "S", "M", "L", "XL"], rating: 4.7, reviews: 96, tag: "bestseller",
    desc: "High-waisted wide-leg trousers with a softly tailored matching top. The Sloane uniform — polished, packable, endlessly re-combinable.",
    fabric: "Crepe & Cotton Blend", fit: "Relaxed, wide leg",
    img: { pose: "w-palazzo", tone: 3 }
  },
  {
    id: "w4", name: "Knightsbridge Evening Gown", category: "women", subcategory: "gowns",
    price: 3799, oldPrice: 4499, colors: [{ n: "Dusty Rose", h: "#D8A99B" }, { n: "Ivory", h: "#F2EADB" }, { n: "Teal", h: "#2F6A75" }],
    sizes: ["XS", "S", "M", "L", "XL"], rating: 4.5, reviews: 88, tag: null,
    desc: "A floor-length column gown with a sculpted bodice and a fluid skirt. Saved for black-tie, smart-casual and weddings with a date — or a feeling.",
    fabric: "Silk-Blend Crepe", fit: "Regular, floor length",
    img: { pose: "w-anarkali", tone: 4 }
  },
  {
    id: "w5", name: "Chelsea Silk Scarf", category: "women", subcategory: "scarves",
    price: 999, colors: [{ n: "Blush", h: "#E8C4BC" }, { n: "Ivory", h: "#F2EADB" }, { n: "Coral", h: "#D97B5A" }],
    sizes: ["One"], rating: 4.8, reviews: 204, tag: "new",
    desc: "A feather-light silk twill scarf from a Chelsea haberdashery line. Over a trench, a slip or a simple tee — instant heirloom energy.",
    fabric: "Silk Twill", fit: "90 × 90 cm",
    img: { pose: "w-dupatta", tone: 5 }
  },
  {
    id: "w6", name: "Royal Ascot Couture Gown", category: "women", subcategory: "gowns",
    price: 12999, oldPrice: 15999, colors: [{ n: "Maroon", h: "#7A2433" }, { n: "Emerald", h: "#2E6E5C" }, { n: "Blush Pink", h: "#E0B4B8" }],
    sizes: ["S", "M", "L", "XL"], rating: 4.9, reviews: 76, tag: "bestseller",
    desc: "A hand-finished couture gown with silk corsetry and a train to remember. The one you will be asked about for a decade.",
    fabric: "Silk Dupion, Couture Corsetry", fit: "Bespoke-length skirt",
    img: { pose: "w-lehenga", tone: 6 }
  },
  {
    id: "w7", name: "Notting Hill Co-ord", category: "women", subcategory: "co-ords",
    price: 3299, colors: [{ n: "Ivory-Gold", h: "#EDE3D0" }, { n: "Crimson", h: "#A63A3A" }],
    sizes: ["XS", "S", "M", "L", "XL"], rating: 4.6, reviews: 61, tag: "new",
    desc: "A matching crop-and-skirt co-ord cut for the Portobello run and the dinner after. Modern, festive, photographed by five o'clock.",
    fabric: "Textured Twill, Gold Trim", fit: "Cropped top, A-line skirt",
    img: { pose: "w-coord", tone: 7 }
  },
  {
    id: "w8", name: "Bond Street Kaftan Dress", category: "women", subcategory: "dresses",
    price: 2599, oldPrice: 2999, colors: [{ n: "Indigo", h: "#33415C" }, { n: "Teal", h: "#2F6A75" }, { n: "Ivory", h: "#F2EADB" }],
    sizes: ["XS", "S", "M", "L", "XL"], rating: 4.5, reviews: 133, tag: "sale",
    desc: "A breezy resort kaftan with tasselled ties and slits to the knee. Riviera days, gallery nights — one piece, all of them.",
    fabric: "Rayon Jersey, Indigo Printed", fit: "Oversized, side slits",
    img: { pose: "w-kaftan", tone: 8 }
  },

  /* ---------- MEN ---------- */
  {
    id: "m1", name: "Savile Oxford Shirt", category: "men", subcategory: "shirts",
    price: 1499, oldPrice: 1899, colors: [{ n: "Oat", h: "#E4D8C2" }, { n: "Olive", h: "#7C7A55" }, { n: "White", h: "#F1ECE2" }],
    sizes: ["S", "M", "L", "XL", "XXL"], rating: 4.7, reviews: 240, tag: "bestseller",
    desc: "A two-ply cotton Oxford with a cutaway collar, cut on Savile Row principles. Under a suit, over a tee — the most useful piece in the wardrobe.",
    fabric: "Two-Ply Cotton Oxford", fit: "Tailored, regular",
    img: { pose: "m-kurta", tone: 1 }
  },
  {
    id: "m2", name: "Mayfair Wool Overcoat", category: "men", subcategory: "outerwear",
    price: 2899, colors: [{ n: "Black", h: "#2B2B2E" }, { n: "Camel", h: "#B98A55" }],
    sizes: ["S", "M", "L", "XL", "XXL"], rating: 4.8, reviews: 57, tag: "new",
    desc: "A double-faced wool overcoat with a sharp peak lapel. Throw it over a suit, or a tee for the club — it carries the night.",
    fabric: "Double-Faced Wool", fit: "Tailored, peak lapel",
    img: { pose: "m-nehru", tone: 2 }
  },
  {
    id: "m3", name: "City Stretch Chinos", category: "men", subcategory: "bottoms",
    price: 1799, oldPrice: 2199, colors: [{ n: "Khaki", h: "#C5B68B" }, { n: "Slate", h: "#5B5F63" }],
    sizes: ["28", "30", "32", "34", "36"], rating: 4.5, reviews: 186, tag: "sale",
    desc: "Tapered stretch chinos that move from the Square Mile to Shoreditch. Generous of pocket, generous of stride — break them in fast.",
    fabric: "Stretch Cotton Twill", fit: "Tapered, mid rise",
    img: { pose: "m-chino", tone: 3 }
  },
  {
    id: "m4", name: "Claridge's Tuxedo Suit", category: "men", subcategory: "suits",
    price: 12999, oldPrice: 15999, colors: [{ n: "Ivory-Gold", h: "#EDE3D0" }, { n: "Maroon-Gold", h: "#7A2433" }],
    sizes: ["S", "M", "L", "XL", "XXL"], rating: 4.9, reviews: 143, tag: "bestseller",
    desc: "A hand-finished tuxedo with satin lapels and a matching waistcoat. Groom, best man, or just the best dressed in the frame.",
    fabric: "Wool Barathea, Satin Lapel", fit: "Full length, tailored",
    img: { pose: "m-sherwani", tone: 4 }
  },
  {
    id: "m5", name: "Carnaby Tweed Blazer", category: "men", subcategory: "blazers",
    price: 5499, oldPrice: 6499, colors: [{ n: "Midnight Blue", h: "#25304A" }, { n: "Black", h: "#2B2B2E" }],
    sizes: ["S", "M", "L", "XL", "XXL"], rating: 4.7, reviews: 89, tag: "new",
    desc: "A structured tweed blazer with textured buttons and a soft shoulder. Over a roll-neck or a crisp shirt — either way, you arrive.",
    fabric: "Wool Tweed, Textured", fit: "Slim, tailored",
    img: { pose: "m-blazer", tone: 5 }
  },
  {
    id: "m6", name: "Marylebone Cashmere Sweater", category: "men", subcategory: "knitwear",
    price: 2499, colors: [{ n: "Sand", h: "#D8C6A5" }, { n: "Bottle Green", h: "#3E5C48" }],
    sizes: ["S", "M", "L", "XL", "XXL"], rating: 4.6, reviews: 102, tag: null,
    desc: "A thirteen-gauge cashmere crew with tonal rib details. Feels luxurious, packs flat, and photographs beautifully at the weekend.",
    fabric: "Pure Cashmere, 13-gauge", fit: "Straight, regular",
    img: { pose: "m-kurta", tone: 6 }
  },

  /* ---------- ACCESSORIES ---------- */
  {
    id: "a1", name: "Piccadilly Leather Belt", category: "accessories", subcategory: "belts",
    price: 1299, colors: [{ n: "Cognac", h: "#A9743F" }, { n: "Black", h: "#2A2826" }],
    sizes: ["S", "M", "L"], rating: 4.5, reviews: 118, tag: null,
    desc: "Full-grain vegetable-tanned leather with a brushed brass buckle. Ages into a personal artifact, season after season.",
    fabric: "Vegetable-tanned Leather", fit: "3.5 cm width",
    img: { pose: "acc-belt", tone: 2 }
  },
  {
    id: "a2", name: "Harrods Leather Tote", category: "accessories", subcategory: "bags",
    price: 2499, oldPrice: 2999, colors: [{ n: "Camel", h: "#B98A55" }, { n: "Natural", h: "#E8DFC9" }],
    sizes: ["One"], rating: 4.8, reviews: 74, tag: "bestseller",
    desc: "A structured leather tote with a zip pocket and space for a 15-inch laptop. Knightsbridge polish on your shoulder, everywhere.",
    fabric: "Full-Grain Leather", fit: "Laptop-friendly",
    img: { pose: "acc-tote", tone: 3 }
  },
  {
    id: "a3", name: "Bond Street Gold Necklace", category: "accessories", subcategory: "jewelry",
    price: 1899, colors: [{ n: "Pearl", h: "#EFE6DA" }, { n: "Rose Gold", h: "#C98A6B" }],
    sizes: ["One"], rating: 4.7, reviews: 92, tag: "new",
    desc: "A layered gold-plated pendant with a delicate clasp. Lifts a gown, a slip or a tee with equal grace.",
    fabric: "18k Gold Plated, Hypoallergenic", fit: "One size, adjustable",
    img: { pose: "acc-choker", tone: 4 }
  },
  {
    id: "a4", name: "Soho Acetate Sunglasses", category: "accessories", subcategory: "eyewear",
    price: 1299, oldPrice: 1499, colors: [{ n: "Honey Tortoise", h: "#9C6B3D" }, { n: "Black", h: "#262626" }],
    sizes: ["One"], rating: 4.6, reviews: 156, tag: "sale",
    desc: "Hand-polished acetate in a slightly oversized square. CR-39 lenses with full UV400 protection — sunny at noon, effortless at dusk.",
    fabric: "Italian Acetate", fit: "Unisex 52mm",
    img: { pose: "acc-glass", tone: 5 }
  },

  /* ---------- FOOTWEAR ---------- */
  {
    id: "f1", name: "Jermyn Leather Sandals", category: "footwear", subcategory: "sandals",
    price: 1499, colors: [{ n: "Tan", h: "#C8A57E" }, { n: "Black", h: "#2E2A28" }],
    sizes: ["3", "4", "5", "6", "7", "8", "9"], rating: 4.6, reviews: 81, tag: "bestseller",
    desc: "Hand-stitched leather sandals with a cushioned sole. The flat that walks you from Jermyn Street to the coast.",
    fabric: "Goat Leather, Hand-stitched", fit: "True to size (UK)",
    img: { pose: "f-jutti", tone: 6 }
  },
  {
    id: "f2", name: "Bond Street Penny Loafers", category: "footwear", subcategory: "loafers",
    price: 2499, oldPrice: 2999, colors: [{ n: "Oxblood", h: "#6E2B2B" }, { n: "Tan", h: "#C8A57E" }],
    sizes: ["39", "40", "41", "42", "43", "44"], rating: 4.8, reviews: 64, tag: "sale",
    desc: "Penny loafers in grained leather with a stacked heel. Slide into them with chinos, flannels or a tuxedo — they keep the story going.",
    fabric: "Grained Leather", fit: "True to size (EU)",
    img: { pose: "f-loafer", tone: 1 }
  },
  {
    id: "f3", name: "Regent Velvet Loafers", category: "footwear", subcategory: "loafers",
    price: 1999, colors: [{ n: "Burgundy", h: "#6E2B2B" }, { n: "Gold", h: "#C9A227" }],
    sizes: ["3", "4", "5", "6", "7", "8", "9"], rating: 4.7, reviews: 58, tag: "new",
    desc: "Hand-finished velvet slip-ons with a leather sole. The finishing touch for a tuxedo, or a rebel contrast to straight-cut linen.",
    fabric: "Velvet, Leather Sole", fit: "True to size (UK)",
    img: { pose: "f-mojari", tone: 2 }
  },

  /* ---------- BEAUTY / ESSENTIALS ---------- */
  {
    id: "e1", name: "Lueur London Eau de Parfum", category: "lifestyle", subcategory: "fragrance",
    price: 2999, colors: [{ n: "Amber Glass", h: "#B0845C" }],
    sizes: ["50ml"], rating: 4.9, reviews: 143, tag: "new",
    desc: "Top notes of saffron and bergamot, a heart of rose and sandalwood, a base of amber. Modern British perfumery, made for the wrist.",
    fabric: "Hand-poured, 20% Parfum", fit: "50 ml",
    img: { pose: "b-scent", tone: 3 }
  }
];

/* Helper lookups */
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const priceOf = (p) => (p.oldPrice && p.oldPrice > p.price ? p.oldPrice : p.price);
const SIZES_ALL = ["Free", "XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "3", "4", "5", "6", "7", "8", "9", "39", "40", "41", "42", "43", "44", "One", "50ml"];

const CURRENCY = (n) => "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: n % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 });

/* Site configuration — London-based, worldwide shipping */
const SHIPCFG = Object.freeze({
  FREE: 7999,          // free shipping above this spend (₹)
  STD: 199,            // standard international flat rate ₹
  EXP: 399,            // express ₹
  PRM: 599,            // premium same-day ₹
  BRAND: "Atelier Lueur",
  BASE: "London, United Kingdom",
  EMAIL: "atelierluer@gmail.com",
  PHONE: "+91 98907 28141",
  PHONE_RAW: "+919890728141",
  INSTA: "@atelierlueur"
});

/* Product image generator — elegant garment SVGs as data URIs */
const IMG_SPECS = {
  "w-saree":  ["Draped saree", "silk saree with pallu", 326, 442],
  "w-kurti":  ["A-line print kurti", "cotton kurti", 326, 442],
  "w-palazzo":["Flared palazzo set", "palazzo pants", 326, 442],
  "w-anarkali":["Floor-length anarkali", "flared anarkali suit", 326, 442],
  "w-dupatta":["Silk dupatta", "embroidered dupatta", 442, 326],
  "w-lehenga":["Embroidered lehenga", "zardozi lehenga choli", 326, 442],
  "w-coord":  ["Festive co-ord set", "mirror-work co-ord", 326, 442],
  "w-kaftan": ["Indigo kaftan dress", "legend kaftan", 326, 442],
  "m-kurta":  ["Straight-cut kurta", "chikankari kurta", 326, 442],
  "m-nehru":  ["Nehru jacket", "mandarin collar jacket", 326, 442],
  "m-chino":  ["Tapered chinos", "flat-front chinos", 326, 442],
  "m-sherwani":["Embroidered sherwani", "raw silk sherwani", 326, 442],
  "m-blazer": ["Bandhgala blazer", "tailored bandhgala", 326, 442],
  "acc-belt": ["Roller buckle belt", "leather belt", 442, 326],
  "acc-tote": ["Block-print tote bag", "canvas tote", 326, 326],
  "acc-choker":["Pearl choker", "bridal choker", 326, 326],
  "acc-glass":["Acetate sunglasses", "aviator shades", 326, 326],
  "f-jutti":  ["Hand-stitched Kolhapuri", "embroidered jutti", 326, 326],
  "f-loafer": ["Penny loafer", "moccasin flats", 326, 326],
  "f-mojari": ["Gold mojari", "embellished mojari", 326, 326],
  "b-scent":  ["Amber glass perfume bottle", "scent bottle", 326, 326]
};

const TONES = [
  { bg: "#F0E7D8", ink: "#8B7355", tint: "#D8C9AE" },
  { bg: "#EDE3D2", ink: "#A9794B", tint: "#D3BCA0" },
  { bg: "#E9E0CE", ink: "#7C6A50", tint: "#CFC0A8" },
  { bg: "#F2E9DA", ink: "#9C8A6D", tint: "#DCCFBA" },
  { bg: "#EFE6D6", ink: "#B08A5E", tint: "#D9C9AE" },
  { bg: "#ECE2CF", ink: "#745F48", tint: "#C9B79B" },
  { bg: "#F0E8DA", ink: "#A67C52", tint: "#DBCCB4" },
  { bg: "#EAE0CD", ink: "#877259", tint: "#CFBE9F" }
];

function garmentSVG(pose, toneIdx, label, sub) {
  const t = TONES[(toneIdx - 1) % TONES.length];
  const spec = IMG_SPECS[pose];
  const w = spec ? spec[2] : 400, h = spec ? spec[3] : 500;
  const shapes = {
    "figure": `<ellipse cx="${w / 2}" cy="${h * 0.52}" rx="${w * 0.3}" ry="${h * 0.34}" fill="${t.tint}" opacity="0.5"/>
               <ellipse cx="${w / 2}" cy="${h * 0.44}" rx="${w * 0.22}" ry="${h * 0.3}" fill="none" stroke="${t.ink}" stroke-width="1.6" opacity="0.55" stroke-dasharray="4 6"/>`,
    "swash":  `<path d="M ${w * 0.1} ${h * 0.78} C ${w * 0.16} ${h * 0.5}, ${w * 0.42} ${h * 0.36}, ${w * 0.5} ${h * 0.4} S ${w * 0.86} ${h * 0.5}, ${w * 0.9} ${h * 0.78}" fill="none" stroke="${t.ink}" stroke-width="1.4" opacity="0.5" stroke-dasharray="6 7"/>`,
    "frame":  `<rect x="${w * 0.12}" y="${h * 0.12}" width="${w * 0.76}" height="${h * 0.76}" fill="none" stroke="${t.ink}" stroke-width="1" opacity="0.4"/>`
  };
  const labelBlock = label
    ? `<text x="50%" y="${h * 0.94}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${w * 0.07}" letter-spacing="3" fill="${t.ink}" fill-opacity="0.75">${label.toUpperCase()}</text>`
    : "";
  const subBlock = sub
    ? `<text x="50%" y="${h * 0.94}" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="${w * 0.055}" fill="${t.ink}" fill-opacity="0.6">${sub}</text>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="bgr" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${t.bg}"/><stop offset="1" stop-color="${t.tint}"/>
      </linearGradient>
      <pattern id="grain" width="5" height="5" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.6" fill="${t.ink}" opacity="0.05"/>
      </pattern>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bgr)"/>
    <rect width="${w}" height="${h}" fill="url(#grain)"/>
    ${shapes.frame}
    ${shapes.figure}
    ${shapes.swash}
    ${labelBlock ? labelBlock + `<text x="50%" y="${h * 0.5}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="${w * 0.16}" letter-spacing="4" fill="${t.ink}">${label.toUpperCase()}</text>` : ""}
    ${subBlock}
  </svg>`;
}

/* ============================================================
   Real photography — every product ships with an editorial photo
   (local files in /images, credits in ATTRIBUTION.md). SVG art
   remains as an automatic fallback for offline / long-tail cases.
   ============================================================ */
const PHOTO = { w1: 1, w2: 1, w3: 1, w4: 1, w5: 1, w6: 1, w7: 1, w8: 1, m1: 1, m2: 1, m3: 1, m4: 1, m5: 1, m6: 1, a1: 1, a2: 1, a3: 1, a4: 1, f1: 1, f2: 1, f3: 1, e1: 1 };
const photoSrc = (id, suffix) => (PHOTO[id] ? "images/p_" + id + (suffix ? "_" + suffix : "") + ".jpg" : "");

function svgArt(prod, opts = {}) {
  const spec = IMG_SPECS[prod.img.pose];
  const label = opts.label || prod.name.split(" ")[0];
  const sub = opts.sub || prod.name;
  const svg = garmentSVG(prod.img.pose, prod.img.tone, label, sub);
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function pimg(prod, opts = {}) {
  return photoSrc(prod.id, "") || svgArt(prod, opts);
}

function galleryImage(prod, variant) {
  const suf = variant <= 0 ? "" : variant === 1 ? "2" : variant === 2 ? "3" : "4";
  const ph = photoSrc(prod.id, suf);
  if (ph) return ph;
  const tone = 1 + ((prod.img.tone + variant) % 8);
  return svgArt({ ...prod, img: { pose: prod.img.pose, tone } }, { label: prod.name.split(" ")[0], sub: "ATELIER LUEUR" });
}

/* Brand imagery — editorial photography (local files, see ATTRIBUTION.md) */
const heroImage = () => "images/hero.jpg";
const editorialImage = (idx) => ["images/x_editorial.jpg", "images/insta1.jpg", "images/insta6.jpg"][idx % 3];
const instaImage = (i) => "images/insta" + (1 + (i % 6)) + ".jpg";
const collectionImage = (coll) =>
  ({ women: "images/p_w1.jpg", men: "images/p_m1.jpg", outerwear: "images/p_w7.jpg", accessories: "images/p_a2.jpg", essentials: "images/p_e1.jpg" })[coll] || "images/p_w1.jpg";

/* Expose on window so classic scripts & inline handlers resolve globally */
Object.assign(window, {
  PRODUCTS, byId, priceOf, SIZES_ALL, CURRENCY, SHIPCFG, PHOTO, photoSrc,
  pimg, svgArt, galleryImage, heroImage, editorialImage, instaImage, collectionImage
});