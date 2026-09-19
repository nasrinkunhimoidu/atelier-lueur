/* ============================================================
   ATELIER — Order confirmation
   ============================================================ */

(function () {
  const { initShell, cap } = window.UI;

  function mount() {
    initShell({ page: "shop" });

    const ref = new URLSearchParams(location.search).get("ref");
    const order = ref ? Store.getOrder(ref) : null;

    if (!order) { document.querySelector(".order-ticket").style.display = "none"; document.querySelector(".success-hero h1").textContent = "Order not found"; return; }

    document.getElementById("ordId").textContent = order.id;
    document.getElementById("ordDate").textContent = new Date(order.date).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" });

    const items = order.items;
    document.getElementById("ordSummary").innerHTML = `
      <h3 class="h-sm mb-8">Items · ${items.length}</h3>
      ${items.map((i) => `<div class="cs-item">
        <img src="${i.img}" alt="${i.name}">
        <div><div class="nm">${i.name}</div><div class="mt">${i.color} · ${i.size}</div></div>
        <span class="cs-qty-badge">${i.qty}</span>
        <span class="pr">${CURRENCY(i.price * i.qty)}</span>
      </div>`).join("")}
      <div class="os-divider"></div>
      <div class="os-row"><span>Subtotal</span><b>${CURRENCY(order.subtotal)}</b></div>
      ${order.promo ? `<div class="os-row" style="color:var(--success)"><span>Discount</span><b>− ${CURRENCY(order.promo)}</b></div>` : ""}
      <div class="os-row"><span>Delivery · ${order.shippingMethod}</span><b>${order.shipping === 0 ? "FREE" : CURRENCY(order.shipping)}</b></div>`;

    const a = order.address;
    document.getElementById("ordAddr").innerHTML = `${a.first} ${a.last}<br>${a.addr}, ${a.city} ${a.zip}<br>${a.country}<br>${a.email}`;
    document.getElementById("ordPay").textContent = order.payment === "card" ? "Card ·••• " + (order.cardtail || "4242") : cap(order.payment) + " · Instant confirmation";
    document.getElementById("ordTotal").textContent = CURRENCY(order.total);

    const pl = document.getElementById("preloader");
    if (pl) setTimeout(() => pl.classList.add("done"), 700);
  }

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", mount) : mount();
  window.__confirmMount = mount;
})();