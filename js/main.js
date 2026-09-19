/* ============================================================
   ATELIER — Home page
   ============================================================ */

(function () {
  const store = window.Store;
  const { initShell, productCard, initReveal, toast } = window.UI;

  function mount() {
    initShell({ page: "home" });

    /* hero + editorial imagery */
    const hero = document.querySelector(".hero-bg");
    if (hero) hero.style.backgroundImage = `url("${heroImage()}")`;
    const ed = document.getElementById("edImg");
    if (ed) ed.src = editorialImage(3);

    /* featured products (bestsellers) */
    const featured = PRODUCTS.filter((p) => p.tag === "bestseller").slice(0, 4);
    document.getElementById("featuredGrid").innerHTML = featured.map((p, i) => productCard(p, i)).join("");

    /* new arrivals */
    const fresh = PRODUCTS.filter((p) => p.tag === "new").concat(PRODUCTS.filter((p) => !p.tag)).slice(0, 4);
    document.getElementById("newGrid").innerHTML = fresh.map((p, i) => productCard(p, i)).join("");

    /* collections */
    const cols = [
      { k: "women", name: "Women", tag: "The capsule", href: "shop.html?cat=women", tall: true },
      { k: "men", name: "Men", tag: "Tailored ease", href: "shop.html?cat=men", tall: false },
      { k: "outerwear", name: "Outerwear", tag: "Season of layers", href: "shop.html?cat=outerwear", tall: false },
      { k: "accessories", name: "Accessories", tag: "The finishing line", href: "shop.html?cat=accessories", tall: false }
    ];
    document.getElementById("colGrid").innerHTML = cols.map((c) => `
      <a class="col-tile ${c.tall ? "col-tile--tall" : ""} reveal" href="${c.href}">
        <img src="${collectionImage(c.k)}" alt="${c.name}" loading="lazy">
        <div class="ct-body">
          <span class="ct-kicker">${c.tag}</span>
          <span class="ct-name">${c.name}</span>
          <span class="ct-cta">Discover <span>→</span></span>
        </div>
      </a>`).join("");

    /* testimonials */
    const T = [
      { q: "The Mayfair silk slip drapes like it was made for me — I wore it to a rooftop in Chelsea and got stopped three times for the number.", n: "Ananya S.", r: "Verified buyer", i: "AS" },
      { q: "Finally, a shirt that fits a real body. The Savile Oxford is the best thing in my wardrobe — I own the oat and the white.", n: "Rohan M.", r: "Verified buyer", i: "RM" },
      { q: "Quality you can feel the second you unfold it. Shipped from London in three days, no questions. Rare these days.", n: "Cleo R.", r: "Verified buyer", i: "CR" }
    ];
    document.getElementById("testiGrid").innerHTML = T.map((t, i) => `
      <div class="testi-card reveal" data-delay="${i}">
        <span class="quote-mark">“</span>
        <p>${t.q}</p>
        <div class="stars">★★★★★</div>
        <div class="who"><span class="avatar">${t.i}</span><div><span class="wname">${t.n}</span><br><span class="wrole">${t.r}</span></div></div>
      </div>`).join("");

    /* instagram strip */
    document.getElementById("instaGrid").innerHTML = [0, 1, 2, 3, 4, 5].map((i) =>
      `<div class="insta-item reveal" data-delay="${i}" title="Follow ${SHIPCFG.INSTA}"><img src="${instaImage(i)}" alt="Atelier Lueur lookbook ${i + 1}" loading="lazy"></div>`
    ).join("");

    /* newsletter */
    document.getElementById("newsForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const em = document.getElementById("newsEmail");
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(em.value.trim())) { toast("Please enter a valid email", "error"); em.focus(); return; }
      Store.applyPromo("WELCOME10");
      toast("Welcome to the circle", "success", "10% off with code WELCOME10");
      em.value = "";
    });

    /* preloader */
    const pl = document.getElementById("preloader");
    if (pl) setTimeout(() => pl.classList.add("done"), 900);
    window.addEventListener("load", () => pl && pl.classList.add("done"));

    initReveal();
  }

  if (document.readyState === "complete" || document.readyState === "interactive") mount();
  else document.addEventListener("DOMContentLoaded", mount);
  window.__homeMount = mount;
})();