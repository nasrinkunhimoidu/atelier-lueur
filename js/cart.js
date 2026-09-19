/* ============================================================
   ATELIER — Cart page
   ============================================================ */

(function () {
  const { initShell, productCard, initReveal, toast } = window.UI;

  function render() {
    const items = Store.getCart();
    const list = document.getElementById("cartList");
    const summary = document.getElementById("orderSummary");
    const upsellSection = document.getElementById("upsellSection");

    if (!items.length) {
      list.innerHTML = `<div class="empty-state"><span class="es-icon">∅</span><h3>Your bag is feeling light</h3><p>Fill it with pieces that will be reached for, again and again.</p><a class="btn btn--primary" href="shop.html">Explore the Collection <span class="ico">→</span></a></div>`;
      summary.innerHTML = `
        <h3 class="h-sm mb-16">Order Summary</h3>
        <div class="os-row"><span>Subtotal</span><b>₹0</b></div>
        <p class="muted small mt-8" style="font-size:12.5px">Add items to see pricing.</p>`;
      upsellSection.style.display = "none";
      return;
    }

    const e = Store.cartTotal();

    list.innerHTML = items.map((it, idx) => {
      return `
      <div class="cart-row" style="animation-delay:${idx * 70}ms">
        <a href="product.html?id=${it.id}"><img src="${it.img}" alt="${it.name}"></a>
        <div class="cr-main">
          <a class="name" href="product.html?id=${it.id}">${it.name}</a>
          <span class="meta">Colour: ${it.color} &nbsp;·&nbsp; Size: ${it.size}</span>
          <span class="meta">${it.id.startsWith("a") || it.id.startsWith("f") ? "Free standard returns" : "In stock · ships in 24h"}</span>
          <div class="cr-controls">
            <div class="qty">
              <button onclick="Cart.qty('${it.key}',${it.qty - 1})">−</button>
              <span class="num">${it.qty}</span>
              <button onclick="Cart.qty('${it.key}',${it.qty + 1})">+</button>
            </div>
            <span class="price-each">${CURRENCY(it.price)} each</span>
            <button class="cr-remove" onclick="Cart.remove('${it.key}')"><svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg> Remove</button>
          </div>
        </div>
        <div class="cr-total">
          <span class="amt">${CURRENCY(it.price * it.qty)}</span>
        </div>
      </div>`;
    }).join("");

    const promoCode = Store.getPromo();
    summary.innerHTML = `
      <h3 class="h-sm mb-8">Order Summary</h3>

      <div class="promo-row">
        <input type="text" id="promoInput" placeholder="Promo code (try WELCOME10)" value="${promoCode || ""}">
        <button class="btn btn--ghost btn--sm" id="promoBtn">Apply</button>
      </div>
      ${promoCode ? `<div class="promo-status ok">✓ ${promoCode} applied — saving ${CURRENCY(e.promo)}</div>` : `<div class="promo-status">Shipping is free over ${CURRENCY(SHIPCFG.FREE)}.</div>`}

      <div class="os-divider"></div>
      <div class="os-row"><span>Subtotal</span><b>${CURRENCY(e.sub)}</b></div>
      ${e.promo ? `<div class="os-row" style="color:var(--success)"><span>Discount (${promoCode})</span><b>− ${CURRENCY(e.promo)}</b></div>` : ""}
      <div class="os-row"><span>Shipping</span><b>${e.shipping === 0 ? "FREE" : CURRENCY(e.shipping)}</b></div>
      ${e.shipping > 0 ? `<div class="os-row small" style="color:var(--taupe)">Add ${CURRENCY(SHIPCFG.FREE - e.sub)} more for free shipping</div>` : ""}
      ${e.sub < SHIPCFG.FREE && e.sub > 0 ? `<div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, (e.sub / SHIPCFG.FREE) * 100)}%"></div></div>` : ""}
      <div class="os-divider"></div>
      <div class="os-total"><span class="lbl">Estimated Total</span><span class="amt">${CURRENCY(e.total)}</span></div>
      <div class="os-row small faint" style="padding-top:4px">Taxes calculated at checkout.</div>
      <a class="btn btn--primary btn--block mt-16" href="checkout.html">Proceed to Checkout <span class="ico">→</span></a>
      <a class="btn btn--ghost btn--block" href="shop.html">Continue Shopping</a>`;

    document.getElementById("promoBtn").addEventListener("click", () => {
      const r = Store.applyPromo(document.getElementById("promoInput").value);
      if (r.ok) toast("Promo applied", "success", `${r.code} — ${Math.round(r.rate * 100)}% off`);
      else toast("Invalid promo code", "error", "Try WELCOME10, ATELIER15 or STYLE20");
      render();
    });
    document.getElementById("promoInput").addEventListener("keydown", (ev) => { if (ev.key === "Enter") document.getElementById("promoBtn").click(); });

    /* upsells */
    upsellSection.style.display = "block";
    const inBag = new Set(items.map((i) => i.id));
    const ups = PRODUCTS.filter((p) => !inBag.has(p.id)).slice(0, 4);
    document.getElementById("upsellGrid").innerHTML = ups.map((p, i) => productCard(p, i)).join("");
  }

  window.Cart = {
    qty: (key, n) => { Store.setQty(key, n); render(); },
    remove: (key) => { Store.removeFromCart(key); toast("Removed from bag", "error"); render(); }
  };

  function mount() {
    initShell({ page: "shop" });

    /* free shipping progress bar styles */
    const style = document.createElement("style");
    style.textContent = `
      .progress-track { height: 4px; background: var(--line); border-radius: 4px; margin: 10px 0 2px; overflow: hidden; }
      .progress-fill { height: 100%; background: linear-gradient(90deg, var(--sand-deep), var(--taupe-deep)); border-radius: 4px; transition: width .6s var(--ease); }`;
    document.head.appendChild(style);

    render();
    Store.on(render);
    initReveal();
    const pl = document.getElementById("preloader");
    if (pl) setTimeout(() => pl.classList.add("done"), 600);
  }

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", mount) : mount();
  window.__cartMount = mount;
})();