/* ============================================================
   ATELIER — Shop page: filters, sort, search, pagination
   ============================================================ */

(function () {
  const { initShell, productCard, initReveal, toast } = window.UI;

  const state = {
    cats: [],        // selected categories (of 'all')
    tags: [],
    colors: [],
    sizes: [],
    rating: 0,
    price: 16000,
    sort: "featured",
    grid: 4,
    page: 1,
    q: ""
  };

  const PARAMS = { cat: "cats", tag: "tags" };
  const CATEGORIES = [...new Set(PRODUCTS.map((p) => p.category))];
  const TAGS = ["new", "bestSeller", "sale"];
  const COLOR_SET = [...new Set(PRODUCTS.flatMap((p) => p.colors.map((c) => c.n)))];
  const SIZE_SET = [...new Set(PRODUCTS.flatMap((p) => p.sizes))];
  const RATINGS = [4.9, 4.7, 4.5];

  function parseURL() {
    const u = new URLSearchParams(location.search);
    Object.entries(PARAMS).forEach(([pk, sk]) => {
      const v = u.get(pk);
      if (v) state[sk] = v.split(",").map((x) => x.toLowerCase());
    });
    if (u.get("tag")) state.tags = u.get("tag").split(",").map((x) => x.toLowerCase());
    if (u.get("q")) { state.q = u.get("q"); document.querySelector("#pageTitle").textContent = `Results for “${u.get("q")}”`; }
  }

  function filtered() {
    let list = PRODUCTS.slice();
    if (state.cats.length) list = list.filter((p) => state.cats.includes(p.category) || state.cats.includes(p.subcategory));
    if (state.tags.length) list = list.filter((p) => state.tags.some((t) => (p.tag || "").toLowerCase() === t.toLowerCase()));
    if (state.colors.length) list = list.filter((p) => p.colors.some((c) => state.colors.includes(c.n)));
    if (state.sizes.length) list = list.filter((p) => p.sizes.some((s) => state.sizes.includes(s)));
    if (state.rating) list = list.filter((p) => p.rating >= state.rating);
    if (state.price < 16000) list = list.filter((p) => Math.min(p.price, p.oldPrice || p.price) <= state.price);
    if (state.q) {
      const q = state.q.toLowerCase();
      list = list.filter((p) => (p.name + p.category + p.subcategory).toLowerCase().includes(q));
    }
    switch (state.sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "name": list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: // featured: bestsellers first, then new
        list.sort((a, b) => (b.tag === "bestseller") - (a.tag === "bestseller") || (b.tag === "new") - (a.tag === "new") || b.rating - a.rating);
    }
    return list;
  }

  function render() {
    const results = filtered();
    const grid = document.getElementById("productGrid");

    document.getElementById("resultCount").textContent = results.length;

    /* chips */
    const chips = [];
    if (state.q) chips.push(["Search: " + state.q, "q"]);
    state.cats.forEach((c) => chips.push([cap(c), "cats:" + c]));
    state.tags.forEach((t) => chips.push(["Collection: " + cap(t), "tags:" + t]));
    state.colors.forEach((c) => chips.push([c, "colors:" + c]));
    state.sizes.forEach((s) => chips.push(["Size " + s, "sizes:" + s]));
    state.rating && chips.push(["★ " + state.rating + "+", "rating"]);
    if (state.price < 16000) chips.push(["Under " + CURRENCY(state.price), "price"]);
    const chipBox = document.getElementById("activeChips");
    chipBox.style.display = chips.length ? "flex" : "none";
    chipBox.innerHTML = chips.map(([label, key]) => `<span class="chip"><b>${label}</b><button onclick="Shop.removeChip('${key}')" aria-label="Remove filter">✕</button></span>`).join("");

    /* grid */
    grid.className = "grid " + (state.grid === 3 ? "g-3" : "g-4");
    if (!results.length) {
      grid.innerHTML = "";
      document.getElementById("shopEmpty").style.display = "block";
      return;
    }
    document.getElementById("shopEmpty").style.display = "none";
    grid.innerHTML = results.map((p, i) => productCard(p, i)).join("");

    /* price slider fill */
    const slider = document.getElementById("priceMax");
    const max = +slider.max, min = +slider.min;
    const fill = ((state.price - min) / (max - min)) * 100;
    slider.style.setProperty("--fill", fill + "%");
    document.getElementById("priceMaxShown").textContent = CURRENCY(state.price);
    document.getElementById("priceShown").textContent = CURRENCY(999) + " – " + CURRENCY(state.price);

    initReveal();
  }

  function buildFilters() {
    /* category */
    document.getElementById("filters-cat").innerHTML = CATEGORIES.map((c) => filterCheckbox("cats", cap(c), c, state.cats.includes(c))).join("");
    /* tags */
    document.getElementById("filters-tag").innerHTML = TAGS.map((t) => {
      const key = t === "bestSeller" ? "bestseller" : t;
      const count = PRODUCTS.filter((p) => (p.tag || "").toLowerCase() === key).length;
      return filterCheckbox("tags", cap(t === "bestSeller" ? "Bestsellers" : t), key, state.tags.includes(key), count);
    }).join("");
    /* colors */
    document.getElementById("filters-color").innerHTML = `<div class="color-dots">${COLOR_SET.map((c) => {
      const prod = PRODUCTS.find((p) => p.colors.some((x) => x.n === c));
      const hex = prod.colors.find((x) => x.n === c).h;
      return `<span class="color-dot ${state.colors.includes(c) ? "checked" : ""}" style="background:${hex}" title="${c}" data-c="${c}"></span>`;
    }).join("")}</div>`;
    /* sizes */
    document.getElementById("filters-size").innerHTML = `<div class="flex gap-8" style="flex-wrap:wrap">${SIZE_SET.map((s) => `<span class="size-btn ${state.sizes.includes(s) ? "active" : ""}" data-sz="${s}" style="min-width:38px;height:38px;padding:0 10px">${s}</span>`).join("")}</div>`;
    /* rating */
    document.getElementById("filters-rating").innerHTML = RATINGS.map((r) => {
      const key = "r" + r;
      return filterCheckbox("rating", `${"★".repeat(5)} <span style="color:var(--ink-faint);font-weight:400">${r}+</span></span>`, key, state.rating === r, "", false);
    }).join("");

    bindFilterEvents();
  }

  function filterCheckbox(group, label, value, checked, count, showText = true) {
    return `<label class="filter-option ${checked ? "checked" : ""}" data-group="${group}" data-val="${value}">
      <span class="box"></span>
      <span>${label}${showText && count !== undefined ? `<span class="count">${count}</span>` : ""}</span>
    </label>`;
  }

  function bindFilterEvents() {
    document.querySelectorAll(".filter-option").forEach((opt) => {
      opt.addEventListener("click", () => {
        const g = opt.dataset.group, v = opt.dataset.val;
        if (g === "cats") toggle(state.cats, v);
        else if (g === "tags") toggle(state.tags, v);
        else if (g === "rating") { state.rating = state.rating === +v ? 0 : +v; opt.classList.toggle("checked", state.rating === +v); }
        buildFilters(); render(); rebuildURL();
      });
    });

    document.querySelectorAll(".color-dot").forEach((d) => {
      d.addEventListener("click", () => {
        const c = d.dataset.c;
        if (state.colors.includes(c)) state.colors = state.colors.filter((x) => x !== c);
        else state.colors.push(c);
        buildFilters(); render(); rebuildURL();
      });
    });

    document.querySelectorAll(".filter-body [data-sz]").forEach((s) => {
      s.addEventListener("click", () => {
        const v = s.dataset.sz;
        if (state.sizes.includes(v)) state.sizes = state.sizes.filter((x) => x !== v), s.classList.remove("active");
        else state.sizes.push(v), s.classList.add("active");
        render(); rebuildURL();
      });
    });

    document.getElementById("priceMax").addEventListener("input", (e) => {
      state.price = +e.target.value; render(); rebuildURL();
    });

    document.getElementById("sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
    document.getElementById("filterClear").addEventListener("click", () => { Shop.clearAll(); });
  }

  function toggle(arr, v) {
    const i = arr.indexOf(v);
    if (i >= 0) arr.splice(i, 1); else arr.push(v);
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function styleFilterGroups() {
    document.querySelectorAll(".filter-group").forEach((g) => {
      const title = g.querySelector(".filter-title");
      title.addEventListener("click", () => g.classList.toggle("collapsed"));
    });
    document.getElementById("filterToggle").addEventListener("click", () => {
      const p = document.getElementById("filterPanel");
      p.classList.toggle("hidden-mobile");
    });
  }

  function rebuildURL() {
    const u = new URLSearchParams();
    if (state.cats.length) u.set("cat", state.cats.join(","));
    if (state.tags.length) u.set("tag", state.tags.join(","));
    const qs = u.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
  }

  window.Shop = {
    clearAll() {
      Object.assign(state, { cats: [], tags: [], colors: [], sizes: [], rating: 0, price: 16000 });
      buildFilters(); render(); rebuildURL();
    },
    removeChip(key) {
      const [kind, val] = key.split(":");
      if (kind === "q") { state.q = ""; location.reload(); return; }
      if (kind === "cats") state.cats = state.cats.filter((x) => x !== val);
      if (kind === "tags") state.tags = state.tags.filter((x) => x !== val);
      if (kind === "colors") state.colors = state.colors.filter((x) => x !== val);
      if (kind === "sizes") state.sizes = state.sizes.filter((x) => x !== val);
      if (kind === "rating") state.rating = 0;
      if (kind === "price") state.price = 16000;
      buildFilters(); render(); rebuildURL();
    }
  };

  function mount() {
    initShell({ page: "shop" });
    parseURL();
    buildFilters();
    styleFilterGroups();
    render();
    document.querySelectorAll(".layout-btn").forEach((b) => b.addEventListener("click", () => {
      document.querySelectorAll(".layout-btn").forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      state.grid = +b.dataset.grid;
      render();
    }));
    const pl = document.getElementById("preloader");
    if (pl) setTimeout(() => pl.classList.add("done"), 700);
  }

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", mount) : mount();
  window.__shopMount = mount;
})();