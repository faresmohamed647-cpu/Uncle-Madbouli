<script setup>
import { onBeforeUnmount, onMounted } from 'vue';
import { usePageLocale } from '../composables/usePageLocale.js';
import { BRAND_CONFIG, CATEGORIES, PRODUCTS, UI_TEXT } from '../js/data.js';
import { getLang, t } from '../js/i18n.js';
import { bindProductCardActions, escapeHtml, renderProductCard } from '../js/ui.js';

const params = new URLSearchParams(window.location.search);
let activeCategory = params.get('category') || 'all';
let searchQuery = '';

function renderMenuPage() {
  const lang = getLang();
  const root = document.getElementById('menu-root');
  if (!root) return;

  const bannerTitle = `${t(BRAND_CONFIG.name, lang)} ${lang === 'ar' ? '— المنيو الكامل' : 'Menu'}`;
  const bannerSub = lang === 'ar'
    ? 'فطائر لحوم وجبن وفراخ وباستا وبيتزا وحلو ومشلتت ومشروبات.'
    : 'Meat, cheese and chicken pies, pasta, pizza, sweets, meshaltet, drinks and extras.';

  root.innerHTML = `
    <section class="page-banner">
      <div class="container">
        <h1 class="page-banner__title">${escapeHtml(bannerTitle)}</h1>
        <p class="page-banner__subtitle">${escapeHtml(bannerSub)}</p>
        <div class="menu-flyer-links" aria-label="Download the printed menu">
          <a href="/images/menu-page-1.jpeg" download="Amo-Madbouly-menu-1.jpeg">${lang === 'ar' ? 'تحميل صورة المنيو ١' : 'Download menu image 1'}</a>
          <a href="/images/menu-page-2.jpeg" download="Amo-Madbouly-menu-2.jpeg">${lang === 'ar' ? 'تحميل صورة المنيو ٢' : 'Download menu image 2'}</a>
        </div>
      </div>
    </section>

    <section class="section" id="catalog">
      <div class="container">
        <div class="menu-controls">
          <div class="category-tabs" role="tablist" aria-label="Menu Categories">
            <button type="button" class="category-tab ${activeCategory === 'all' ? 'is-active' : ''}" data-cat="all">
              ${escapeHtml(t(UI_TEXT.common.allCategories, lang))}
            </button>
            ${CATEGORIES.map(
              (cat) => `
              <button type="button" class="category-tab ${activeCategory === cat.id ? 'is-active' : ''}" data-cat="${cat.id}">
                ${escapeHtml(t(cat.name, lang))}
              </button>
            `
            ).join('')}
          </div>

          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
              type="search"
              id="menu-search-input"
              class="search-input"
              value="${escapeHtml(searchQuery)}"
              placeholder="${escapeHtml(t(UI_TEXT.common.searchPlaceholder, lang))}"
              aria-label="${escapeHtml(t(UI_TEXT.common.searchPlaceholder, lang))}"
            />
          </div>
        </div>

        <div id="menu-grid-container"></div>
      </div>
    </section>
  `;

  root.querySelectorAll('.category-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      activeCategory = tab.getAttribute('data-cat') || 'all';
      root.querySelectorAll('.category-tab').forEach((b) => b.classList.remove('is-active'));
      tab.classList.add('is-active');
      const url = new URL(window.location.href);
      if (activeCategory === 'all') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', activeCategory);
      }
      window.history.replaceState({}, '', url);
      renderFilteredProducts();
    });
  });

  const searchInput = document.getElementById('menu-search-input');
  searchInput?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderFilteredProducts();
  });

  renderFilteredProducts();
}

function renderFilteredProducts() {
  const lang = getLang();
  const gridContainer = document.getElementById('menu-grid-container');
  if (!gridContainer) return;

  const q = searchQuery.trim().toLowerCase();
  const filtered = PRODUCTS.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    if (!matchesCategory) return false;
    if (!q) return true;
    const text = [
      product.name.ar,
      product.name.en,
      product.description.ar,
      product.description.en,
    ]
      .join(' ')
      .toLowerCase();
    return text.includes(q);
  });

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon"><i class="fa-solid fa-wheat-awn"></i></div>
        <h3>${escapeHtml(t(UI_TEXT.common.noResults, lang))}</h3>
        <button type="button" class="btn btn--primary" id="reset-menu-filters" style="margin-top: 12px;">
          ${escapeHtml(t(UI_TEXT.common.resetFilters, lang))}
        </button>
      </div>
    `;
    document.getElementById('reset-menu-filters')?.addEventListener('click', () => {
      activeCategory = 'all';
      searchQuery = '';
      renderMenuPage();
    });
    return;
  }

  gridContainer.innerHTML = `
    <div class="products-grid">
      ${filtered.map((p) => renderProductCard(p)).join('')}
    </div>
  `;
  bindProductCardActions(gridContainer);
}

function mountPage() {
  renderMenuPage();
}

function unmountPage() {}

usePageLocale(renderMenuPage);
onMounted(mountPage);
onBeforeUnmount(unmountPage);
</script>

<template>
  <main id="menu-root"></main>
</template>
