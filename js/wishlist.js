/* ============================================================
   ATELIER — Wishlist page
   ============================================================ */

(function () {
  const { initShell, productCard, initReveal, toast } = window.UI;

  function render() {
    const grid = document.getElementById("wishGrid");
    const items = Store.wishProducts();
    if (!items.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><span class="es-icon">♡</span><h3>Your wishlist is empty</h3><p>Tap the heart on any piece to save it here for later.</p><a class="btn btn--primary" href="shop.html">Discover Pieces <span class="ico">→</span></a></div>`;
      return;
    }
    grid.innerHTML = items.map((p, i) => productCard(p, i)).join("");
    initReveal();
  }

  function mount() {
    initShell({ page: "wishlist" });
    render();
    Store.on(render);
    const pl = document.getElementById("preloader");
    if (pl) setTimeout(() => pl.classList.add("done"), 700);
  }

  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", mount) : mount();
  window.__wishMount = mount;
})();