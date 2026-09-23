/* =========================================================
   NOGUEIRA CASA — DEMO
   script.js — usa os dados de products.js (variável PRODUCTS)
========================================================= */

(function () {
  "use strict";

  /* =====================================================
     CONFIGURAÇÃO
  ===================================================== */
  const WHATSAPP_NUMBER = "5561982206185"; // Número real da loja

  const MAPS_LINK =
    "https://www.google.com/maps/search/?api=1&query=Quadra+115+Rua+67+Jardim+C%C3%A9u+Azul+Valpara%C3%ADso+de+Goi%C3%A1s+GO";

  // Imagem representativa de cada categoria (cards da seção "Categorias")
  const CATEGORY_IMAGES = {
    "Sofás": "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=900&q=80&auto=format&fit=crop",
    "Camas": "https://cdn.pixabay.com/photo/2018/01/23/06/58/modern-minimalist-bedroom-3100786_1280.jpg",
    "Guarda-roupas": "https://images.unsplash.com/photo-1718939045285-b67f9e9f9f8b?w=900&q=80&auto=format&fit=crop",
    "Mesas": "https://images.unsplash.com/photo-1676223303556-bef6fdac9331?w=900&q=80&auto=format&fit=crop",
    "Cadeiras": "https://images.unsplash.com/photo-1676223303556-bef6fdac9331?w=900&q=80&auto=format&fit=crop",
    "Estantes": "https://images.unsplash.com/photo-1676223303556-bef6fdac9331?w=900&q=80&auto=format&fit=crop",
    "Racks": "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=900&q=80&auto=format&fit=crop",
    "Armários": "https://images.unsplash.com/photo-1718939045285-b67f9e9f9f8b?w=900&q=80&auto=format&fit=crop",
  };

  let currentFilter = "Todos";
  let currentSearch = "";

  function formatPrice(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function buildWhatsAppLink(message) {
    const text = encodeURIComponent(message || "Olá! Gostaria de saber mais informações sobre os móveis da loja.");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }

  /* =====================================================
     RENDERIZAÇÃO: CATEGORIAS
  ===================================================== */
  function renderCategories() {
    const wrap = document.getElementById("catGrid");
    if (!wrap) return;
    wrap.innerHTML = Object.keys(CATEGORY_IMAGES)
      .map(
        (cat) => `
        <button class="cat-card" data-goto-category="${cat}" aria-label="Ver produtos de ${cat}">
          <img loading="lazy" src="${CATEGORY_IMAGES[cat]}" alt="${cat}">
          <span class="cat-overlay"></span>
          <span class="cat-name">${cat}</span>
        </button>`
      )
      .join("");

    wrap.querySelectorAll("[data-goto-category]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-goto-category");
        setFilter(cat);
        document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  /* =====================================================
     RENDERIZAÇÃO: CARD DE PRODUTO
  ===================================================== */
  function productCardHTML(p) {
    const msg = `Olá! Tenho interesse neste produto: ${p.name}. Gostaria de saber mais informações.`;
    return `
      <article class="prod-card">
        <div class="prod-img-wrap">
          <img loading="lazy" src="${p.image}" alt="${p.name}">
          <span class="prod-cat-tag">${p.category}</span>
        </div>
        <div class="prod-body">
          <h3>${p.name}</h3>
          <p>${p.shortDesc}</p>
          <span class="prod-price"><span>Preço de demonstração</span>${formatPrice(p.price)}</span>
          <div class="prod-actions">
            <button class="btn btn-outline btn-small" data-details="${p.id}">Ver detalhes</button>
            <a href="${buildWhatsAppLink(msg)}" class="btn btn-primary btn-small" target="_blank" rel="noopener">Tenho interesse</a>
          </div>
        </div>
      </article>`;
  }

  function renderFeatured() {
    const wrap = document.getElementById("featuredGrid");
    if (!wrap) return;
    const featured = PRODUCTS.filter((p) => p.featured);
    wrap.innerHTML = featured.map(productCardHTML).join("");
    attachDetailButtons(wrap);
  }

  /* =====================================================
     RENDERIZAÇÃO: CATÁLOGO (COM FILTRO E BUSCA)
  ===================================================== */
  function renderCatalog() {
    const wrap = document.getElementById("catalogGrid");
    const countEl = document.getElementById("catalogCount");
    const emptyEl = document.getElementById("catalogEmpty");
    if (!wrap) return;

    const term = currentSearch.trim().toLowerCase();

    const filtered = PRODUCTS.filter((p) => {
      const matchesCategory = currentFilter === "Todos" || p.category === currentFilter;
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.shortDesc.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });

    wrap.innerHTML = filtered.map(productCardHTML).join("");
    attachDetailButtons(wrap);

    if (countEl) {
      countEl.textContent = `${filtered.length} produto${filtered.length === 1 ? "" : "s"} encontrado${filtered.length === 1 ? "" : "s"}`;
    }
    if (emptyEl) emptyEl.hidden = filtered.length !== 0;
    wrap.hidden = filtered.length === 0;
  }

  function setFilter(cat) {
    currentFilter = cat;
    document.querySelectorAll(".chip").forEach((chip) => {
      chip.classList.toggle("is-active", chip.getAttribute("data-filter") === cat);
    });
    renderCatalog();
  }

  function setupCatalogControls() {
    document.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => setFilter(chip.getAttribute("data-filter")));
    });

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        currentSearch = e.target.value;
        renderCatalog();
      });
    }
  }

  /* =====================================================
     MODAL DE DETALHES DO PRODUTO
  ===================================================== */
  function attachDetailButtons(scope) {
    scope.querySelectorAll("[data-details]").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.getAttribute("data-details")));
    });
  }

  function openModal(productId) {
    const p = PRODUCTS.find((item) => item.id === productId);
    if (!p) return;

    const overlay = document.getElementById("modalOverlay");
    const body = document.getElementById("modalBody");
    if (!overlay || !body) return;

    const msg = `Olá! Tenho interesse neste produto: ${p.name}. Gostaria de saber mais informações.`;

    body.innerHTML = `
      <img class="modal-img" src="${p.image}" alt="${p.name}">
      <p class="modal-cat">${p.category}</p>
      <h2 class="modal-title" id="modalTitle">${p.name}</h2>
      <p class="modal-price">${formatPrice(p.price)}<span>Preço de demonstração — consulte disponibilidade</span></p>
      <p class="modal-desc">${p.description}</p>
      <div class="modal-grid">
        <div class="modal-block">
          <h4>Características</h4>
          <ul>${p.features.map((f) => `<li>${f}</li>`).join("")}</ul>
        </div>
        <div class="modal-block">
          <h4>Ficha técnica</h4>
          <p class="modal-specs"><strong>Dimensões:</strong> ${p.dimensions}</p>
          <p class="modal-specs"><strong>Materiais:</strong> ${p.materials}</p>
          ${
            p.options && p.options.length
              ? `<p class="modal-specs" style="margin-top:10px;"><strong>Opções disponíveis:</strong></p>
                 <div class="modal-options">${p.options.map((o) => `<span class="modal-option-tag">${o}</span>`).join("")}</div>`
              : ""
          }
        </div>
      </div>
      <a href="${buildWhatsAppLink(msg)}" class="btn btn-primary" target="_blank" rel="noopener">Tenho interesse</a>
    `;

    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    const overlay = document.getElementById("modalOverlay");
    if (!overlay) return;
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  function setupModal() {
    const overlay = document.getElementById("modalOverlay");
    const closeBtn = document.getElementById("modalClose");
    if (!overlay) return;

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  /* =====================================================
     LINKS DE WHATSAPP ESTÁTICOS (hero, header, footer, cta...)
  ===================================================== */
  function setupStaticWhatsAppLinks() {
    document.querySelectorAll(".whats-link").forEach((el) => {
      const msg = el.getAttribute("data-msg") || "Olá! Gostaria de saber mais informações sobre os móveis da loja.";
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
     BOTÃO VOLTAR AO TOPO
  ===================================================== */
  function setupBackToTop() {
    const btn = document.getElementById("backTop");
    if (!btn) return;
    window.addEventListener("scroll", () => btn.classList.toggle("visible", window.scrollY > 500), { passive: true });
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

  function setupHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    window.addEventListener(
      "scroll",
      () => {
        header.style.boxShadow = window.scrollY > 10 ? "0 12px 30px -20px rgba(42,33,23,.4)" : "none";
      },
      { passive: true }
    );
  }

  /* =====================================================
     INICIALIZAÇÃO
  ===================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    renderCategories();
    renderFeatured();
    renderCatalog();
    setupCatalogControls();
    setupModal();
    setupStaticWhatsAppLinks();
    setupMapsLink();
    setupMobileMenu();
    setupBackToTop();
    setupFadeIn();
    setupHeaderScroll();
  });
})();
