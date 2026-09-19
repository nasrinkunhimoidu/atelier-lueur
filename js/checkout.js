/* ============================================================
   ATELIER — Checkout & payment
   ============================================================ */

(function () {
  const { initShell, toast } = window.UI;

  let step = 1;
  let shipMethod = "std";
  let payMethod = "card";

  const SHIP = {
    std: { label: "Standard", price: null },     // null => threshold logic
    exp: { label: "Express", price: SHIPCFG.EXP },
    prm: { label: "Premium Same-Day", price: SHIPCFG.PRM }
  };

  function money(n) { return CURRENCY(n); }

  function luhn(num) {
    const d = num.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(d)) return false;
    let s = 0, alt = false;
    for (let i = d.length - 1; i >= 0; i--) {
      let n = +d[i];
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      s += n; alt = !alt;
    }
    return s % 10 === 0;
  }

  function fmtCard(e) {
    let v = e.target.value.replace(/\D/g, "").slice(0, 16);
    e.target.value = v.replace(/(.{4})/g, "$1 ").trim();
  }
  function fmtExp(e) {
    let v = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + " / " + v.slice(2);
    e.target.value = v;
  }
  function fmtCvc(e) { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 4); }

  function fieldErr(id, bad) {
    const f = document.getElementById(id);
    f.classList.toggle("invalid", bad);
    f.parentElement.classList.toggle("invalid", bad);
    f.classList.toggle("err", bad);
    return !bad;
  }

  function validateStep1() {
    let ok = true;
    const email = document.getElementById("cEmail").value.trim();
    ok &= fieldErr("cEmail", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !email);
    ok &= fieldErr("cFirst", !document.getElementById("cFirst").value.trim());
    ok &= fieldErr("cLast", !document.getElementById("cLast").value.trim());
    ok &= fieldErr("cAddr", !document.getElementById("cAddr").value.trim());
    ok &= fieldErr("cCity", !document.getElementById("cCity").value.trim());
    ok &= fieldErr("cZip", !document.getElementById("cZip").value.trim());
    ok &= fieldErr("cCountry", !document.getElementById("cCountry").value);
    ok &= fieldErr("cPhone", !document.getElementById("cPhone").value.trim());
    if (!ok) toast("Please complete the missing details", "error");
    return !!ok;
  }

  function validateCard() {
    let ok = true;
    const num = document.getElementById("cardNum").value.replace(/\s/g, "");
    ok &= fieldErr("cardNum", !luhn(num));
    const exp = document.getElementById("cardExp").value;
    const m = exp.match(/(\d{2})\s*\/\s*(\d{2})/);
    let dateOk = false;
    if (m) {
      const mm = +m[1], yy = 2000 + +m[2];
      const now = new Date();
      dateOk = mm >= 1 && mm <= 12 && (yy > now.getFullYear() || (yy === now.getFullYear() && mm >= now.getMonth() + 1));
    }
    ok &= fieldErr("cardExp", !dateOk);
    ok &= fieldErr("cardCvc", !/^\d{3,4}$/.test(document.getElementById("cardCvc").value));
    ok &= fieldErr("cardName", !document.getElementById("cardName").value.trim());
    return !!ok;
  }

  function renderSummary() {
    const items = Store.getCart();
    const box = document.getElementById("checkoutSummary");
    if (!items.length) { location.href = "cart.html"; return; }
    const promo = Store.getPromo();
    const sub = items.reduce((s, i) => s + i.price * i.qty, 0);
    const rate = { WELCOME10: .1, ATELIER15: .15, STYLE20: .2 }[promo] || 0;
    const discAmt = sub * rate;
    const stdThresholdApplied = sub >= SHIPCFG.FREE;
    const shipCost = shipMethod === "std" ? (stdThresholdApplied ? 0 : SHIPCFG.STD) : SHIP[shipMethod].price;
    const total = sub - discAmt + shipCost;

    box.innerHTML = `
      <h3 class="h-sm mb-16">Order Summary</h3>
      <div class="cs-items">
        ${items.map((i) => `<div class="cs-item">
          <img src="${i.img}" alt="${i.name}">
          <div><div class="nm">${i.name}</div><div class="mt">${i.color} · ${i.size}</div></div>
          <span class="cs-qty-badge">${i.qty}</span>
          <span class="pr">${money(i.price * i.qty)}</span>
        </div>`).join("")}
      </div>
      <div class="os-divider"></div>
      <div class="os-row"><span>Subtotal (${Store.cartCount()} items)</span><b>${money(sub)}</b></div>
      ${discAmt ? `<div class="os-row" style="color:var(--success)"><span>Discount (${promo})</span><b>− ${money(discAmt)}</b></div>` : ""}
      <div class="os-row"><span>Delivery · ${SHIP[shipMethod].label}</span><b>${shipCost === 0 ? "FREE" : money(shipCost)}</b></div>
      ${shipMethod === "std" && !stdThresholdApplied ? `<div class="os-row small" style="color:var(--taupe)">Free standard delivery on orders over ${CURRENCY(SHIPCFG.FREE)}</div>` : ""}
      <div class="os-divider"></div>
      <div class="os-total"><span class="lbl">Total Due</span><span class="amt">${money(total)}</span></div>
      <div class="os-row small faint">Inclusive of estimated tax. 30-day returns.</div>`;

    const payBtnAmt = document.getElementById("payAmt");
    if (payBtnAmt) payBtnAmt.textContent = money(total);
  }

  function setStep(n) {
    step = n;
    document.getElementById("panel1").style.display = n === 1 ? "" : "none";
    document.getElementById("panel2").style.display = n === 2 ? "" : "none";
    document.querySelectorAll(".step").forEach((s) => s.classList.toggle("active", +s.dataset.step <= n));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectMethod(sel, group) {
    document.querySelectorAll(`[data-${group}]`).forEach((c) => c.classList.remove("selected"));
    sel.classList.add("selected");
  }

  function mount() {
    initShell({ page: "shop" });

    if (!Store.getCart().length) { location.replace("cart.html"); return; }

    /* prefill from saved address or user */
    const user = Store.currentUser();
    const saved = Store.getAddresses()[Store.getAddresses().length - 1] || null;
    if (saved && saved.default) {
      document.getElementById("cFirst").value = saved.first || "";
      document.getElementById("cLast").value = saved.last || "";
      document.getElementById("cAddr").value = saved.addr || "";
      document.getElementById("cCity").value = saved.city || "";
      document.getElementById("cZip").value = saved.zip || "";
      document.getElementById("cPhone").value = saved.phone || "";
      if (saved.country) document.getElementById("cCountry").value = saved.country;
    } else if (user) {
      const names = user.name.split(" ");
      document.getElementById("cEmail").value = user.email;
      document.getElementById("cFirst").value = names[0] || "";
      document.getElementById("cLast").value = names.slice(1).join(" ") || "";
    }

    /* shipping method */
    document.querySelectorAll(".method-card[data-mid]").forEach((c) => c.addEventListener("click", () => {
      selectMethod(c, "mid"); shipMethod = c.dataset.mid; renderSummary();
    }));
    /* payment method */
    document.querySelectorAll(".method-card[data-pay]").forEach((c) => c.addEventListener("click", () => {
      selectMethod(c, "pay"); payMethod = c.dataset.pay;
      document.getElementById("cardFields").style.display = payMethod === "card" ? "" : "none";
      renderSummary();
    }));

    /* card formatting */
    document.getElementById("cardNum").addEventListener("input", fmtCard);
    document.getElementById("cardExp").addEventListener("input", fmtExp);
    document.getElementById("cardCvc").addEventListener("input", fmtCvc);

    /* step nav */
    document.getElementById("toStep2").addEventListener("click", () => { if (validateStep1()) setStep(2); });
    document.getElementById("backStep1").addEventListener("click", () => setStep(1));

    /* inputs revalidate on input */
    document.querySelectorAll("#panel1 input, #panel1 select").forEach((i) => i.addEventListener("input", () => i.classList.remove("err", "invalid") && i.parentElement.classList.remove("invalid")));

    /* place order */
    document.getElementById("placeOrder").addEventListener("click", () => {
      if (payMethod === "card" && !validateCard()) { toast("Please review your payment details", "error"); return; }
      if (payMethod !== "card") {
        if (!confirm("You'll be securely redirected to " + (payMethod === "paypal" ? "PayPal" : "Apple Pay") + " to confirm your payment. Continue?")) return;
      } else {
        const orderMomentary = document.getElementById("placeOrder");
        orderMomentary.classList.add("is-disabled");
        orderMomentary.innerHTML = `<span class="spin"></span> Processing payment…`;
        setTimeout(processOrder, 1400);
        return;
      }
      processOrder();
    });

    /* live total on button before we build next render */
    renderSummary();
    const pl = document.getElementById("preloader");
    if (pl) setTimeout(() => pl.classList.add("done"), 600);
  }

  function processOrder() {
    const items = Store.getCart();
    const sub = items.reduce((s, i) => s + i.price * i.qty, 0);
    const promo = Store.getPromo();
    const rate = { WELCOME10: .1, ATELIER15: .15, STYLE20: .2 }[promo] || 0;
    const discAmt = sub * rate;
    const shipCost = shipMethod === "std" ? (sub >= SHIPCFG.FREE ? 0 : SHIPCFG.STD) : SHIP[shipMethod].price;

    const address = {
      email: document.getElementById("cEmail").value.trim(),
      first: document.getElementById("cFirst").value.trim(),
      last: document.getElementById("cLast").value.trim(),
      addr: document.getElementById("cAddr").value.trim(),
      city: document.getElementById("cCity").value.trim(),
      zip: document.getElementById("cZip").value.trim(),
      country: document.getElementById("cCountry").value,
      phone: document.getElementById("cPhone").value.trim()
    };

    if (document.getElementById("saveAddr").checked) Store.saveAddress({ ...address, default: true });

    const order = Store.placeOrder({
      items, subtotal: sub, promo: discAmt, shipping: shipCost, total: sub - discAmt + shipCost,
      shippingMethod: SHIP[shipMethod].label, address, payment: payMethod, email: address.email,
      cardtail: payMethod === "card" ? document.getElementById("cardNum").value.replace(/\s/g, "").slice(-4) : ""
    });

    location.href = "confirmation.html?ref=" + order.id;
  }

  /* spin animation for process */
  const sp = document.createElement("style");
  sp.textContent = `.spin{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:rot .7s linear infinite;display:inline-block}@keyframes rot{to{transform:rotate(360deg)}}`;
  document.head.appendChild(sp);

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", mount) : mount();
  window.__checkoutMount = mount;
})();