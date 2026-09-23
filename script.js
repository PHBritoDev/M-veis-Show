/* =========================================================
   MÓVEIS SHOW — DEMO
   script.js
========================================================= */

(function () {
  "use strict";

  /* =====================================================
     CONFIGURAÇÃO — TROQUE AQUI PELO NÚMERO REAL DA LOJA
     Formato: código do país + DDD + número, apenas dígitos.
     Exemplo: "556199999999" (55 = Brasil, 61 = DDD de Goiás/DF)
  ===================================================== */
  const WHATSAPP_NUMBER = "5561982206185"; // <-- SUBSTITUIR pelo número real

  // Link de rota — trocar quando o endereço real for confirmado
  const MAPS_LINK = "https://www.google.com/maps/search/?api=1&query=Valpara%C3%ADso+de+Goi%C3%A1s+GO";

  function buildWhatsAppLink(message) {
    const text = encodeURIComponent(message || "Olá! Vim pelo site da Móveis Show.");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }

  function setupWhatsAppLinks() {
    document.querySelectorAll(".whats-link").forEach((el) => {
      const msg = el.getAttribute("data-msg") || "Olá! Vim pelo site da Móveis Show.";
      el.setAttribute("href", buildWhatsAppLink(msg));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
  }

  function setupMapsLink() {
    const mapsBtn = document.getElementById("mapsBtn");
    if (mapsBtn) mapsBtn.setAttribute("href", MAPS_LINK);
  }

  /* =====================================================
     MENU MOBILE
  ===================================================== */
  function setupMobileMenu() {
    const hamburger = document.getElementById("hamburgerBtn");
    const nav = document.getElementById("mainNav");
    if (!hamburger || !nav) return;

    function closeMenu() {
      hamburger.classList.remove("open");
      nav.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Abrir menu");
    }

    function toggleMenu() {
      const isOpen = nav.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      hamburger.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    }

    hamburger.addEventListener("click", toggleMenu);
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* =====================================================
     FAQ ACCORDION
  ===================================================== */
  function setupFaq() {
    document.querySelectorAll(".faq-question").forEach((btn) => {
      const answer = btn.nextElementSibling;
      btn.addEventListener("click", () => {
        const isOpen = btn.getAttribute("aria-expanded") === "true";

        document.querySelectorAll(".faq-question").forEach((otherBtn) => {
          if (otherBtn !== btn) {
            otherBtn.setAttribute("aria-expanded", "false");
            const otherAnswer = otherBtn.nextElementSibling;
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        btn.setAttribute("aria-expanded", String(!isOpen));
        if (!isOpen && answer) {
          answer.style.maxHeight = answer.scrollHeight + "px";
        } else if (answer) {
          answer.style.maxHeight = null;
        }
      });
    });
  }

  /* =====================================================
     BOTÃO VOLTAR AO TOPO
  ===================================================== */
  function setupBackToTop() {
    const btn = document.getElementById("backTop");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      () => btn.classList.toggle("visible", window.scrollY > 500),
      { passive: true }
    );
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* =====================================================
     ANIMAÇÕES DE ENTRADA
  ===================================================== */
  function setupFadeIn() {
    const items = document.querySelectorAll(".fade-up");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* =====================================================
     HEADER: sombra leve ao rolar
  ===================================================== */
  function setupHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    window.addEventListener(
      "scroll",
      () => {
        header.style.boxShadow = window.scrollY > 10 ? "0 12px 30px -20px rgba(34,31,26,.4)" : "none";
      },
      { passive: true }
    );
  }

  /* =====================================================
     INICIALIZAÇÃO
  ===================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    setupWhatsAppLinks();
    setupMapsLink();
    setupMobileMenu();
    setupFaq();
    setupBackToTop();
    setupFadeIn();
    setupHeaderScroll();
  });
})();
