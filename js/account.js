/* ============================================================
   ATELIER — Account: auth + dashboard
   ============================================================ */

(function () {
  const { initShell, toast, cap } = window.UI;

  let view = "overview";

  /* ---------------- AUTH ---------------- */
  function renderAuth() {
    const wrap = document.getElementById("authView");
    wrap.innerHTML = `
      <div class="auth-card reveal visible">
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="login">Sign In</button>
          <button class="auth-tab" data-tab="register">Create Account</button>
        </div>
        <form id="loginForm">
          <div class="field"><label>Email</label><input type="email" id="lgEmail" placeholder="you@example.com"></div>
          <div class="field pass-wrap">
            <label>Password</label>
            <input type="password" id="lgPass" placeholder="••••••••">
            <button type="button" class="pass-toggle" data-eye="lgPass">👁</button>
          </div>
          <button class="btn btn--primary btn--block" type="submit">Sign In <span class="ico">→</span></button>
        </form>
        <form id="regForm" style="display:none">
          <div class="field"><label>Full name</label><input type="text" id="rgName" placeholder="Cleo Reyes"></div>
          <div class="field"><label>Email</label><input type="email" id="rgEmail" placeholder="you@example.com"></div>
          <div class="field pass-wrap">
            <label>Password</label>
            <input type="password" id="rgPass" placeholder="Min 6 characters">
            <button type="button" class="pass-toggle" data-eye="rgPass">👁</button>
          </div>
          <button class="btn btn--primary btn--block" type="submit">Create Account <span class="ico">→</span></button>
        </form>
        <div class="os-divider"></div>
        <button class="btn btn--sand btn--block" id="demoBtn">Try a Demo Account</button>
        <p class="auth-foot">Checkout as guest? <a href="checkout.html" style="color:var(--taupe-deep)">Continue without an account →</a></p>
      </div>`;

    wrap.querySelectorAll(".auth-tab").forEach((t) => t.addEventListener("click", () => {
      wrap.querySelectorAll(".auth-tab").forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      document.getElementById("loginForm").style.display = t.dataset.tab === "login" ? "" : "none";
      document.getElementById("regForm").style.display = t.dataset.tab === "register" ? "" : "none";
    }));

    wrap.querySelectorAll(".pass-toggle").forEach((b) => b.addEventListener("click", () => {
      const inp = document.getElementById(b.dataset.eye);
      inp.type = inp.type === "password" ? "text" : "password";
    }));

    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("lgEmail").value.trim();
      const pass = document.getElementById("lgPass").value;
      if (!email || !pass) return toast("Please fill in all fields", "error");
      const r = Store.login(email, pass);
      r.ok ? (toast("Welcome back", "success", email), mount()) : toast(r.err, "error");
    });

    document.getElementById("regForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("rgName").value.trim();
      const email = document.getElementById("rgEmail").value.trim();
      const pass = document.getElementById("rgPass").value;
      if (!name || !email || !pass) return toast("Please fill in all fields", "error");
      if (pass.length < 6) return toast("Password must be 6+ characters", "error");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast("Enter a valid email", "error");
      const r = Store.register(name, email, pass);
      r.ok ? (toast("Account created", "success", "Welcome to the Atelier Lueur circle"), mount()) : toast(r.err, "error");
    });

    document.getElementById("demoBtn").addEventListener("click", () => {
      const r = Store.login("demo@atelierlueur.com", "demo1234");
      if (!r.ok) Store.register("Demo Member", "demo@atelierlueur.com", "demo1234");
      toast("Signed in as demo member", "success", "demo@atelierlueur.com");
      mount();
    });
  }

  /* ---------------- DASHBOARD ---------------- */
  function renderDash() {
    const user = Store.currentUser();
    document.getElementById("dashView").style.display = "grid";
    document.getElementById("authView").style.display = "none";
    document.getElementById("heroTitle").textContent = "Bonjour, " + user.name.split(" ")[0];
    document.getElementById("heroSub").textContent = user.email;

    const initials = user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    const myOrders = Store.getOrders().filter((o) => o.email.toLowerCase() === user.email.toLowerCase());

    document.getElementById("acctSide").innerHTML = `
      <div class="profile">
        <span class="avatar-lg">${initials}</span>
        <div><b class="small">${user.name}</b><br><span class="email-txt">${user.email}</span></div>
      </div>
      <button class="acct-nav-btn ${view === "overview" ? "active" : ""}" data-p="overview"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>Overview</button>
      <button class="acct-nav-btn ${view === "orders" ? "active" : ""}" data-p="orders"><svg viewBox="0 0 24 24"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>Orders <span style="margin-left:auto">${myOrders.length}</span></button>
      <button class="acct-nav-btn ${view === "addresses" ? "active" : ""}" data-p="addresses"><svg viewBox="0 0 24 24"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>Addresses</button>
      <button class="acct-nav-btn ${view === "settings" ? "active" : ""}" data-p="settings"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.5-2.3 1A7 7 0 0 0 14 5.3L13.7 3h-4l-.3 2.3a7 7 0 0 0-1.6.9l-2.3-1-2 3.5 2 1.5a7 7 0 0 0 0 1.6l-2 1.5 2 3.5 2.3-1a7 7 0 0 0 1.6.9l.3 2.3h4l.3-2.3a7 7 0 0 0 1.6-.9l2.3 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z"/></svg>Settings</button>
      <div style="border-top:1px solid var(--line-soft);margin:10px 0"></div>
      <button class="acct-nav-btn" id="logoutBtn"><svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>Sign Out</button>`;

    document.getElementById("acctSide").querySelectorAll(".acct-nav-btn[data-p]").forEach((b) => b.addEventListener("click", () => { view = b.dataset.p; renderDash(); }));
    document.getElementById("logoutBtn").addEventListener("click", () => {
      Store.logout();
      toast("Signed out", "info");
      location.reload();
    });

    renderPanel(user, myOrders);
  }

  function orderStatus(o) {
    const map = { processing: "Processing", shipped: "Shipped", delivered: "Delivered" };
    const cls = o.status || "processing";
    const label = map[cls] || cls;
    const pill = cls === "delivered" ? "delivered" : cls === "shipped" ? "shipped" : "processing";
    return `<span class="status-pill ${pill}">${label}</span>`;
  }

  function renderPanel(user, myOrders) {
    const panel = document.getElementById("acctPanel");
    const addr = Store.getAddresses().filter((a) => a.default !== false).slice(0, 3);

    if (view === "overview") {
      panel.innerHTML = `
        <h2 class="h-md">Overview</h2>
        <p class="sub">Here's what's happening with your Atelier Lueur.</p>
        <div class="grid g-3">
          <div class="order-summary" style="position:static;padding:24px">
            <div class="tiny" style="letter-spacing:.2em;color:var(--ink-faint)">ORDERS PLACED</div>
            <div class="feature-num mt-8">${myOrders.length}</div>
            <div class="muted small mt-8">${myOrders.reduce((s, o) => s + o.items.length, 0)} items in total</div>
          </div>
          <div class="order-summary" style="position:static;padding:24px">
            <div class="tiny" style="letter-spacing:.2em;color:var(--ink-faint)">WISHLIST</div>
            <div class="feature-num mt-8">${Store.wishCount()}</div>
            <div class="muted small mt-8"><a href="wishlist.html" style="color:var(--taupe-deep)">View saved pieces →</a></div>
          </div>
          <div class="order-summary" style="position:static;padding:24px">
            <div class="tiny" style="letter-spacing:.2em;color:var(--ink-faint)">LIFETIME SPEND</div>
            <div class="feature-num mt-8">${CURRENCY(myOrders.reduce((s, o) => s + o.total, 0))}</div>
            <div class="muted small mt-8">Across ${myOrders.length} ${myOrders.length === 1 ? "order" : "orders"}</div>
          </div>
        </div>
        ${myOrders.length ? `
        <div class="flex-between mb-16" style="margin-top:34px"><h3 class="h-sm">Recent orders</h3><a href="#" onclick="Account.go('orders');return false" style="color:var(--taupe-deep);font-size:13px">View all →</a></div>
        ${orderCard(myOrders[0])}` : `
        <div class="empty-state mt-32"><span class="es-icon">◇</span><h3>No orders yet</h3><p>Your first order is one click away.</p><a class="btn btn--primary" href="shop.html">Start Shopping</a></div>`}`;

    } else if (view === "orders") {
      panel.innerHTML = `
        <h2 class="h-md">Orders</h2>
        <p class="sub">${myOrders.length ? "Your order history with live status." : "No orders placed yet."}</p>
        ${myOrders.length ? myOrders.map(orderCard).join("") : `<div class="empty-state"><span class="es-icon">∅</span><h3>Nothing here yet</h3><p>When you place an order, it will appear here.</p></div>`}`;

    } else if (view === "addresses") {
      panel.innerHTML = `
        <h2 class="h-md">Address book</h2>
        <p class="sub">Saved addresses for faster checkout.</p>
        <div class="grid gap-16" id="addrGrid">
          ${addr.map((a) => `
            <div class="saved-addr ${a.default ? "selected" : ""}">
              <div class="nm">${a.first} ${a.last} ${a.default ? "<span class='status-pill delivered' style='margin-left:6px'>Default</span>" : ""}</div>
              <p>${a.addr}<br>${a.city} ${a.zip}<br>${a.country}</p>
              <div class="ed" data-del-addr="${a.id}" style="cursor:pointer">Remove</div>
            </div>`).join("") || `<button class="pref-btn" id="addAddr" style="grid-column:1/-1">＋ Add your first address</button>`}
        </div>
        <div id="addrFormWrap" style="display:none" class="mt-16">
          <div class="field-row">
            <div class="field"><label>First name</label><input id="adFirst" placeholder="Cleo"></div>
            <div class="field"><label>Last name</label><input id="adLast" placeholder="Reyes"></div>
          </div>
          <div class="field"><label>Address</label><input id="adAddr" placeholder="Rue de Rivoli 42"></div>
          <div class="field-row">
            <div class="field"><label>City</label><input id="adCity"></div>
            <div class="field"><label>Postcode</label><input id="adZip"></div>
          </div>
          <div class="field"><label>Country</label><input id="adCountry" placeholder="United Kingdom"></div>
          <div class="field"><label>Phone</label><input id="adPhone"></div>
          <div class="flex gap-12"><button class="btn btn--primary btn--sm" id="adSave">Save Address</button><button class="btn btn--ghost btn--sm" id="adCancel">Cancel</button></div>
        </div>`;

      const addBtn = document.getElementById("addAddr");
      if (addBtn) addBtn.addEventListener("click", () => document.getElementById("addrFormWrap").style.display = "");
      document.getElementById("adSave") && document.getElementById("adSave").addEventListener("click", () => {
        const vals = { first: val("adFirst"), last: val("adLast"), addr: val("adAddr"), city: val("adCity"), zip: val("adZip"), country: val("adCountry"), phone: val("adPhone") };
        if (Object.values(vals).some((v) => !v)) return toast("Complete all fields", "error");
        Store.saveAddress({ ...vals, default: true });
        toast("Address saved", "success");
        renderDash();
      });
      document.getElementById("adCancel") && document.getElementById("adCancel").addEventListener("click", () => document.getElementById("addrFormWrap").style.display = "none");
      panel.querySelectorAll("[data-del-addr]").forEach((b) => b.addEventListener("click", () => {
        const id = b.dataset.delAddr;
        const list = Store.getAddresses().filter((a) => a.id !== id);
        localStorage.setItem("atl_addr_v1", JSON.stringify(list));
        toast("Address removed", "error");
        renderDash();
      }));

    } else if (view === "settings") {
      panel.innerHTML = `
        <h2 class="h-md">Settings</h2>
        <p class="sub">Keep your details up to date.</p>
        <div class="addr-card">
          <h4 class="h-sm mb-24">Profile</h4>
          <div class="field"><label>Full name</label><input id="setName" value="${user.name}"></div>
          <div class="field"><label>Email</label><input id="setEmail" value="${user.email}" disabled style="opacity:.6"></div>
          <div class="field"><label>New password (optional)</label><input type="password" id="setPass" placeholder="Min 6 characters"></div>
          <button class="btn btn--primary btn--sm" id="setSave">Save Changes</button>
          <div class="os-divider mt-24"></div>
          <h4 class="h-sm mb-16">Newsletter</h4>
          <label class="saved-addr" style="display:flex;align-items:center;gap:12px"><input type="checkbox" id="setNews" checked style="accent-color:var(--ink)">Yes, keep me posted on drops and members-only offers.</label>
        </div>`;
      document.getElementById("setSave").addEventListener("click", () => {
        const name = document.getElementById("setName").value.trim();
        if (!name) return toast("Name can't be empty", "error");
        const users = JSON.parse(localStorage.getItem("atl_users_v1") || "{}");
        const cur = Store.currentUser();
        if (users[cur.email]) users[cur.email].name = name;
        localStorage.setItem("atl_users_v1", JSON.stringify(users));
        localStorage.setItem("atl_user_v1", JSON.stringify({ ...cur, name }));
        const pass = document.getElementById("setPass").value;
        if (pass && pass.length < 6) return toast("Password must be 6+ characters", "error");
        if (pass) users[cur.email].pass = pass, localStorage.setItem("atl_users_v1", JSON.stringify(users));
        toast("Settings saved", "success");
        if (pass) toast("Password updated", "success");
        renderDash();
      });
    }
  }

  function val(id) { return document.getElementById(id).value.trim(); }

  function orderCard(o) {
    return `
    <div class="order-card">
      <div class="order-head">
        <div><span class="oid">${o.id}</span><br><span class="odate">Placed ${new Date(o.date).toLocaleDateString("en-US", { dateStyle: "long" })}</span></div>
        ${orderStatus(o)}
      </div>
      <div class="order-items">
        ${o.items.slice(0, 4).map((i) => `
          <div class="oi-row"><img src="${i.img}" alt="">${i.name} <span class="q">${i.qty} × ${CURRENCY(i.price)}</span></div>`).join("")}
      </div>
      <div class="order-foot">
        <span>${o.shippingMethod} · ${o.items.length} ${o.items.length === 1 ? "item" : "items"}</span>
        <span class="ta">${CURRENCY(o.total)}</span>
      </div>
    </div>`;
  }

  window.Account = {
    go: (v) => { view = v; renderDash(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  function mount() {
    initShell({ page: "account" });
    const hash = location.hash.replace("#", "");
    if (hash === "orders" && Store.isLoggedIn()) view = "orders";

    if (Store.isLoggedIn()) {
      renderDash();
      const pl = document.getElementById("preloader");
      if (pl) setTimeout(() => pl.classList.add("done"), 700);
    } else {
      renderAuth();
      const pl = document.getElementById("preloader");
      if (pl) setTimeout(() => pl.classList.add("done"), 700);
    }
  }

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", mount) : mount();
  window.__acctMount = mount;
})();