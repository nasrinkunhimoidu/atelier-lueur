/* ============================================================
   ATELIER — Product detail page
   ============================================================ */

(function () {
  const { initShell, productCard, initReveal, toast, galleryImage, cap, stars } = window.UI;

  function mount() {
    initShell({ page: "shop" });

    const id = new URLSearchParams(location.search).get("id") || "w1";
    const p = byId(id);
    if (!p) { location.href = "shop.html"; return; }

    document.title = p.name + " — Atelier Lueur";
    document.getElementById("bcName").textContent = p.name;
    const catLink = document.querySelector('#bcName') && cap(p.category);

    let size = p.sizes[1] || p.sizes[0];
    let colorIdx = 0;
    let activeImg = 0;

    const gallery = document.getElementById("pdGallery");
    const info = document.getElementById("pdInfo");
    const VIEWS = 5;

    function renderMedia() {
      gallery.innerHTML = `
        <div class="pd-thumbs">
          ${[0, 1, 2, 3].map((v) => `
            <button class="pd-thumb ${v === activeImg ? "active" : ""}" data-v="${v}">
              <img src="${galleryImage(p, v)}" alt="${p.name} view ${v + 1}" data-id="${p.id}" onerror="window.svgArt&&!this.dataset.fb&&(this.dataset.fb=1,this.src=svgArt(byId(this.dataset.id)))">
            </button>`).join("")}
        </div>
        <div class="pd-main">
          ${[0, 1, 2, 3].map((v) => `<img class="${v === activeImg ? "active" : ""}" src="${galleryImage(p, v)}" alt="${p.name} view ${v + 1}" data-id="${p.id}" onerror="window.svgArt&&!this.dataset.fb&&(this.dataset.fb=1,this.src=svgArt(byId(this.dataset.id)))">`).join("")}
          <div class="pc-badges">
            ${p.tag ? `<span class="pc-badge ${p.tag === "sale" ? "pc-badge--sale" : p.tag === "new" ? "pc-badge--new" : ""}">${p.tag}</span>` : ""}
          </div>
          <span class="pd-zoom-hint">⇲ Hover to zoom</span>
        </div>`;
      gallery.querySelectorAll(".pd-thumb").forEach((t) => t.addEventListener("click", () => {
        activeImg = +t.dataset.v;
        renderMedia();
      }));
    }

    function renderInfo() {
      const color = p.colors[colorIdx];
      const sale = p.oldPrice && p.oldPrice > p.price;
      const onWish = Store.isWished(p.id);
      info.innerHTML = `
        <span class="eyebrow">${cap(p.category)} · ${cap(p.subcategory)}</span>
        <h1 class="pd-title mt-16">${p.name}</h1>
        <div class="pc-rating"><span class="stars">${stars(p.rating)}</span><b>${p.rating}</b> · ${p.reviews} reviews · <span class="faint">${sale ? Math.round((1 - p.price / p.oldPrice) * 100) : 0}% saved</span></div>
        <div class="pd-price-row">
          <span class="price">${CURRENCY(p.price)}</span>
          ${sale ? `<span class="old">${CURRENCY(p.oldPrice)}</span><span class="save">SALE · Save ${CURRENCY(p.oldPrice - p.price)}</span>` : ""}
        </div>
        <p class="pd-desc">${p.desc}</p>

        <div class="option-block">
          <div class="option-label"><span>Colour — <b>${color.n}</b></span></div>
          <div class="color-dots">
            ${p.colors.map((c, i) => `<span class="color-dot ${i === colorIdx ? "checked" : ""}" style="background:${c.h}" data-c="${i}" title="${c.n}"></span>`).join("")}
          </div>
        </div>

        <div class="option-block">
          <div class="option-label"><span>Size</span><span class="link" id="sizeGuide">Size Guide</span></div>
          <div class="size-options">
            ${p.sizes.map((s) => `<button class="size-btn ${s === size ? "active" : ""}" data-sz="${s}">${s}</button>`).join("")}
          </div>
          <p class="tiny muted mt-8" id="sizeHint"></p>
        </div>

        <div class="pd-actions">
          <button class="btn btn--primary" id="addBtn"><span class="shine"></span>Add to Bag · ${CURRENCY(p.price)}</button>
          <button class="btn btn--sand" id="buyBtn">Buy Now</button>
          <button class="wish-btn ${onWish ? "wished" : ""}" id="wishBtn" aria-label="Add to wishlist"><svg viewBox="0 0 24 24"><path d="M12 20.5C7 16.5 3 13.2 3 9.3 3 6.6 5.1 4.5 7.8 4.5c1.7 0 3.2.8 4.2 2.2 1-1.4 2.5-2.2 4.2-2.2 2.7 0 4.8 2.1 4.8 4.8 0 3.9-4 7.2-9 11.2Z"/></svg></button>
        </div>

        <div class="pd-perks">
          <div class="perk"><b>✈ Free ship</b>On orders ${CURRENCY(SHIPCFG.FREE)}+</div>
          <div class="perk"><b>↻ 60-day returns</b>Free change of mind</div>
          <div class="perk"><b>♻ Handloom</b>Ethically crafted</div>
        </div>

        <div class="accordion mt-32">
          <div class="acc-item open">
            <button class="acc-head">Details <span class="chev">▾</span></button>
            <div class="acc-body"><p>${p.desc} Every piece arrives wrapped in paper, not plastic, ready to be kept or gifted.</p></div>
          </div>
          <div class="acc-item">
            <button class="acc-head">Materials &amp; Care <span class="chev">▾</span></button>
            <div class="acc-body"><p>${p.fabric}. Cold machine wash inside out, or dry-clean for first impression. Iron on the reverse while slightly damp. Store folded on a shelf, never hanger-stretched.</p></div>
          </div>
          <div class="acc-item">
            <button class="acc-head">Delivery &amp; Returns <span class="chev">▾</span></button>
            <div class="acc-body"><p>Free worldwide delivery on orders over ${CURRENCY(SHIPCFG.FREE)}; flat ${CURRENCY(SHIPCFG.STD)} below that. Ships from London in 24h on working days — 4–6 business days worldwide. Returns within 60 days, fully refunded to original payment method.</p></div>
          </div>
        </div>`;

      bindInfoEvents(p, sale, onWish);
    }

    function bindInfoEvents(p, sale, onWish) {
      info.querySelectorAll(".color-dot").forEach((d) => d.addEventListener("click", () => { colorIdx = +d.dataset.c; renderInfo(); }));
      info.querySelectorAll(".size-btn").forEach((b) => b.addEventListener("click", () => { size = b.dataset.sz; renderInfo(); }));
      document.getElementById("sizeGuide").addEventListener("click", () => toast("Size guide — measurements in the size table below", "info"));
      document.getElementById("wishBtn").addEventListener("click", () => {
        Store.toggleWish(p.id);
        const on = Store.isWished(p.id);
        toast(on ? "Saved to wishlist" : "Removed from wishlist", on ? "success" : "error", p.name);
        renderInfo();
      });
      document.getElementById("addBtn").addEventListener("click", () => {
        Store.addToCart(p, size, colorIdx, 1);
        toast("Added to your bag", "success", `${p.name} · ${p.colors[colorIdx].n} · ${size}`);
      });
      document.getElementById("buyBtn").addEventListener("click", () => {
        Store.addToCart(p, size, colorIdx, 1);
        location.href = "checkout.html";
      });
      document.querySelectorAll(".acc-head").forEach((h) => h.addEventListener("click", () => h.parentElement.classList.toggle("open")));
    }

    renderMedia();
    renderInfo();

    /* related */
    const related = PRODUCTS.filter((x) => (x.category === p.category || x.subcategory === p.subcategory) && x.id !== p.id).concat(PRODUCTS.filter((x) => x.category !== p.category && x.subcategory !== p.subcategory && x.id !== p.id)).slice(0, 4);
    document.getElementById("relatedGrid").innerHTML = related.map((x, i) => productCard(x, i)).join("");

    initReveal();
    const pl = document.getElementById("preloader");
    if (pl) setTimeout(() => pl.classList.add("done"), 600);
  }

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", mount) : mount();
  window.__productMount = mount;
})();