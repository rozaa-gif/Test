/* ROZA – site behaviour: layout, language, currency, bag, cookie consent, forms and pages.
   No third-party scripts are loaded; optional (statistics/marketing) scripts may only be added
   inside loadOptionalScripts(), which runs after the visitor has consented. */
(function () {
  "use strict";

  var I18N = window.ROZA_I18N;
  var PRODUCTS = window.ROZA_PRODUCTS;
  var CATEGORIES = window.ROZA_CATEGORIES;
  var SIZES = window.ROZA_SIZES;
  var COLORS = window.ROZA_COLORS;
  var art = window.ROZA_ART;

  var SOCIAL = {
    instagram: "https://www.instagram.com/rozathelabel/",
    tiktok: "https://www.tiktok.com/@rozathelabel"
  };

  /* ---------- Storage (only functional, non-personal data) ---------- */
  var store = {
    get: function (key, fallback) {
      try {
        var v = localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
    }
  };

  function findProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }

  function sanitizeBag(items) {
    if (!Array.isArray(items)) return [];
    return items.filter(function (it) {
      return it && findProduct(it.id) && SIZES.indexOf(it.size) !== -1 &&
        Number.isInteger(it.qty) && it.qty > 0 && it.qty <= 10;
    }).map(function (it) { return { id: it.id, size: it.size, qty: it.qty }; });
  }

  function detectLang() {
    var l = (navigator.language || "en").toLowerCase();
    return /^(nb|nn|no)\b/.test(l) ? "nb" : "en";
  }

  var CURRENCIES = ["NOK", "SEK", "DKK", "EUR"];
  var state = {
    lang: store.get("roza_lang", null),
    currency: store.get("roza_currency", "NOK"),
    bag: sanitizeBag(store.get("roza_bag", []))
  };
  if (state.lang !== "en" && state.lang !== "nb") state.lang = detectLang();
  if (CURRENCIES.indexOf(state.currency) === -1) state.currency = "NOK";

  /* ---------- Helpers ---------- */
  function t(key, vars) {
    var dict = I18N[state.lang] || I18N.en;
    var s = dict[key] !== undefined ? dict[key] : (I18N.en[key] !== undefined ? I18N.en[key] : key);
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- Currency (indicative rates; Shopify Markets sets real prices at launch) ---------- */
  var RATES = { NOK: 1, SEK: 1, DKK: 0.65, EUR: 0.087 };
  var FREE_SHIPPING = { NOK: 1500, SEK: 1500, DKK: 1000, EUR: 130 };

  function priceIn(nok) {
    if (state.currency === "NOK") return nok;
    var v = nok * RATES[state.currency];
    return state.currency === "EUR" ? Math.ceil(v / 5) * 5 - 1 : Math.ceil(v / 50) * 50 - 1;
  }

  function money(amount) {
    return new Intl.NumberFormat(state.lang === "nb" ? "nb-NO" : "en-GB", {
      style: "currency", currency: state.currency, maximumFractionDigits: 0, minimumFractionDigits: 0
    }).format(amount);
  }

  function freeShippingText() { return money(FREE_SHIPPING[state.currency]); }

  /* ---------- Icons ---------- */
  function icon(name) {
    var p = {
      search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
      user: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4"/>',
      bag: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
      menu: '<path d="M3.5 7h17M3.5 12h17M3.5 17h17"/>',
      close: '<path d="M6 6l12 12M18 6L6 18"/>',
      chevron: '<path d="M6 9l6 6 6-6"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      minus: '<path d="M5 12h14"/>',
      arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
      instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="0.6" fill="currentColor"/>',
      tiktok: '<path d="M14 3.5v11.2a3.8 3.8 0 1 1-3.8-3.8"/><path d="M14 3.5c.4 2.6 2.2 4.4 5 4.6"/>',
      lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>'
    }[name];
    return '<svg class="icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + p + "</svg>";
  }

  /* ---------- Layout ---------- */
  function catLinks(cls) {
    return CATEGORIES.map(function (c) {
      return '<li><a class="' + (cls || "") + '" href="shop.html?cat=' + c + '" data-i18n="cat.' + c + '"></a></li>';
    }).join("");
  }

  function langHTML() {
    return '<div class="lang-switch" role="group" data-i18n-aria="label.language">' +
      '<button type="button" data-lang-set="en" lang="en">EN</button><span aria-hidden="true">/</span>' +
      '<button type="button" data-lang-set="nb" lang="nb">NO</button></div>';
  }

  function prefsHTML(suffix) {
    return '<div class="prefs">' + langHTML() +
      '<label class="visually-hidden" for="currency-' + suffix + '" data-i18n="label.currency"></label>' +
      '<select class="currency-select" id="currency-' + suffix + '" data-currency-select>' +
      CURRENCIES.map(function (c) { return '<option value="' + c + '">' + c + "</option>"; }).join("") +
      "</select></div>";
  }

  function socialLinks() {
    return '<a class="social-link" href="' + SOCIAL.instagram + '" target="_blank" rel="noopener noreferrer" aria-label="Instagram">' + icon("instagram") + "</a>" +
      '<a class="social-link" href="' + SOCIAL.tiktok + '" target="_blank" rel="noopener noreferrer" aria-label="TikTok">' + icon("tiktok") + "</a>";
  }

  function buildHeader() {
    var mount = $("#site-header");
    if (!mount) return;
    mount.outerHTML =
      '<a class="skip-link" href="#main" data-i18n="nav.skip"></a>' +
      '<header class="site-header">' +
      '<div class="container header-inner">' +
      '<div class="header-left">' +
      '<button type="button" class="icon-btn menu-toggle" aria-controls="mobile-menu" aria-expanded="false" data-i18n-aria="nav.menu">' + icon("menu") + "</button>" +
      '<nav class="main-nav" aria-label="Main">' +
      "<ul>" +
      '<li class="has-menu has-mega">' +
      '<button type="button" class="nav-link" aria-expanded="false" aria-controls="mega-shop"><span data-i18n="nav.shop"></span>' + icon("chevron") + "</button>" +
      '<div class="mega" id="mega-shop"><div class="container mega-inner">' +
      '<div class="mega-col"><a class="mega-strong" href="shop.html?cat=new" data-i18n="nav.newIn"></a>' +
      '<a class="mega-strong" href="shop.html?cat=all" data-i18n="nav.shopAll"></a></div>' +
      '<div class="mega-col"><p class="mega-heading" data-i18n="nav.clothing"></p><ul class="mega-list">' + catLinks() + "</ul></div>" +
      "</div></div></li>" +
      '<li><a class="nav-link" href="about.html" data-i18n="nav.about"></a></li>' +
      "</ul></nav></div>" +
      '<a class="logo" href="index.html" aria-label="ROZA"><span class="logo-word">ROZA</span><span class="logo-sub">THE LABEL</span></a>' +
      '<div class="header-right">' +
      '<div class="header-prefs">' + langHTML() + "</div>" +
      '<button type="button" class="icon-btn" data-open="search-panel" data-i18n-aria="nav.search">' + icon("search") + "</button>" +
      '<a class="icon-btn hide-mobile" href="account.html" data-i18n-aria="nav.account">' + icon("user") + "</a>" +
      '<button type="button" class="icon-btn bag-toggle" data-open="bag-panel" data-i18n-aria="nav.bag">' + icon("bag") +
      '<span class="bag-count" hidden></span></button>' +
      "</div></div></header>" +

      /* Mobile menu */
      '<div class="panel drawer drawer--left" id="mobile-menu" role="dialog" aria-modal="true" data-i18n-aria="nav.menu" hidden>' +
      '<div class="drawer-head"><a class="logo logo--small" href="index.html" aria-label="ROZA"><span class="logo-word">ROZA</span></a>' +
      '<button type="button" class="icon-btn" data-close data-i18n-aria="nav.close">' + icon("close") + "</button></div>" +
      '<nav class="drawer-body mobile-nav" aria-label="Mobile">' +
      '<details open><summary><span data-i18n="nav.shop"></span>' + icon("chevron") + "</summary><ul>" +
      '<li><a href="shop.html?cat=new" data-i18n="nav.newIn"></a></li>' +
      '<li><a href="shop.html?cat=all" data-i18n="nav.shopAll"></a></li>' + catLinks() + "</ul></details>" +
      '<a class="mobile-link" href="about.html" data-i18n="nav.about"></a>' +
      '<details><summary><span data-i18n="nav.help"></span>' + icon("chevron") + "</summary><ul>" +
      '<li><a href="faq.html" data-i18n="nav.faq"></a></li>' +
      '<li><a href="shipping-returns.html" data-i18n="nav.shipping"></a></li>' +
      '<li><a href="size-guide.html" data-i18n="nav.sizeGuide"></a></li>' +
      '<li><a href="contact.html" data-i18n="nav.contact"></a></li></ul></details>' +
      '<a class="mobile-link" href="account.html">' + icon("user") + '<span data-i18n="nav.signIn"></span></a>' +
      "</nav>" +
      '<div class="drawer-foot">' + prefsHTML("mobile") + '<div class="socials">' + socialLinks() + "</div></div>" +
      "</div>" +

      /* Search */
      '<div class="panel search-panel" id="search-panel" role="dialog" aria-modal="true" data-i18n-aria="nav.search" hidden>' +
      '<div class="container">' +
      '<div class="search-row">' + icon("search") +
      '<label class="visually-hidden" for="search-input" data-i18n="nav.search"></label>' +
      '<input id="search-input" type="search" autocomplete="off" maxlength="60" data-i18n-placeholder="search.placeholder">' +
      '<button type="button" class="icon-btn" data-close data-i18n-aria="nav.close">' + icon("close") + "</button></div>" +
      '<div class="search-popular"><p class="eyebrow" data-i18n="search.popular"></p><ul class="chips">' +
      ["blazers", "suits", "dresses", "afterwork"].map(function (c) {
        return '<li><a class="chip" href="shop.html?cat=' + c + '" data-i18n="cat.' + c + '"></a></li>';
      }).join("") + "</ul></div>" +
      '<p class="search-empty" id="search-empty" hidden></p>' +
      '<ul class="search-results" id="search-results"></ul>' +
      "</div></div>" +

      /* Bag */
      '<aside class="panel drawer drawer--right" id="bag-panel" role="dialog" aria-modal="true" aria-labelledby="bag-title" hidden>' +
      '<div class="drawer-head"><h2 class="drawer-title" id="bag-title" data-i18n="bag.title"></h2>' +
      '<button type="button" class="icon-btn" data-close data-i18n-aria="nav.close">' + icon("close") + "</button></div>" +
      '<div class="drawer-body" id="bag-body"></div>' +
      '<div class="drawer-foot" id="bag-foot"></div>' +
      "</aside>" +

      '<div class="backdrop" id="backdrop" hidden></div>' +
      '<div class="toast" id="toast" role="status" aria-live="polite"></div>';
  }

  function buildFooter() {
    var mount = $("#site-footer");
    if (!mount) return;
    var year = new Date().getFullYear();
    mount.outerHTML =
      '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid">' +
      '<div class="footer-news"><h2 class="footer-heading" id="news-title" data-i18n="footer.newsTitle"></h2>' +
      '<form class="newsletter-form" novalidate data-form="newsletter">' +
      '<div class="inline-field"><label class="visually-hidden" for="news-email" data-i18n="form.email"></label>' +
      '<input id="news-email" name="email" type="email" autocomplete="email" required maxlength="254" data-i18n-placeholder="form.email">' +
      '<button type="submit" class="news-submit" data-i18n-aria="footer.subscribe">' + icon("arrow") + "</button></div>" +
      '<p class="field-error" data-error-for="news-email"></p>' +
      '<label class="checkbox"><input type="checkbox" name="consent" id="news-consent" required><span data-i18n-html="footer.newsConsent"></span></label>' +
      '<p class="field-error" data-error-for="news-consent"></p>' +
      '<p class="form-status" data-form-status role="status"></p>' +
      "</form></div>" +
      '<div><h3 class="footer-heading" data-i18n="footer.help"></h3><ul>' +
      '<li><a href="faq.html" data-i18n="nav.faq"></a></li>' +
      '<li><a href="shipping-returns.html" data-i18n="nav.shipping"></a></li>' +
      '<li><a href="size-guide.html" data-i18n="nav.sizeGuide"></a></li>' +
      '<li><a href="contact.html" data-i18n="nav.contact"></a></li>' +
      '<li><a href="returns.html" data-i18n="nav.returns"></a></li>' +
      '<li><a href="withdrawal-form.html" data-i18n="nav.withdrawal"></a></li></ul></div>' +
      '<div><h3 class="footer-heading"><a href="index.html">ROZA</a></h3><ul>' +
      '<li><a href="about.html" data-i18n="nav.about"></a></li>' +
      '<li><a href="account.html" data-i18n="nav.account"></a></li>' +
      '<li><a href="' + SOCIAL.instagram + '" target="_blank" rel="noopener noreferrer">Instagram</a></li>' +
      '<li><a href="' + SOCIAL.tiktok + '" target="_blank" rel="noopener noreferrer">TikTok</a></li></ul></div>' +
      "</div>" +
      '<div class="footer-bottom">' +
      '<p><span data-i18n="footer.rights" data-i18n-vars=\'{"year":"' + year + '"}\'></span><br><span data-i18n="footer.company"></span></p>' +
      '<ul class="footer-legal">' +
      '<li><a href="privacy.html" data-i18n="legal.privacy"></a></li>' +
      '<li><a href="cookies.html" data-i18n="legal.cookies"></a></li>' +
      '<li><a href="terms.html" data-i18n="legal.terms"></a></li>' +
      '<li><button type="button" class="link-btn" data-open-cookie-settings data-i18n="legal.cookieSettings"></button></li></ul>' +
      prefsHTML("footer") + "</div>" +
      "</div></footer>" +

      /* Cookie consent */
      '<div class="cookie-banner" id="cookie-banner" role="region" aria-labelledby="cookie-title" hidden>' +
      '<div class="cookie-text"><h2 id="cookie-title" data-i18n="cookie.title"></h2><p data-i18n="cookie.text"></p>' +
      '<a href="cookies.html" data-i18n="cookie.readMore"></a></div>' +
      '<div class="cookie-actions">' +
      '<button type="button" class="btn btn--ghost" data-open-cookie-settings data-i18n="cookie.settings"></button>' +
      '<button type="button" class="btn btn--outline" data-consent="necessary" data-i18n="cookie.necessary"></button>' +
      '<button type="button" class="btn btn--dark" data-consent="all" data-i18n="cookie.acceptAll"></button>' +
      "</div></div>" +

      '<div class="panel modal" id="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title" hidden>' +
      '<div class="modal-head"><h2 id="cookie-modal-title" data-i18n="legal.cookieSettings"></h2>' +
      '<button type="button" class="icon-btn" data-close data-i18n-aria="nav.close">' + icon("close") + "</button></div>" +
      '<div class="modal-body">' +
      cookieRow("necessary", true) + cookieRow("analytics", false) + cookieRow("marketing", false) +
      "</div>" +
      '<div class="modal-foot">' +
      '<button type="button" class="btn btn--outline" data-consent="necessary" data-i18n="cookie.necessary"></button>' +
      '<button type="button" class="btn btn--outline" data-consent="save" data-i18n="cookie.save"></button>' +
      '<button type="button" class="btn btn--dark" data-consent="all" data-i18n="cookie.acceptAll"></button>' +
      "</div></div>";
  }

  function cookieRow(kind, locked) {
    var key = { necessary: "Necessary", analytics: "Analytics", marketing: "Marketing" }[kind];
    return '<div class="consent-row"><div><h3 data-i18n="cookie.cat' + key + '"></h3><p data-i18n="cookie.cat' + key + 'Text"></p></div>' +
      (locked
        ? '<span class="consent-locked" data-i18n="cookie.alwaysOn"></span>'
        : '<label class="switch"><input type="checkbox" id="consent-' + kind + '"><span class="switch-ui" aria-hidden="true"></span>' +
          '<span class="visually-hidden" data-i18n="cookie.cat' + key + '"></span></label>') +
      "</div>";
  }

  /* ---------- Translation ---------- */
  function applyI18n(root) {
    root = root || document;
    $all("[data-i18n]", root).forEach(function (el) {
      var vars = el.getAttribute("data-i18n-vars");
      el.textContent = t(el.getAttribute("data-i18n"), vars ? JSON.parse(vars) : null);
    });
    /* Only trusted strings from i18n.js are rendered as HTML. */
    $all("[data-i18n-html]", root).forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    $all("[data-i18n-placeholder]", root).forEach(function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder"))); });
    $all("[data-i18n-aria]", root).forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
  }

  var renderers = [];
  function onRender(fn) { renderers.push(fn); }

  function renderAll() {
    document.documentElement.lang = state.lang;
    applyI18n();
    var titleKey = document.body.getAttribute("data-title");
    if (titleKey && titleKey !== "title.home") document.title = t(titleKey) + " | ROZA";
    else if (titleKey) document.title = t(titleKey);
    $all("[data-lang-set]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang-set") === state.lang));
    });
    $all("[data-currency-select]").forEach(function (s) { s.value = state.currency; });
    var announce = $("#announce-text");
    if (announce) announce.textContent = t("announce", { amount: freeShippingText() });
    renderers.forEach(function (fn) { fn(); });
  }

  function setLang(lang) {
    if (lang !== "en" && lang !== "nb") return;
    state.lang = lang;
    store.set("roza_lang", lang);
    renderAll();
  }

  function setCurrency(cur) {
    if (CURRENCIES.indexOf(cur) === -1) return;
    state.currency = cur;
    store.set("roza_currency", cur);
    renderAll();
  }

  /* ---------- Panels (menu, search, bag, cookie settings) ---------- */
  var openPanelEl = null;
  var lastTrigger = null;
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

  function openPanel(id, trigger) {
    var panel = document.getElementById(id);
    if (!panel) return;
    if (openPanelEl) closePanel(true);
    lastTrigger = trigger || document.activeElement;
    panel.hidden = false;
    $("#backdrop").hidden = false;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(function () { panel.classList.add("is-open"); $("#backdrop").classList.add("is-open"); });
    openPanelEl = panel;
    $all('[aria-controls="' + id + '"]').forEach(function (b) { b.setAttribute("aria-expanded", "true"); });
    var first = id === "search-panel" ? $("#search-input") : $all(FOCUSABLE, panel)[0];
    if (first) setTimeout(function () { first.focus(); }, 30);
  }

  function closePanel(keepFocus) {
    if (!openPanelEl) return;
    var panel = openPanelEl;
    openPanelEl = null;
    panel.classList.remove("is-open");
    $("#backdrop").classList.remove("is-open");
    $all('[aria-controls="' + panel.id + '"]').forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    setTimeout(function () {
      if (openPanelEl !== panel) panel.hidden = true;
      if (!openPanelEl) { $("#backdrop").hidden = true; document.body.classList.remove("no-scroll"); }
    }, 250);
    if (!keepFocus && lastTrigger && lastTrigger.focus) lastTrigger.focus();
  }

  function trapFocus(e) {
    if (!openPanelEl || e.key !== "Tab") return;
    var items = $all(FOCUSABLE, openPanelEl).filter(function (el) { return el.offsetParent !== null; });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function closeMenus(except) {
    $all(".has-menu.is-open").forEach(function (li) {
      if (li === except) return;
      li.classList.remove("is-open");
      $("button", li).setAttribute("aria-expanded", "false");
    });
  }

  var toastTimer;
  function toast(msg) {
    var el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("is-visible"); }, 2800);
  }

  /* ---------- Product cards ---------- */
  function productCard(p) {
    return '<article class="card">' +
      '<a class="card-link" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
      '<div class="tile tile--' + p.color + '">' + art(p.art) + "</div>" +
      '<div class="card-body"><h3 class="card-title">' + esc(p.name) + "</h3>" +
      '<p class="card-price">' + esc(money(priceIn(p.price))) + "</p></div></a></article>";
  }

  /* ---------- Bag ---------- */
  function saveBag() { store.set("roza_bag", state.bag); renderBag(); }

  function addToBag(id, size) {
    var line = state.bag.filter(function (it) { return it.id === id && it.size === size; })[0];
    if (line) line.qty = Math.min(10, line.qty + 1);
    else state.bag.push({ id: id, size: size, qty: 1 });
    saveBag();
  }

  function bagSubtotal() {
    return state.bag.reduce(function (sum, it) { return sum + priceIn(findProduct(it.id).price) * it.qty; }, 0);
  }

  function renderBag() {
    var count = state.bag.reduce(function (n, it) { return n + it.qty; }, 0);
    $all(".bag-count").forEach(function (el) { el.textContent = count; el.hidden = count === 0; });
    var body = $("#bag-body"), foot = $("#bag-foot");
    if (!body) return;

    if (!state.bag.length) {
      body.innerHTML = '<div class="bag-empty"><p>' + esc(t("bag.empty")) + '</p>' +
        '<a class="btn btn--dark" href="shop.html?cat=new">' + esc(t("bag.continue")) + "</a></div>";
      foot.innerHTML = "";
      foot.hidden = true;
      return;
    }

    var subtotal = bagSubtotal();
    var threshold = FREE_SHIPPING[state.currency];
    var left = threshold - subtotal;
    var progress = Math.min(100, Math.round((subtotal / threshold) * 100));

    body.innerHTML =
      '<div class="ship-progress"><p>' + esc(left > 0 ? t("bag.freeLeft", { amount: money(left) }) : t("bag.freeReached")) + "</p>" +
      '<div class="bar"><span class="bar-fill" data-progress="' + progress + '"></span></div></div>' +
      '<ul class="bag-list">' + state.bag.map(function (it, i) {
        var p = findProduct(it.id);
        return '<li class="bag-item">' +
          '<a class="bag-thumb tile tile--' + p.color + '" href="product.html?id=' + encodeURIComponent(p.id) + '" tabindex="-1" aria-hidden="true">' + art(p.art) + "</a>" +
          '<div class="bag-info"><a class="bag-name" href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.name) + "</a>" +
          '<p class="bag-meta">' + esc(t("color." + p.color)) + " · " + esc(t("bag.size")) + " " + esc(it.size) + "</p>" +
          '<div class="bag-row"><div class="qty">' +
          '<button type="button" data-qty="-1" data-index="' + i + '" aria-label="' + esc(t("bag.decrease")) + '">' + icon("minus") + "</button>" +
          '<span aria-live="polite">' + it.qty + "</span>" +
          '<button type="button" data-qty="1" data-index="' + i + '" aria-label="' + esc(t("bag.increase")) + '">' + icon("plus") + "</button></div>" +
          '<button type="button" class="link-btn" data-remove="' + i + '">' + esc(t("bag.remove")) + "</button></div></div>" +
          '<p class="bag-price">' + esc(money(priceIn(p.price) * it.qty)) + "</p></li>";
      }).join("") + "</ul>";
    /* CSP-safe: width is set through the CSSOM, not an inline style attribute. */
    var fill = $(".bar-fill", body);
    if (fill) fill.style.width = progress + "%";

    foot.hidden = false;
    foot.innerHTML =
      '<div class="bag-total"><span>' + esc(t("bag.subtotal")) + "</span><strong>" + esc(money(subtotal)) + "</strong></div>" +
      '<p class="muted small">' + esc(t("bag.shippingNote")) + "</p>" +
      '<a class="btn btn--dark btn--block" href="checkout.html">' + icon("lock") + "<span>" + esc(t("bag.checkout")) + "</span></a>";
  }

  /* ---------- Cookie consent ---------- */
  var CONSENT_VERSION = 1;

  function getConsent() {
    var c = store.get("roza_consent", null);
    if (!c || c.v !== CONSENT_VERSION) return null;
    /* Consent expires after 12 months, after which the visitor is asked again. */
    var age = Date.now() - new Date(c.date).getTime();
    return age >= 0 && age < 365 * 24 * 60 * 60 * 1000 ? c : null;
  }

  function saveConsent(analytics, marketing) {
    var c = { v: CONSENT_VERSION, necessary: true, analytics: !!analytics, marketing: !!marketing, date: new Date().toISOString() };
    store.set("roza_consent", c);
    $("#cookie-banner").hidden = true;
    if (openPanelEl && openPanelEl.id === "cookie-modal") closePanel();
    loadOptionalScripts(c);
    toast(t("cookie.saved"));
  }

  function loadOptionalScripts(consent) {
    /* Launch: add analytics here only if consent.analytics is true,
       and the Meta/TikTok pixels only if consent.marketing is true.
       Nothing is loaded in this preview. */
    return consent;
  }

  function openCookieSettings(trigger) {
    var c = getConsent() || { analytics: false, marketing: false };
    $("#consent-analytics").checked = !!c.analytics;
    $("#consent-marketing").checked = !!c.marketing;
    openPanel("cookie-modal", trigger);
  }

  /* ---------- Forms ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(form, field, key) {
    var holder = $('[data-error-for="' + field.id + '"]', form);
    if (holder) { holder.textContent = key ? t(key) : ""; holder.id = holder.id || field.id + "-error"; }
    if (key) { field.setAttribute("aria-invalid", "true"); if (holder) field.setAttribute("aria-describedby", holder.id); }
    else field.removeAttribute("aria-invalid");
  }

  function postcodeOk(val) {
    var country = $("#co-country");
    var v = val.replace(/\s/g, "");
    return country && country.value === "SE" ? /^\d{5}$/.test(v) : /^\d{4}$/.test(v);
  }

  /* Pages can take over a form's successful submit (checkout, returns, sign-in). */
  var formHandlers = {};

  function validateForm(form) {
    var firstBad = null;
    $all("input, textarea, select", form).forEach(function (field) {
      if (!field.id || field.disabled || field.closest("[hidden]")) return;
      var key = null;
      var val = field.type === "checkbox" ? field.checked : field.value.trim();
      if (field.required && !val) key = field.type === "checkbox" ? "form.consentRequired" : "form.required";
      else if (field.type === "email" && val && !EMAIL_RE.test(val)) key = "form.invalidEmail";
      else if (field.getAttribute("data-rule") === "phone" && val && !/^\+?[\d\s]{8,16}$/.test(val)) key = "co.phone";
      else if (field.getAttribute("data-rule") === "postcode" && val && !postcodeOk(val)) key = "co.postcode";
      else if (field.getAttribute("data-rule") === "order" && val && !/^#?\d{4,8}$/.test(val)) key = "ret.orderNotFound";
      else if (field.hasAttribute("data-password-rule") && val && !(val.length >= 10 && /[A-Za-zÆØÅæøå]/.test(val) && /\d/.test(val))) key = "form.passwordRule";
      setError(form, field, key);
      if (key && !firstBad) firstBad = field;
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  function initForms() {
    document.addEventListener("submit", function (e) {
      var form = e.target.closest("form[data-form]");
      if (!form) return;
      e.preventDefault();
      var status = $("[data-form-status]", form);
      if (status) status.textContent = "";
      if (!validateForm(form)) return;
      var handler = formHandlers[form.getAttribute("data-form")];
      if (handler) { handler(form); return; }
      /* Preview only: nothing is transmitted or stored. At launch these forms post to Shopify over HTTPS. */
      if (status) status.textContent = form.getAttribute("data-form") === "newsletter" ? t("footer.newsThanks") : t("form.preview");
      form.reset();
    });
    document.addEventListener("input", function (e) {
      var field = e.target;
      var form = field.closest && field.closest("form[data-form]");
      if (form && field.getAttribute("aria-invalid") === "true") setError(form, field, null);
    });
  }

  /* ---------- Global events ---------- */
  function initEvents() {
    document.addEventListener("click", function (e) {
      var el;
      if ((el = e.target.closest("[data-lang-set]"))) return setLang(el.getAttribute("data-lang-set"));
      if ((el = e.target.closest("[data-open]"))) return openPanel(el.getAttribute("data-open"), el);
      if ((el = e.target.closest(".menu-toggle"))) return openPanel("mobile-menu", el);
      if ((el = e.target.closest("[data-close]")) || e.target.id === "backdrop") return closePanel();
      if ((el = e.target.closest("[data-open-cookie-settings]"))) return openCookieSettings(el);
      if ((el = e.target.closest("[data-consent]"))) {
        var kind = el.getAttribute("data-consent");
        if (kind === "all") return saveConsent(true, true);
        if (kind === "necessary") return saveConsent(false, false);
        return saveConsent($("#consent-analytics").checked, $("#consent-marketing").checked);
      }
      if ((el = e.target.closest("[data-qty]"))) {
        var line = state.bag[+el.getAttribute("data-index")];
        if (line) { line.qty = Math.max(1, Math.min(10, line.qty + +el.getAttribute("data-qty"))); saveBag(); }
        return;
      }
      if ((el = e.target.closest("[data-remove]"))) {
        state.bag.splice(+el.getAttribute("data-remove"), 1);
        saveBag();
        var btn = $("#bag-panel [data-close]");
        if (btn) btn.focus();
        return;
      }
      var menuBtn = e.target.closest(".has-menu > .nav-link");
      if (menuBtn) {
        var li = menuBtn.parentElement;
        var open = !li.classList.contains("is-open");
        closeMenus(li);
        li.classList.toggle("is-open", open);
        menuBtn.setAttribute("aria-expanded", String(open));
        return;
      }
      if (!e.target.closest(".has-menu")) closeMenus();
    });

    document.addEventListener("change", function (e) {
      if (e.target.matches("[data-currency-select]")) setCurrency(e.target.value);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (openPanelEl) closePanel();
        else {
          var openLi = $(".has-menu.is-open");
          closeMenus();
          if (openLi) $("button", openLi).focus();
        }
      }
      trapFocus(e);
    });

    var header = $(".site-header");
    if (header) {
      window.addEventListener("scroll", function () {
        header.classList.toggle("is-scrolled", window.scrollY > 10);
      }, { passive: true });
    }
  }

  /* ---------- Search ---------- */
  function initSearch() {
    var input = $("#search-input");
    if (!input) return;
    function run() {
      var q = input.value.trim().toLowerCase();
      var list = $("#search-results"), empty = $("#search-empty"), popular = $(".search-popular");
      list.innerHTML = "";
      empty.hidden = true;
      popular.hidden = !!q;
      if (!q) return;
      var hits = PRODUCTS.filter(function (p) {
        var hay = [p.name, t("cat." + p.cat), t("color." + p.color), p.desc[state.lang]].join(" ").toLowerCase();
        return hay.indexOf(q) !== -1;
      }).slice(0, 8);
      if (!hits.length) { empty.textContent = t("search.empty", { q: input.value.trim() }); empty.hidden = false; return; }
      list.innerHTML = hits.map(function (p) {
        return '<li><a class="search-hit" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
          '<span class="tile tile--' + p.color + '">' + art(p.art) + "</span>" +
          '<span><span class="search-hit-name">' + esc(p.name) + '</span><span class="muted">' + esc(t("cat." + p.cat)) + " · " + esc(money(priceIn(p.price))) + "</span></span></a></li>";
      }).join("");
    }
    input.addEventListener("input", run);
    onRender(run);
  }

  /* ---------- Pages ---------- */
  function fillArt() {
    $all("[data-art]").forEach(function (el) {
      el.insertAdjacentHTML("afterbegin", art(el.getAttribute("data-art")));
    });
  }

  function pageHome() {
    var grid = $("#new-in-grid");
    if (!grid) return;
    onRender(function () {
      var items = PRODUCTS.filter(function (p) { return p.isNew; })
        .sort(function (a, b) { return b.added - a.added; }).slice(0, 4);
      grid.innerHTML = items.map(productCard).join("");
    });
  }

  function pageShop() {
    var params = new URLSearchParams(location.search);
    var cat = params.get("cat");
    if (cat !== "new" && cat !== "all" && CATEGORIES.indexOf(cat) === -1) cat = "all";
    var filters = {
      size: SIZES.indexOf(params.get("size")) !== -1 ? params.get("size") : "",
      color: COLORS.indexOf(params.get("color")) !== -1 ? params.get("color") : "",
      sort: ["featured", "newest", "priceAsc", "priceDesc"].indexOf(params.get("sort")) !== -1 ? params.get("sort") : "featured"
    };

    var chips = $("#cat-chips");
    chips.innerHTML = ["all", "new"].concat(CATEGORIES).map(function (c) {
      return '<li><a class="chip' + (c === cat ? " is-active" : "") + '" href="shop.html?cat=' + c + '"' +
        (c === cat ? ' aria-current="page"' : "") + ' data-i18n="cat.' + c + '"></a></li>';
    }).join("");

    $("#shop-title").setAttribute("data-i18n", "cat." + cat);
    $("#crumb-current").setAttribute("data-i18n", "cat." + cat);

    var sizeSel = $("#filter-size"), colorSel = $("#filter-color"), sortSel = $("#filter-sort");
    sizeSel.innerHTML = '<option value="" data-i18n="filter.all"></option>' + SIZES.map(function (s) { return '<option value="' + s + '">' + s + "</option>"; }).join("");
    colorSel.innerHTML = '<option value="" data-i18n="filter.all"></option>' + COLORS.map(function (c) { return '<option value="' + c + '" data-i18n="color.' + c + '"></option>'; }).join("");
    sortSel.innerHTML = ["featured", "newest", "priceAsc", "priceDesc"].map(function (s) { return '<option value="' + s + '" data-i18n="sort.' + s + '"></option>'; }).join("");

    function sync() {
      var q = new URLSearchParams();
      q.set("cat", cat);
      if (filters.size) q.set("size", filters.size);
      if (filters.color) q.set("color", filters.color);
      if (filters.sort !== "featured") q.set("sort", filters.sort);
      history.replaceState(null, "", "shop.html?" + q.toString());
    }

    function render() {
      sizeSel.value = filters.size; colorSel.value = filters.color; sortSel.value = filters.sort;
      var items = PRODUCTS.filter(function (p) {
        if (cat === "new" && !p.isNew) return false;
        if (cat !== "new" && cat !== "all" && p.cat !== cat) return false;
        if (filters.color && p.color !== filters.color) return false;
        return true; /* all styles are offered in every size in this preview */
      });
      if (filters.sort === "newest") items.sort(function (a, b) { return b.added - a.added; });
      if (filters.sort === "priceAsc") items.sort(function (a, b) { return a.price - b.price; });
      if (filters.sort === "priceDesc") items.sort(function (a, b) { return b.price - a.price; });
      $("#shop-count").textContent = t("shop.results", { n: items.length });
      $("#shop-grid").innerHTML = items.map(productCard).join("");
      $("#shop-empty").hidden = items.length > 0;
    }

    [sizeSel, colorSel, sortSel].forEach(function (sel) {
      sel.addEventListener("change", function () {
        filters.size = sizeSel.value; filters.color = colorSel.value; filters.sort = sortSel.value;
        sync(); render();
      });
    });
    $("#shop-clear").addEventListener("click", function () {
      filters = { size: "", color: "", sort: "featured" };
      sync(); render();
    });
    onRender(render);
  }

  function pageProduct() {
    var root = $("#product-root");
    var p = findProduct(new URLSearchParams(location.search).get("id"));
    if (!p) {
      root.innerHTML = '<div class="container section center"><h1 class="h2" data-i18n="product.notFound"></h1>' +
        '<a class="btn btn--dark" href="shop.html?cat=all" data-i18n="nav.shopAll"></a></div>';
      return;
    }
    var selectedSize = "";

    /* Structured product data for Google (price, availability, brand). */
    var ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.desc.en,
      image: "https://rozathelabel.com/assets/img/og-image.png", sku: p.id, brand: { "@type": "Brand", name: "ROZA" },
      offers: { "@type": "Offer", url: "https://rozathelabel.com/product.html?id=" + p.id, priceCurrency: "NOK",
        price: p.price, availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition" }
    });
    document.head.appendChild(ld);
    var metaDesc = $('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", p.name + " – " + p.desc.en);
    var canon = $('link[rel="canonical"]');
    if (canon) canon.setAttribute("href", "https://rozathelabel.com/product.html?id=" + p.id);

    root.innerHTML =
      '<div class="container">' +
      '<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>' +
      '<li><a href="index.html" data-i18n="crumb.home"></a></li>' +
      '<li><a href="shop.html?cat=' + p.cat + '" data-i18n="cat.' + p.cat + '"></a></li>' +
      '<li aria-current="page">' + esc(p.name) + "</li></ol></nav>" +
      '<div class="product">' +
      '<div class="gallery">' +
      '<div class="tile tile--' + p.color + ' gallery-main">' + art(p.art) + "</div>" +
      '<div class="gallery-thumbs">' +
      '<div class="tile tile--' + p.color + '">' + art(p.art, "art--zoom") + "</div>" +
      '<div class="tile tile--nude-soft">' + art(p.art) + "</div></div></div>" +
      '<div class="product-info">' +
      '<p class="eyebrow" data-i18n="cat.' + p.cat + '"></p>' +
      '<h1 class="product-title">' + esc(p.name) + "</h1>" +
      '<p class="product-price" id="product-price"></p><p class="muted small" data-i18n="product.vat"></p>' +
      '<p class="product-colour"><span><span data-i18n="product.colour"></span>:</span><strong data-i18n="color.' + p.color + '"></strong>' +
      '<span class="swatch swatch--' + p.color + '" aria-hidden="true"></span></p>' +
      '<fieldset class="sizes"><legend><span data-i18n="product.selectSize"></span>' +
      '<a class="link-underline small" href="size-guide.html" data-i18n="nav.sizeGuide"></a></legend>' +
      '<div class="size-options">' + SIZES.map(function (s) {
        return '<label class="size-option"><input type="radio" name="size" value="' + s + '"><span>' + s + "</span></label>";
      }).join("") + "</div>" +
      '<p class="field-error" id="size-error" role="alert"></p></fieldset>' +
      '<button type="button" class="btn btn--dark btn--block btn--lg" id="add-to-bag" data-i18n="product.add"></button>' +
      '<div class="accordion">' +
      '<details open><summary><span data-i18n="product.description"></span>' + icon("plus") + '</summary><p id="product-desc"></p></details>' +
      '<details><summary><span data-i18n="product.details"></span>' + icon("plus") + '</summary><ul class="ticks" id="product-details"></ul></details>' +
      '<details><summary><span data-i18n="product.shipping"></span>' + icon("plus") + '</summary><p id="product-shipping"></p>' +
      '<a class="link-underline small" href="shipping-returns.html" data-i18n="nav.shipping"></a></details>' +
      "</div></div></div>" +
      '<section class="section" aria-labelledby="look-title"><div class="section-head"><h2 class="h3" id="look-title" data-i18n="product.completeLook"></h2></div>' +
      '<div class="grid grid--4" id="look-grid"></div></section>' +
      "</div>";

    var related = PRODUCTS.filter(function (x) { return x.cat !== p.cat; })
      .sort(function (a, b) { return b.added - a.added; })
      .filter(function (x, i, arr) {
        for (var j = 0; j < i; j++) if (arr[j].cat === x.cat) return false;
        return true;
      }).slice(0, 4);

    root.addEventListener("change", function (e) {
      if (e.target.name === "size") { selectedSize = e.target.value; $("#size-error").textContent = ""; }
    });
    $("#add-to-bag").addEventListener("click", function () {
      if (!selectedSize) {
        $("#size-error").textContent = t("product.sizeRequired");
        var firstSize = $(".size-option input", root);
        if (firstSize) firstSize.focus();
        return;
      }
      addToBag(p.id, selectedSize);
      toast(t("bag.added"));
      openPanel("bag-panel", $("#add-to-bag"));
    });

    onRender(function () {
      document.title = p.name + " | ROZA";
      $("#product-price").textContent = money(priceIn(p.price));
      $("#product-desc").textContent = p.desc[state.lang];
      $("#product-details").innerHTML = p.details[state.lang].map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("");
      $("#product-shipping").textContent = t("product.shippingText", { amount: freeShippingText() });
      $("#look-grid").innerHTML = related.map(productCard).join("");
    });
  }

  function pageAccount() {
    var views = $all("[data-view]");
    function show(name) {
      views.forEach(function (v) { v.hidden = v.getAttribute("data-view") !== name; });
      $all("[data-tab]").forEach(function (tab) {
        var active = tab.getAttribute("data-tab") === name;
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      $all("[data-form-status]").forEach(function (s) { s.textContent = ""; });
    }
    document.addEventListener("click", function (e) {
      var el = e.target.closest("[data-show-view]");
      if (el) { e.preventDefault(); show(el.getAttribute("data-show-view")); return; }
      el = e.target.closest("[data-tab]");
      if (el) { show(el.getAttribute("data-tab")); return; }
      el = e.target.closest("[data-toggle-pw]");
      if (el) {
        var input = document.getElementById(el.getAttribute("data-toggle-pw"));
        var reveal = input.type === "password";
        input.type = reveal ? "text" : "password";
        el.setAttribute("data-i18n", reveal ? "acc.hidePw" : "acc.showPw");
        el.textContent = t(reveal ? "acc.hidePw" : "acc.showPw");
        el.setAttribute("aria-pressed", String(reveal));
      }
    });
    $(".tabs").addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var next = $('[data-tab][aria-selected="false"]');
      show(next.getAttribute("data-tab"));
      next.focus();
    });
    show(location.hash === "#create" ? "create" : "signin");
  }

  /* ---------- Checkout (preview of the flow; at launch Shopify's secure checkout takes payment) ---------- */
  var SHIPPING = {
    pickup: { NOK: 79, SEK: 79, DKK: 59, EUR: 7 },
    home: { NOK: 149, SEK: 149, DKK: 109, EUR: 13 }
  };

  function shippingCost(method, subtotal) {
    var free = subtotal >= FREE_SHIPPING[state.currency];
    var pickup = SHIPPING.pickup[state.currency];
    if (method === "home") return SHIPPING.home[state.currency] - (free ? pickup : 0);
    return free ? 0 : pickup;
  }

  function pageCheckout() {
    var main = $("#co-main"), empty = $("#co-empty"), done = $("#co-done");

    function method() { var r = $('input[name="shipping"]:checked'); return r ? r.value : "pickup"; }
    function payment() { var r = $('input[name="payment"]:checked'); return r ? r.value : "vipps"; }

    function render() {
      if (!done.hidden) return;
      var hasItems = state.bag.length > 0;
      main.hidden = !hasItems;
      empty.hidden = hasItems;
      if (!hasItems) return;
      var subtotal = bagSubtotal();
      var ship = shippingCost(method(), subtotal);
      var total = subtotal + ship;
      $("#co-items").innerHTML = state.bag.map(function (it) {
        var p = findProduct(it.id);
        return '<li class="co-item"><span class="tile tile--' + p.color + '">' + art(p.art) + "</span>" +
          '<span class="co-item-info"><span class="co-item-name">' + esc(p.name) + "</span>" +
          '<span class="muted small">' + esc(t("bag.size")) + " " + esc(it.size) + " · " + esc(t("co.qty")) + " " + it.qty + "</span></span>" +
          '<span class="co-item-price">' + esc(money(priceIn(p.price) * it.qty)) + "</span></li>";
      }).join("");
      $("#co-subtotal").textContent = money(subtotal);
      $("#co-shipping").textContent = ship === 0 ? t("co.free") : money(ship);
      $("#co-total").textContent = money(total);
      $("#co-vat").textContent = t("co.vat", { amount: money(Math.round(total - total / 1.25)) });
      $("#co-pay-label").textContent = t("co.pay", { amount: money(total) });
      $all("[data-ship-price]").forEach(function (el) {
        var c = shippingCost(el.getAttribute("data-ship-price"), subtotal);
        el.textContent = c === 0 ? t("co.free") : money(c);
      });
      $all("[data-pay-info]").forEach(function (el) { el.hidden = el.getAttribute("data-pay-info") !== payment(); });
    }

    document.addEventListener("change", function (e) {
      if (e.target.name === "shipping" || e.target.name === "payment") render();
    });

    formHandlers.checkout = function (form) {
      var email = $("#co-email").value.trim();
      var pay = $('input[name="payment"]:checked + .choice-body .choice-title');
      var orderNo = String(1058 + Math.floor(Math.random() * 900));
      $("#done-order").textContent = "#" + orderNo;
      $("#done-email").textContent = email;
      $("#done-payment").textContent = pay ? pay.innerText : "";
      state.bag = [];
      saveBag();
      form.reset();
      main.hidden = true;
      done.hidden = false;
      window.scrollTo(0, 0);
      var h = $("h1", done);
      if (h) { h.tabIndex = -1; h.focus(); }
    };

    onRender(render);
  }

  /* ---------- My account (sample data until Shopify customer accounts are connected) ---------- */
  var DEMO_ORDERS = [
    { no: "1057", date: "2026-09-24", status: "shipped", items: [["midnight-slip-dress", "S", 1], ["signature-blazer", "S", 1]] },
    { no: "1042", date: "2026-08-30", status: "delivered", items: [["boardroom-dress", "M", 1]] }
  ];

  function findOrder(no) {
    no = String(no || "").replace("#", "");
    for (var i = 0; i < DEMO_ORDERS.length; i++) if (DEMO_ORDERS[i].no === no) return DEMO_ORDERS[i];
    return null;
  }

  function formatDate(iso) {
    return new Intl.DateTimeFormat(state.lang === "nb" ? "nb-NO" : "en-GB", { day: "numeric", month: "long", year: "numeric" })
      .format(new Date(iso + "T12:00:00"));
  }

  function pageMyAccount() {
    function show(name) {
      $all("[data-section]").forEach(function (sec) { sec.hidden = sec.getAttribute("data-section") !== name; });
      $all("[data-go]").forEach(function (b) {
        var active = b.getAttribute("data-go") === name;
        b.classList.toggle("is-active", active);
        if (b.closest(".acc-nav")) b.setAttribute("aria-current", active ? "page" : "false");
      });
    }
    document.addEventListener("click", function (e) {
      var el = e.target.closest("[data-go]");
      if (el) { e.preventDefault(); show(el.getAttribute("data-go")); history.replaceState(null, "", "#" + el.getAttribute("data-go")); return; }
      if (e.target.closest("[data-track]")) { e.preventDefault(); toast(t("acc.trackPreview")); return; }
      if (e.target.closest("[data-download-data]")) {
        /* GDPR data portability: at launch this exports the customer's real data from Shopify. */
        var data = { sample: true, customer: { first_name: "Kari", last_name: "Nordmann", email: "kari@example.com" },
          orders: DEMO_ORDERS, marketing_consent: false, exported: new Date().toISOString() };
        var url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
        var a = document.createElement("a");
        a.href = url; a.download = "roza-mine-data.json";
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        toast(t("acc.downloaded"));
        return;
      }
      if (e.target.closest("[data-delete-account]")) {
        if (window.confirm(t("acc.deleteConfirm"))) $("#delete-status").textContent = t("acc.deleted");
      }
    });

    onRender(function () {
      $("#order-list").innerHTML = DEMO_ORDERS.map(function (o) {
        var total = o.items.reduce(function (sum, it) { return sum + priceIn(findProduct(it[0]).price) * it[2]; }, 0);
        return '<li class="order">' +
          '<div class="order-head"><div><p class="order-no">' + esc(t("acc.order")) + " #" + o.no + "</p>" +
          '<p class="muted small">' + esc(t("acc.placed", { date: formatDate(o.date) })) + " · " + esc(money(total)) + "</p></div>" +
          '<span class="status status--' + o.status + '">' + esc(t("acc.status." + o.status)) + "</span></div>" +
          '<ul class="order-items">' + o.items.map(function (it) {
            var p = findProduct(it[0]);
            return '<li><span class="tile tile--' + p.color + '">' + art(p.art) + "</span><span>" + esc(p.name) +
              '<span class="muted small">' + esc(t("bag.size")) + " " + esc(it[1]) + "</span></span></li>";
          }).join("") + "</ul>" +
          '<div class="order-actions">' +
          (o.status === "shipped" ? '<a class="btn btn--outline" href="#" data-track>' + esc(t("acc.track")) + "</a>" : "") +
          '<a class="btn btn--ghost" href="returns.html?order=' + o.no + '">' + esc(t("acc.return")) + "</a></div></li>";
      }).join("");
    });

    var start = location.hash.replace("#", "");
    show($('[data-section="' + start + '"]') ? start : "overview");
  }

  /* ---------- Returns portal ---------- */
  function pageReturns() {
    var steps = { find: $("#ret-find"), items: $("#ret-items"), done: $("#ret-done") };
    var order = null;
    function go(step) {
      Object.keys(steps).forEach(function (k) { steps[k].hidden = k !== step; });
      $all("[data-step-mark]").forEach(function (m) { m.classList.toggle("is-active", m.getAttribute("data-step-mark") === step); });
      window.scrollTo(0, 0);
    }
    var pre = new URLSearchParams(location.search).get("order");
    if (pre && /^\d{4,8}$/.test(pre)) $("#ret-order").value = pre;

    var REASONS = ["tooBig", "tooSmall", "fit", "expected", "faulty", "other"];
    function renderItems() {
      if (!order) return;
      $("#ret-order-label").textContent = "#" + order.no;
      $("#ret-list").innerHTML = order.items.map(function (it, i) {
        var p = findProduct(it[0]);
        return '<li class="ret-item"><label class="ret-check"><input type="checkbox" name="item" value="' + i + '" id="ret-item-' + i + '">' +
          '<span class="tile tile--' + p.color + '">' + art(p.art) + "</span>" +
          '<span><span class="co-item-name">' + esc(p.name) + '</span><span class="muted small">' + esc(t("bag.size")) + " " + esc(it[1]) +
          " · " + esc(money(priceIn(p.price))) + "</span></span></label>" +
          '<div class="field"><label for="ret-reason-' + i + '">' + esc(t("ret.reason")) + "</label>" +
          '<select id="ret-reason-' + i + '" class="plain-select" data-reason><option value="">' + esc(t("ret.choose")) + "</option>" +
          REASONS.map(function (r) { return '<option value="' + r + '">' + esc(t("ret." + r)) + "</option>"; }).join("") +
          "</select></div></li>";
      }).join("");
    }

    formHandlers["return-find"] = function () {
      /* Preview: any order number works and shows sample items. At launch Shopify looks up the real order. */
      order = findOrder($("#ret-order").value) || { no: $("#ret-order").value.replace("#", ""), items: DEMO_ORDERS[0].items };
      renderItems();
      go("items");
    };

    formHandlers["return-items"] = function () {
      var err = $("#ret-error");
      var checked = $all('input[name="item"]:checked');
      if (!checked.length) { err.textContent = t("ret.selectItem"); return; }
      var missing = checked.filter(function (c) { return !$("#ret-reason-" + c.value).value; });
      if (missing.length) { err.textContent = t("ret.chooseReason"); $("#ret-reason-" + missing[0].value).focus(); return; }
      err.textContent = "";
      var faulty = checked.some(function (c) { return $("#ret-reason-" + c.value).value === "faulty"; });
      $("#ret-number").textContent = "RT-" + order.no + "-" + String(Math.floor(100 + Math.random() * 900));
      $("#ret-faulty-note").hidden = !faulty;
      $("#ret-paid-note").hidden = faulty;
      go("done");
    };

    document.addEventListener("change", function (e) {
      if (e.target.matches("[data-reason]")) {
        var any = $all("[data-reason]").some(function (s) { return s.value === "faulty"; });
        $("#ret-faulty-hint").hidden = !any;
        var box = $("#ret-item-" + e.target.id.split("-").pop());
        if (box && e.target.value) box.checked = true;
      }
    });
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-label]")) toast(t("ret.labelPreview"));
      var back = e.target.closest("[data-ret-back]");
      if (back) go("find");
    });
    onRender(renderItems);
    go("find");
  }

  function pageWithdrawal() {
    var today = new Date().toISOString().slice(0, 10);
    var d = $("#wd-date");
    if (d) d.value = today;
    document.addEventListener("click", function (e) { if (e.target.closest("[data-print]")) window.print(); });
  }

  /* ---------- Boot ---------- */
  function init() {
    buildHeader();
    buildFooter();
    fillArt();
    initEvents();
    initForms();
    initSearch();
    onRender(renderBag);

    var page = document.body.getAttribute("data-page");
    if (page === "home") pageHome();
    if (page === "shop") pageShop();
    if (page === "product") pageProduct();
    if (page === "account") {
      pageAccount();
      /* Preview: signing in or creating an account opens the sample "My account" page. */
      formHandlers.signin = formHandlers.create = function () { location.href = "my-account.html"; };
    }
    if (page === "checkout") pageCheckout();
    if (page === "my-account") pageMyAccount();
    if (page === "returns") pageReturns();
    if (page === "withdrawal") pageWithdrawal();

    var consent = getConsent();
    if (consent) loadOptionalScripts(consent);
    else $("#cookie-banner").hidden = false;

    renderAll();
    document.body.classList.add("is-ready");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
