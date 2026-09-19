/* ============================================================
   ATELIER — Store layer (localStorage backed)
   ============================================================ */

const Store = (() => {
  const K = {
    cart: "atl_cart_v1",
    wish: "atl_wish_v1",
    ord: "atl_orders_v1",
    user: "atl_user_v1",
    addr: "atl_addr_v1",
    promo: "atl_promo_v1"
  };

  const read = (key, fb) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fb; } catch { return fb; } };
  const write = (key, val) => localStorage.setItem(key, JSON.stringify(val));

  const PROMO_CODES = { "WELCOME10": 0.1, "ATELIER15": 0.15, "STYLE20": 0.2 };
  const promoRate = (code) => (code ? PROMO_CODES[code] || 0 : 0);

  /* ---------- Cart ---------- */
  const getCart = () => read(K.cart, []);
  const saveCart = (c) => { write(K.cart, c); emit(); };
  const cartKey = (p, size, color) => `${p.id}|${size}|${color}`;
  const cartCount = () => getCart().reduce((s, i) => s + i.qty, 0);
  const cartTotal = () => {
    const code = getPromo();
    const rate = promoRate(code);
    const sub = getCart().reduce((s, i) => s + i.price * i.qty, 0);
    const disc = sub * rate;
    const shipping = sub >= SHIPCFG.FREE || sub === 0 ? 0 : SHIPCFG.STD;
    return { sub, promo: disc, shipping, total: sub - disc + shipping };
  };
  const addToCart = (product, size, colorIdx, qty = 1) => {
    const color = product.colors[colorIdx];
    const k = cartKey(product, size, color.n);
    let cart = getCart();
    const found = cart.find((i) => i.key === k);
    if (found) found.qty += qty;
    else cart.push({
      key: k, id: product.id, name: product.name, price: product.price,
      size, color: color.n, colorHex: color.h, qty, img: pimg(product)
    });
    saveCart(cart);
    return cart;
  };
  const setQty = (key, qty) => {
    let cart = getCart();
    if (qty <= 0) cart = cart.filter((i) => i.key !== key);
    else cart = cart.map((i) => (i.key === key ? { ...i, qty } : i));
    saveCart(cart);
    return cart;
  };
  const removeFromCart = (key) => {
    const cart = getCart().filter((i) => i.key !== key);
    saveCart(cart);
    return cart;
  };
  const clearCart = () => saveCart([]);

  /* ---------- Wishlist ---------- */
  const getWish = () => read(K.wish, []);
  const saveWish = (w) => { write(K.wish, w); emit(); };
  const isWished = (id) => getWish().includes(id);
  const toggleWish = (id) => {
    let w = getWish();
    const on = !w.includes(id);
    w = on ? [...w, id] : w.filter((x) => x !== id);
    saveWish(w);
    return on;
  };
  const wishCount = () => getWish().length;
  const wishProducts = () => getWish().map(byId).filter(Boolean);

  /* ---------- Promo ---------- */
  const getPromo = () => read(K.promo, null);
  const applyPromo = (code) => {
    const c = (code || "").trim().toUpperCase();
    if (PROMO_CODES[c]) { write(K.promo, c); return { ok: true, code: c, rate: PROMO_CODES[c] }; }
    return { ok: false };
  };
  const clearPromo = () => write(K.promo, null);

  /* ---------- Orders ---------- */
  const getOrders = () => read(K.ord, []);
  const placeOrder = (payload) => {
    const orders = getOrders();
    const order = {
      id: "AT-" + Date.now().toString(36).toUpperCase().slice(-6),
      date: new Date().toISOString(),
      items: payload.items, subtotal: payload.subtotal, promo: payload.promo,
      shipping: payload.shipping, total: payload.total,
      shippingMethod: payload.shippingMethod,
      address: payload.address, email: payload.email,
      payment: payload.payment, status: "processing"
    };
    orders.unshift(order);
    write(K.ord, orders);
    clearCart(); clearPromo();
    return order;
  };
  const getOrder = (id) => getOrders().find((o) => o.id === id);

  /* ---------- User / auth ---------- */
  const getUsers = () => read("atl_users_v1", {});
  const saveUsers = (u) => write("atl_users_v1", u);
  const register = (name, email, pass) => {
    const users = getUsers();
    if (users[email.toLowerCase()]) return { ok: false, err: "An account with this email already exists." };
    users[email.toLowerCase()] = { name, pass, joined: new Date().toISOString() };
    saveUsers(users);
    write(K.user, { name, email: email.toLowerCase() });
    emit();
    return { ok: true };
  };
  const login = (email, pass) => {
    const users = getUsers();
    const u = users[email.toLowerCase()];
    if (!u || u.pass !== pass) return { ok: false, err: "Invalid credentials. Try again." };
    write(K.user, { name: u.name, email: email.toLowerCase() });
    emit();
    return { ok: true };
  };
  const logout = () => { localStorage.removeItem(K.user); emit(); };
  const currentUser = () => read(K.user, null);
  const isLoggedIn = () => !!currentUser();

  /* Addresses */
  const getAddresses = () => read(K.addr, []);
  const saveAddress = (addr) => { const a = getAddresses(); a.push({ ...addr, id: "ad" + Date.now().toString(36) }); write(K.addr, a); return a; };

  const _listeners = [];
  const emit = () => _listeners.forEach((f) => f());
  const on = (f) => _listeners.push(f);

  return {
    getCart, cartCount, cartTotal, addToCart, setQty, removeFromCart, clearCart,
    getWish, isWished, toggleWish, wishCount, wishProducts,
    getOrders, placeOrder, getOrder,
    register, login, logout, currentUser, isLoggedIn,
    getAddresses, saveAddress,
    applyPromo, getPromo, clearPromo, promoRate, on
  };
})();

window.Store = Store;