/* ===========================================
   Peppharma – shopping cart
   =========================================== */

const CART_KEY = "peppharma_cart";
const FREE_SHIPPING_THRESHOLD = 799;
const DOMESTIC_SHIPPING = 69;

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function addToCart(productId) {
  const product = findProduct(productId);
  if (!product) return;
  const cart = loadCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  const lang = getLang();
  showNotification(`${product.name[lang]} ${t("common.addedToCart")}`);
}

function removeFromCart(productId) {
  const cart = loadCart().filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function updateQuantity(productId, qty) {
  const cart = loadCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, qty);
  saveCart(cart);
  updateCartBadge();
  renderCartPage();
}

function cartCount() {
  return loadCart().reduce((sum, item) => sum + item.qty, 0);
}

function cartSubtotal() {
  return loadCart().reduce((sum, item) => {
    const product = findProduct(item.id);
    return product ? sum + product.price * item.qty : sum;
  }, 0);
}

function updateCartBadge() {
  document.querySelectorAll("#cartCount").forEach((el) => {
    el.textContent = cartCount();
  });
}

function renderCartPage() {
  const tbody = document.getElementById("cartItemsBody");
  if (!tbody) return;

  const cart = loadCart();
  const lang = getLang();
  const emptyState = document.getElementById("cartEmpty");
  const layout = document.getElementById("cartLayout");

  if (cart.length === 0) {
    if (layout) layout.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    return;
  }
  if (layout) layout.style.display = "grid";
  if (emptyState) emptyState.style.display = "none";

  tbody.innerHTML = cart
    .map((item) => {
      const product = findProduct(item.id);
      if (!product) return "";
      return `
        <tr>
          <td>
            <div class="cart-product">
              <img src="${product.image}" alt="${product.name[lang]}">
              <div>
                <div class="name">${product.name[lang]}</div>
                <div class="cat">${t(categoryLabelKey(product.category))}</div>
              </div>
            </div>
          </td>
          <td>${formatPrice(product.price)}</td>
          <td>
            <div class="qty-control">
              <button type="button" data-qty-minus="${product.id}">-</button>
              <span>${item.qty}</span>
              <button type="button" data-qty-plus="${product.id}">+</button>
            </div>
          </td>
          <td>${formatPrice(product.price * item.qty)}</td>
          <td><button type="button" class="remove-btn" data-remove="${product.id}">${t("cart.remove")}</button></td>
        </tr>
      `;
    })
    .join("");

  tbody.querySelectorAll("[data-qty-minus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-qty-minus"));
      const item = cart.find((i) => i.id === id);
      updateQuantity(id, (item ? item.qty : 1) - 1);
    });
  });
  tbody.querySelectorAll("[data-qty-plus]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-qty-plus"));
      const item = cart.find((i) => i.id === id);
      updateQuantity(id, (item ? item.qty : 1) + 1);
    });
  });
  tbody.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(Number(btn.getAttribute("data-remove")));
    });
  });

  updateCartSummary();
}

function updateCartSummary() {
  const subtotalEl = document.getElementById("cartSubtotal");
  const shippingEl = document.getElementById("cartShipping");
  const totalEl = document.getElementById("cartTotal");
  if (!subtotalEl) return;

  const subtotal = cartSubtotal();
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DOMESTIC_SHIPPING;
  const total = subtotal + shipping;

  subtotalEl.textContent = formatPrice(subtotal);
  shippingEl.textContent = shipping === 0 ? (getLang() === "no" ? "Gratis" : "Free") : formatPrice(shipping);
  totalEl.textContent = formatPrice(total);
}

function initCheckout() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveCart([]);
    updateCartBadge();
    renderCartPage();
    showNotification(t("cart.checkoutSuccess"));
    form.reset();
  });
}

function showNotification(message) {
  let el = document.getElementById("notification");
  if (!el) {
    el = document.createElement("div");
    el.id = "notification";
    el.className = "notification";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(showNotification._timer);
  showNotification._timer = setTimeout(() => {
    el.classList.remove("show");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCartPage();
  initCheckout();
});

document.addEventListener("i18n:applied", () => {
  updateCartBadge();
  renderCartPage();
});
