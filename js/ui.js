/* ============================================================
   ATELIER — Shared UI shell (header, drawer, search, toast, qv)
   ============================================================ */

const UI = (() => {
  let activePage = "";

  const NAV = [
    { label: "Home", href: "index.html", page: "home" },
    { label: "Shop All", href: "shop.html", page: "shop" },
    { label: "Women", href: "shop.html?cat=women", page: "shop" },
    { label: "Men", href: "shop.html?cat=men", page: "shop" },
    { label: "Collections", href: "index.html#collections", page: "home" }
  ];

  function el(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function frag(html) { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content; }

  function icon(name) {
    const I = {
      search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
      heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5C7 16.5 3 13.2 3 9.3 3 6.6 5.1 4.5 7.8 4.5c1.7 0 3.2.8 4.2 2.2 1-1.4 2.5-2.2 4.2-2.2 2.7 0 4.8 2.1 4.8 4.8 0 3.9-4 7.2-9 11.2Z"/></svg>',
      cart: '<svg viewBox="0 0 24 24"><path d="M3 3h2l2.2 11.2A2 2 0 0 0 9.2 16h8.1a2 2 0 0 0 2-1.6L21 7H6"/><circle cx="9.5" cy="20" r="1"/><circle cx="16.5" cy="20" r="1"/></svg>',
      user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></svg>',
      bag: '<svg viewBox="0 0 24 24"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>'
    };
    return I[name] || "";
  }

  function headerHTML() {
    return `
    <div class="announce"><div class="track">
      <span>Ships from London — free worldwide delivery on orders over ${CURRENCY(SHIPCFG.FREE)}</span><span>Ships from London — free worldwide delivery on orders over ${CURRENCY(SHIPCFG.FREE)}</span><span>Ships from London — free worldwide delivery on orders over ${CURRENCY(SHIPCFG.FREE)}</span><span>Ships from London — free worldwide delivery on orders over ${CURRENCY(SHIPCFG.FREE)}</span>
    </div></div>
    <header class="site-header">
      <div class="container nav">
        <a class="brand" href="index.html" aria-label="${SHIPCFG.BRAND} home"><span class="mark">✦</span>ATELIER LUEUR</a>
        <nav class="nav-links" id="navLinks">
          ${NAV.map((l) => `<a href="${l.href}" ${activePage === l.page ? 'class="active"' : ""}>${l.label}</a>`).join("")}
        </nav>
        <div class="nav-actions">
          <button class="icon-btn" id="searchOpen" aria-label="Search">${icon("search")}</button>
          <a class="icon-btn" href="wishlist.html" aria-label="Wishlist">${icon("heart")}<span class="badge" id="wishBadge">0</span></a>
          <a class="icon-btn" href="account.html" aria-label="Account">${icon("user")}</a>
          <button class="icon-btn" id="cartOpen" aria-label="Cart">${icon("cart")}<span class="badge" id="cartBadge">0</span></button>
          <button class="nav-toggle" id="navToggle" aria-label="Menu"><span></span><span></span><span></span></button>
        </div>
      </div>
    </header>

    <div class="overlay" id="overlay"></div>

    <div class="search-panel" id="searchPanel">
      <div class="search-box">
        <div class="container">
          <div class="search-inner">
            <input type="text" id="searchInput" placeholder="Search the collection…" autocomplete="off">
            <button class="search-close" id="searchClose">Close ✕</button>
          </div>
          <div class="search-results" id="searchResults"></div>
        </div>
      </div>
    </div>

    <aside class="cart-drawer" id="cartDrawer" aria-label="Shopping bag">
      <div class="cart-head">
        <h3>Your Bag <span class="faint" id="cartTitleCount"></span></h3>
        <button class="icon-btn" id="cartClose" aria-label="Close bag">✕</button>
      </div>
      <div class="cart-items" id="cartItems"></div>
      <div class="cart-foot" id="cartFoot"></div>
    </aside>

    <div class="modal" id="qvModal">
      <div class="modal-card" id="qvCard"></div>
    </div>

    <div class="toast-wrap" id="toastWrap"></div>`;
  }

  function footerHTML() {
    return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-about">
          <a class="brand" href="index.html"><span class="mark">✦</span>ATELIER LUEUR</a>
          <p>A modern London label with a New York edge. Premium fashion exported worldwide — cut in London, finished with care, shipped to your door.</p>
          <div class="socials">
            <a href="https://instagram.com/atelierlueur" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 2.6a7.2 7.2 0 1 0 0 14.4 7.2 7.2 0 0 0 0-14.4Zm0 11.8a4.6 4.6 0 1 1 0-9.2 4.6 4.6 0 0 1 0 9.2Zm7.4-12.1a1.7 1.7 0 1 1-3.4 0 1.7 1.7 0 0 1 3.4 0Z"/></svg></a>
            <a href="https://pinterest.com" target="_blank" rel="noopener" aria-label="Pinterest" title="Pinterest"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-2.3 3.1-5 0-2.1-1.4-3.6-4-3.6-2.9 0-4.7 2.1-4.7 4.5 0 .8.3 1.4.6 1.8l-.1.4-1.4 5.6c-.4 1.6-.6 1.9-.6 1.9-.1.6.4 1 .8.7l.2-.1s1-.7 2.1-3l1.1-3.9c.4.9 1.5 1.5 2.7 1.5 3.6 0 6.2-3.3 6.2-7.2C17.8 5.4 15.2 2 12 2Z"/></svg></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener" aria-label="TikTok" title="TikTok"><svg viewBox="0 0 24 24"><path d="M19 7.5v2.6a5 5 0 0 1-4.4-1.5v6.7a5.2 5.2 0 1 1-5.2-5.2c.3 0 .5 0 .8.1v2.7a2.5 2.5 0 1 0 1.7 2.4V4h2.7a4.4 4.4 0 0 0 4.4 3.5Z"/></svg></a>
            <a href="https://x.com/atelierlueur" target="_blank" rel="noopener" aria-label="X" title="X"><svg viewBox="0 0 24 24"><path d="M18 3h3l-7.5 8.6L22 21h-6.7l-5.3-6.4L4 21H1l8.2-9.3L1.5 3h6.9l4.8 5.8L18 3Zm-2 16h1.8L7.3 4.8H5.4L16 19Z"/></svg></a>
          </div>
        </div>
        <div>
          <h5>Shop</h5>
          <ul>
            <li><a href="shop.html?cat=women">Women</a></li>
            <li><a href="shop.html?cat=men">Men</a></li>
            <li><a href="shop.html?cat=accessories">Accessories</a></li>
            <li><a href="shop.html?cat=footwear">Footwear</a></li>
            <li><a href="shop.html?tag=sale">Sale</a></li>
          </ul>
        </div>
        <div>
          <h5>Company</h5>
          <ul>
            <li><a href="index.html#lookbook">Our Story</a></li>
            <li><a href="index.html#collections">Collections</a></li>
            <li><a href="shop.html">New Arrivals</a></li>
            <li><a href="account.html#orders">Order History</a></li>
            <li><a href="index.html#newsletter">Newsletter</a></li>
          </ul>
        </div>
        <div>
          <h5>Support</h5>
          <ul class="footer-contact">
            <li><a href="mailto:${SHIPCFG.EMAIL}">${SHIPCFG.EMAIL}</a></li>
            <li><a href="tel:${SHIPCFG.PHONE_RAW}">${SHIPCFG.PHONE}</a></li>
            <li><span class="faint">Based in ${SHIPCFG.BASE}</span></li>
            <li><a href="#" data-toast="Shipping details">Shipping &amp; Returns</a></li>
            <li><a href="#" data-toast="Size guide">Size Guide</a></li>
            <li><a href="#" data-toast="FAQs">FAQs</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${SHIPCFG.BRAND}, ${SHIPCFG.BASE} · World-wide shipping · Orders placed securely through this website.</span>
        <span class="credits-link"><a href="#" id="photoCredits">Photography credits</a></span>
        <div class="payment-row"><span>VISA</span><span>AMEX</span><span>MASTERCARD</span><span>UPI</span><span>PAYPAL</span></div>
      </div>
    </div>
  </footer>
  <div class="modal" id="creditsModal" aria-hidden="true">
    <div class="modal-card modal-card--md">
      <button class="qv-close" id="creditsClose" aria-label="Close">✕</button>
      <span class="eyebrow">Photography</span>
      <h3 class="h-md mt-8">Image credits</h3>
      <p class="tiny muted mt-8">Every photo is an openly licensed image sourced from Wikimedia Commons, used here for a demo storefront. Specific authors &amp; licence terms — plus source links — are listed in <b>ATTRIBUTION.md</b>.</p>
      <div class="credits-body mt-16 tiny muted">
        <span>Flat-lay, tailoring &amp; editorial fashion photography by Openverse contributors (CC0 / CC BY / CC BY-SA).</span>
        <span>Per CC-BY terms: please retain this attribution when reusing the images.</span>
        <span>For image swaps or requests, write to <a href="mailto:atelierluer@gmail.com">atelierluer@gmail.com</a>.</span>
      </div>
    </div>
  </div>`;
  }

  /* ---------- Init shell ---------- */
  function initShell(opts = {}) {
    activePage = opts.page || "";
    const body = document.body;

    body.prepend(frag(headerHTML()));
    body.appendChild(frag(footerHTML()));

    hookDrawer();
    hookSearch();
    hookQuickView();
    hookCredits();
    hookToasts();
    bindFooterToasts();
    bindNavToggle();
    bindScrollHeader();

    Store.on(() => { refreshBadges(); renderCart(); });
    refreshBadges();
    renderCart();
    boot();
  }

  function hookCredits() {
    const modal = document.getElementById("creditsModal");
    const open = document.getElementById("photoCredits");
    if (!modal || !open) return;
    open.addEventListener("click", (e) => { e.preventDefault(); modal.classList.add("show"); document.body.classList.add("no-scroll"); });
    const close = () => { modal.classList.remove("show"); document.body.classList.remove("no-scroll"); };
    modal.querySelector("#creditsClose").addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  function bindScrollHeader() {
    const h = document.querySelector(".site-header");
    const onScroll = () => h.classList.toggle("is-scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function bindNavToggle() {
    const t = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");
    const overlay = document.getElementById("overlay");
    t.addEventListener("click", () => {
      t.classList.toggle("open"); links.classList.toggle("open"); overlay.classList.toggle("show");
      document.body.classList.toggle("no-scroll", links.classList.contains("open"));
    });
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      t.classList.remove("open"); links.classList.remove("open"); overlay.classList.remove("show");
      document.body.classList.remove("no-scroll");
    }));
    overlay.addEventListener("click", closeNavMenu);
    function closeNavMenu() { t.classList.remove("open"); links.classList.remove("open"); overlay.classList.remove("show"); document.body.classList.remove("no-scroll"); }
  }

  /* ---------- Badges ---------- */
  function refreshBadges() {
    const cb = document.getElementById("cartBadge");
    const wb = document.getElementById("wishBadge");
    setBadge(cb, Store.cartCount());
    setBadge(wb, Store.wishCount());
  }
  function setBadge(b, n) {
    if (!b) return;
    const had = b.classList.contains("show");
    b.textContent = n;
    b.classList.add("show");
    if (had && n > 0) { b.classList.remove("count-pop"); void b.offsetWidth; b.classList.add("count-pop"); }
    if (n === 0) b.classList.remove("show");
  }

  /* ---------- Cart drawer ---------- */
  function hookDrawer() {
    const drawer = document.getElementById("cartDrawer");
    const overlay = document.getElementById("overlay");
    const open = () => { drawer.classList.add("open"); overlay.classList.add("show"); document.body.classList.add("no-scroll"); };
    const close = () => { drawer.classList.remove("open"); overlay.classList.remove("show"); document.body.classList.remove("no-scroll"); };
    document.getElementById("cartOpen").addEventListener("click", open);
    document.getElementById("cartClose").addEventListener("click", close);
    overlay.addEventListener("click", close);
    window.__openCart = open;
    window.__closeCart = close;
  }

  function renderCart() {
    const items = Store.getCart();
    const box = document.getElementById("cartItems");
    const foot = document.getElementById("cartFoot");
    const titleCount = document.getElementById("cartTitleCount");
    if (!box) return;
    titleCount.textContent = items.length ? `(${Store.cartCount()})` : "";
    if (!items.length) {
      box.innerHTML = `<div class="cart-empty"><span class="emoji">∅</span><h4>Your bag is empty</h4><p>Discover pieces designed to become your everyday future favourites.</p><a class="btn btn--outline btn--sm" href="shop.html" onclick="window.__closeCart&&window.__closeCart();return false;">Explore Collection</a></div>`;
      foot.innerHTML = "";
      return;
    }
    box.innerHTML = items.map((i, idx) => `
      <div class="cd-item" style="animation-delay:${idx * 60}ms">
        <a href="product.html?id=${i.id}" onclick="window.__closeCart&&window.__closeCart()"><img src="${i.img}" alt="${i.name}"></a>
        <div class="cd-info">
          <span class="name">${i.name}</span>
          <span class="meta">${i.color} · Size ${i.size}</span>
          <div class="cd-foot">
            <div class="qty">
              <button onclick="Store.setQty('${i.key}', ${i.qty - 1})">−</button>
              <span class="num">${i.qty}</span>
              <button onclick="Store.setQty('${i.key}', ${i.qty + 1})">+</button>
            </div>
            <span class="cd-price">${CURRENCY(i.price * i.qty)}</span>
          </div>
        </div>
        <button class="cd-remove" onclick="Store.removeFromCart('${i.key}')" title="Remove">✕</button>
      </div>`).join("");
    const t = Store.cartTotal();
    foot.innerHTML = `
      <div class="cart-total"><span class="lbl">Subtotal</span><span class="amt">${CURRENCY(t.sub)}</span></div>
      <a class="btn btn--primary btn--block" href="checkout.html" onclick="window.__closeCart&&window.__closeCart()">Checkout <span class="ico">→</span></a>
      <a class="btn btn--ghost btn--block" href="cart.html" onclick="window.__closeCart&&window.__closeCart()">View Bag</a>
      <span class="cart-note">Shipping, taxes and discounts calculated at checkout.</span>`;
  }

  /* ---------- Search ---------- */
  function hookSearch() {
    const panel = document.getElementById("searchPanel");
    const openBtn = document.getElementById("searchOpen");
    const closeBtn = document.getElementById("searchClose");
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");
    const open = () => { panel.classList.add("open"); document.body.classList.add("no-scroll"); setTimeout(() => input.focus(), 350); };
    const close = () => { panel.classList.remove("open"); document.body.classList.remove("no-scroll"); input.value = ""; results.innerHTML = ""; };
    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    panel.addEventListener("click", (e) => { if (e.target === panel) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { close(); window.__closeCart && window.__closeCart(); document.querySelector(".modal").classList.remove("show"); } });

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { results.innerHTML = ""; return; }
      const hits = PRODUCTS.filter((p) =>
        (p.name + p.category + p.subcategory + p.fabric).toLowerCase().includes(q)
      ).slice(0, 6);
      results.innerHTML = hits.length
        ? hits.map((p) => `
          <a class="search-result-item" href="product.html?id=${p.id}">
            <img src="${pimg(p)}" alt="${p.name}">
            <div class="sr-info"><b>${p.name}</b><span>${cap(p.category)} · ${cap(p.subcategory)}</span></div>
            <span class="pc-price">${CURRENCY(p.price)}</span>
          </a>`).join("")
        : `<div class="search-none">No results for “${esc(q)}” — try “dress”, “suit”, “sweater”.</div>`;
    });
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }

  /* ---------- Quick view ---------- */
  function hookQuickView() {
    const modal = document.getElementById("qvModal");
    window.__openQV = (id) => {
      const p = byId(id);
      if (!p) return;
      const card = document.getElementById("qvCard");
      let size = p.sizes[1] || p.sizes[0];
      let colorIdx = 0;
      const render = () => {
        const color = p.colors[colorIdx];
        const onWish = Store.isWished(p.id);
        card.innerHTML = `
          <div class="qv-grid">
            <div class="qv-media"><img src="${galleryImage(p, colorIdx)}" alt="${p.name}" data-id="${p.id}" onerror="window.svgArt&&!this.dataset.fb&&(this.dataset.fb=1,this.src=svgArt(byId(this.dataset.id)))"></div>
            <div class="qv-body">
              <button class="qv-close" id="qvClose" aria-label="Close quick view">✕</button>
              <span class="eyebrow">${cap(p.category)} · ${cap(p.subcategory)}</span>
              <h3 class="h-md mt-8">${p.name}</h3>
              <div class="pc-rating mt-8"><span class="stars">${stars(p.rating)}</span>${p.rating} (${p.reviews})</div>
              <div class="pd-price-row">
                <span class="price">${CURRENCY(p.price)}</span>
                ${p.oldPrice ? `<span class="old">${CURRENCY(p.oldPrice)}</span>` : ""}
                ${p.oldPrice ? `<span class="save">Save ${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ""}
              </div>
              <p class="pd-desc">${p.desc}</p>
              <div class="option-block">
                <div class="option-label"><span>Color — <b id="colLabel">${color.n}</b></span></div>
                <div class="color-dots">
                  ${p.colors.map((c, i) => `<span class="color-dot ${i === colorIdx ? "checked" : ""}" style="background:${c.h}" data-col="${i}" title="${c.n}"></span>`).join("")}
                </div>
              </div>
              <div class="option-block">
                <div class="option-label"><span>Size</span><span class="link" data-toast="Size guide available at checkout">Size Guide</span></div>
                <div class="size-options">
                  ${p.sizes.map((s) => `<button class="size-btn ${s === size ? "active" : ""}" data-sz="${s}">${s}</button>`).join("")}
                </div>
              </div>
              <div class="pd-actions">
                <button class="btn btn--primary" id="qvAdd"><span class="shine"></span>Add to Bag · ${CURRENCY(p.price)}</button>
                <button class="wish-btn ${onWish ? "wished" : ""}" id="qvWish" aria-label="Wishlist"><svg viewBox="0 0 24 24"><path d="M12 20.5C7 16.5 3 13.2 3 9.3 3 6.6 5.1 4.5 7.8 4.5c1.7 0 3.2.8 4.2 2.2 1-1.4 2.5-2.2 4.2-2.2 2.7 0 4.8 2.1 4.8 4.8 0 3.9-4 7.2-9 11.2Z"/></svg></button>
              </div>
              <span class="tiny muted">● ${p.fabric}</span>
            </div>
          </div>`;
        document.getElementById("qvClose").addEventListener("click", close);
        card.querySelectorAll(".color-dot").forEach((d) => d.addEventListener("click", () => { colorIdx = +d.dataset.col; render(); }));
        card.querySelectorAll(".size-btn").forEach((b) => b.addEventListener("click", () => { size = b.dataset.sz; render(); }));
        card.querySelectorAll("[data-toast]").forEach((x) => x.addEventListener("click", (e) => { e.preventDefault(); toast(x.dataset.toast, "info"); }));
        document.getElementById("qvWish").addEventListener("click", () => { Store.toggleWish(p.id); render(); toast(Store.isWished(p.id) ? "Saved to wishlist" : "Removed from wishlist", Store.isWished(p.id) ? "success" : "error"); });
        document.getElementById("qvAdd").addEventListener("click", () => {
          Store.addToCart(p, size, colorIdx, 1);
          toast("Added to your bag", "success", `${p.name} · ${color.n} · ${size}`);
        });
      };
      render();
      modal.classList.add("show");
      document.body.classList.add("no-scroll");
    };
    function close() { modal.classList.remove("show"); document.body.classList.remove("no-scroll"); }
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  }

  /* ---------- Toast ---------- */
  function hookToasts() {
    window.__toast = toast;
  }
  function toast(title, type = "success", msg = "") {
    const wrap = document.getElementById("toastWrap");
    const marks = { success: "✓", error: "✕", info: "·" };
    const t = el(`<div class="toast ${type}">
      <span class="t-ico">${marks[type] || "·"}</span>
      <div class="t-body"><div class="t-title">${title}</div>${msg ? `<div class="t-msg">${msg}</div>` : ""}</div>
      <button class="t-close" aria-label="Dismiss">✕</button>
    </div>`);
    wrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    const kill = () => { t.classList.remove("show"); setTimeout(() => t.remove(), 500); };
    t.querySelector(".t-close").addEventListener("click", kill);
    setTimeout(kill, type === "error" ? 4200 : 3200);
  }

  function bindFooterToasts() {
    document.querySelectorAll("[data-toast]").forEach((x) =>
      !x._bound && (x.addEventListener("click", (e) => { e.preventDefault(); toast(x.dataset.toast, "info"); }), x._bound = true));
  }

  /* ---------- helpers ---------- */
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }
  function stars(r) {
    let out = ""; for (let i = 1; i <= 5; i++) out += i <= Math.round(r) ? "★" : "☆"; return out;
  }

  /* ---------- reveal ---------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((n) => n.classList.add("visible"));
      return;
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    els.forEach((n) => obs.observe(n));
  }

  /* ---------- product card component ---------- */
  function productCard(p, delay = 0) {
    const onWish = Store.isWished(p.id);
    const sale = p.oldPrice && p.oldPrice > p.price;
    return `
    <article class="product-card reveal" style="animation-delay:${delay * 80}ms">
      <div class="pc-media">
        <a href="product.html?id=${p.id}">
          <img class="img-main" src="${pimg(p)}" alt="${p.name}" loading="lazy" data-id="${p.id}" onerror="window.svgArt&&!this.dataset.fb&&(this.dataset.fb=1,this.src=svgArt(byId(this.dataset.id)))">
          <img class="img-hover" src="${galleryImage(p, 1)}" alt="" loading="lazy" data-id="${p.id}" onerror="window.svgArt&&!this.dataset.fb&&(this.dataset.fb=1,this.src=svgArt(byId(this.dataset.id)))">
        </a>
        <div class="pc-badges">
          ${p.tag ? `<span class="pc-badge ${p.tag === "sale" ? "pc-badge--sale" : p.tag === "new" ? "pc-badge--new" : ""}">${p.tag}</span>` : ""}
          ${sale ? `<span class="pc-badge pc-badge--sale">−${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ""}
        </div>
        <div class="pc-actions">
          <button class="pc-act-btn ${onWish ? "wished" : ""}" onclick="Store.toggleWish('${p.id}');window.__uiRefresh&&window.__uiRefresh();window.__toast(Store.isWished('${p.id}')?'Saved to wishlist':'Removed from wishlist',Store.isWished('${p.id}')?'success':'error')" aria-label="Wishlist"><svg viewBox="0 0 24 24"><path d="M12 20.5C7 16.5 3 13.2 3 9.3 3 6.6 5.1 4.5 7.8 4.5c1.7 0 3.2.8 4.2 2.2 1-1.4 2.5-2.2 4.2-2.2 2.7 0 4.8 2.1 4.8 4.8 0 3.9-4 7.2-9 11.2Z"/></svg></button>
          <button class="pc-act-btn" onclick="window.__openQV('${p.id}')" aria-label="Quick view"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></button>
        </div>
      </div>
      <div class="pc-info">
        <span class="pc-cat">${cap(p.subcategory)}</span>
        <a class="pc-name" href="product.html?id=${p.id}">${p.name}</a>
        <div class="pc-foot">
          <div class="pc-price">${sale ? `<span class="old">${CURRENCY(p.oldPrice)}</span>` : ""}<span class="${sale ? "sale" : ""}">${CURRENCY(p.price)}</span></div>
          <div class="pc-rating"><span class="stars">${stars(p.rating)}</span>${p.rating}</div>
        </div>
        <button class="pc-add" onclick="window.__quickAdd('${p.id}')">Add to Bag</button>
      </div>
    </article>`;
  }

  function quickAdd(id) {
    const p = byId(id);
    const size = p.sizes[1] || p.sizes[0];
    Store.addToCart(p, size, 0, 1);
    toast("Added to your bag", "success", `${p.name} · ${p.colors[0].n} · ${size}`);
  }

  function boot() {
    window.__quickAdd = quickAdd;
    window.__uiRefresh = window.__uiRefresh || (() => {});
    window.__toast = window.__toast || toast;
  }

  return { initShell, productCard, galleryImage, cap, stars, toast, initReveal, el, boot };
})();

window.UI = UI;