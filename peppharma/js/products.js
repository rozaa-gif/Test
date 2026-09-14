/* ===========================================
   Peppharma – product catalogue
   =========================================== */

const PRODUCTS = [
  {
    id: 1,
    category: "vitamins",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&h=500&fit=crop",
    name: { no: "Multivitamin Daglig", en: "Daily Multivitamin" },
    desc: {
      no: "Komplett multivitamin med 12 vitaminer og mineraler for hverdagen.",
      en: "A complete multivitamin with 12 vitamins and minerals for everyday life.",
    },
  },
  {
    id: 2,
    category: "vitamins",
    price: 199,
    image:
      "https://images.unsplash.com/photo-1616671276441-2f2d3d1c9b2b?w=500&h=500&fit=crop",
    name: { no: "Vitamin D3 + K2 dråper", en: "Vitamin D3 + K2 Drops" },
    desc: {
      no: "Lettopptakelige dråper som støtter immunforsvar og beinhelse.",
      en: "Easy-to-absorb drops that support your immune system and bone health.",
    },
  },
  {
    id: 3,
    category: "omega",
    price: 279,
    image:
      "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=500&h=500&fit=crop",
    name: { no: "Omega-3 Fiskeoljekapsler", en: "Omega-3 Fish Oil Capsules" },
    desc: {
      no: "Renset fiskeolje rik på EPA og DHA for hjerte og hjerne.",
      en: "Purified fish oil rich in EPA and DHA for heart and brain health.",
    },
  },
  {
    id: 4,
    category: "vitamins",
    price: 229,
    image:
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=500&h=500&fit=crop",
    name: { no: "Magnesium Bisglycinat", en: "Magnesium Bisglycinate" },
    desc: {
      no: "Skånsom magnesiumform som bidrar til normal muskelfunksjon.",
      en: "A gentle form of magnesium that supports normal muscle function.",
    },
  },
  {
    id: 5,
    category: "protein",
    price: 449,
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&h=500&fit=crop",
    name: { no: "Whey Protein Sjokolade 900g", en: "Whey Protein Chocolate 900g" },
    desc: {
      no: "Høykvalitets myseprotein for muskelvedlikehold og restitusjon.",
      en: "High-quality whey protein for muscle maintenance and recovery.",
    },
  },
  {
    id: 6,
    category: "wellness",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1611071536052-5c7f52faf2e1?w=500&h=500&fit=crop",
    name: { no: "Kollagen Pulver", en: "Collagen Powder" },
    desc: {
      no: "Marin kollagen som støtter hud, hår og ledd.",
      en: "Marine collagen that supports skin, hair and joints.",
    },
  },
  {
    id: 7,
    category: "wellness",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1550572017-9a3a3f0e7e7f?w=500&h=500&fit=crop",
    name: { no: "Probiotika Kapsler", en: "Probiotic Capsules" },
    desc: {
      no: "Levende melkesyrebakterier som støtter en sunn tarmflora.",
      en: "Live cultures that support a healthy gut flora.",
    },
  },
  {
    id: 8,
    category: "protein",
    price: 429,
    image:
      "https://images.unsplash.com/photo-1622484212385-e8ec9c05aaa3?w=500&h=500&fit=crop",
    name: { no: "Vegansk Protein Vanilje", en: "Vegan Protein Vanilla" },
    desc: {
      no: "Plantebasert proteinblanding av ert og ris med vaniljesmak.",
      en: "Plant-based pea and rice protein blend with vanilla flavour.",
    },
  },
];

function categoryLabelKey(category) {
  const map = {
    vitamins: "products.filterVitamins",
    protein: "products.filterProtein",
    omega: "products.filterOmega",
    wellness: "products.filterWellness",
  };
  return map[category] || "products.filterAll";
}

function formatPrice(price) {
  return `${price} ${t("common.currency")}`;
}

function productCardHTML(p) {
  const lang = getLang();
  return `
    <div class="product-card" data-category="${p.category}">
      <img class="product-image" src="${p.image}" alt="${p.name[lang]}" loading="lazy">
      <div class="product-info">
        <p class="product-category">${t(categoryLabelKey(p.category))}</p>
        <h3 class="product-name">${p.name[lang]}</h3>
        <p class="product-description">${p.desc[lang]}</p>
        <p class="product-price">${formatPrice(p.price)}</p>
        <button class="btn add-to-cart-btn" data-add-to-cart="${p.id}">
          ${t("products.addToCart")}
        </button>
      </div>
    </div>
  `;
}

function renderProductList(container, list) {
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = `<p class="empty-state">${t("products.noResults")}</p>`;
    return;
  }
  container.innerHTML = list.map(productCardHTML).join("");
  container.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart(Number(btn.getAttribute("data-add-to-cart")));
    });
  });
}

function initFeaturedProducts() {
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;
  renderProductList(grid, PRODUCTS.slice(0, 4));
  document.addEventListener("i18n:applied", () => renderProductList(grid, PRODUCTS.slice(0, 4)));
}

function initProductsPage() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  let activeCategory = "all";

  function renderCurrent() {
    const list =
      activeCategory === "all"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === activeCategory);
    renderProductList(grid, list);
  }

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.getAttribute("data-filter");
      renderCurrent();
    });
  });

  renderCurrent();
  document.addEventListener("i18n:applied", renderCurrent);
}

document.addEventListener("DOMContentLoaded", () => {
  initFeaturedProducts();
  initProductsPage();
});
