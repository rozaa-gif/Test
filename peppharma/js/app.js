/* ===========================================
   Peppharma – shared page behaviour
   =========================================== */

function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
  });
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => menu.classList.remove("open"));
  });
}

function highlightActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path) link.classList.add("active");
  });
}

function initFaqAccordion() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        if (openItem !== item) openItem.classList.remove("open");
      });
      item.classList.toggle("open", !isOpen);
    });
  });
}

function initAccountForms() {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showNotification(t("account.loginSuccess"));
      loginForm.reset();
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      showNotification(t("account.registerSuccess"));
      registerForm.reset();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  highlightActiveNav();
  initFaqAccordion();
  initAccountForms();
});
