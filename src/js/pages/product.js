import { ADDONS, CATEGORIES, PRODUCTS, UI_TEXT } from '../data.js';
import { addToCart, calculateUnitPrice } from '../cart.js';
import { formatPrice, getLang, t } from '../i18n.js';
import {
  bindProductCardActions,
  escapeHtml,
  initAppShell,
  renderImageWithFallback,
  renderProductCard,
  showToast,
} from '../ui.js';

function renderProductDetailsPage() {
  const lang = getLang();
  const root = document.getElementById('product-root');
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get('id');
  const product = PRODUCTS.find((p) => p.id === requestedId) || PRODUCTS[0];
  const category = CATEGORIES.find((c) => c.id === product.category);

  const state = {
    sizeId: product.hasSizes && product.sizes.length ? product.sizes[0].id : null,
    addonIds: [],
    quantity: 1,
    instructions: '',
  };

  const related = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);
  if (related.length < 3) {
    for (const candidate of PRODUCTS) {
      if (candidate.id !== product.id && !related.some((r) => r.id === candidate.id)) {
        related.push(candidate);
      }
      if (related.length === 3) break;
    }
  }

  document.title = `${t(product.name, lang)} — Feteer House`;

  root.innerHTML = `
    <section class="section" style="padding-top: 28px;">
      <div class="container">
        <nav aria-label="Breadcrumb" style="margin-bottom: 20px; font-size: 0.9rem; color: var(--color-text-muted); display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px;">
          <a href="/index.html">${escapeHtml(t(UI_TEXT.nav.home, lang))}</a>
          <span style="margin-inline: 8px;">/</span>
          <a href="/menu.html?category=${product.category}">${escapeHtml(t(category?.name, lang))}</a>
          <span style="margin-inline: 8px;">/</span>
          <strong style="color: var(--color-primary);">${escapeHtml(t(product.name, lang))}</strong>
        </nav>

        <div class="panel" style="padding: 0; overflow: hidden;">
          <div class="pdp-grid">
            <div class="pdp-media">
              ${renderImageWithFallback(product.image, t(product.name, lang))}
            </div>
            <div class="pdp-info">
              <div class="product-card__meta">
                <span>${escapeHtml(t(category?.name, lang))}</span>
                ${product.isBestSeller ? `<span>· ${escapeHtml(t(UI_TEXT.common.bestSellerTag, lang))}</span>` : ''}
              </div>
              <h1 class="pdp-title">${escapeHtml(t(product.name, lang))}</h1>
              <p class="pdp-desc">${escapeHtml(t(product.description, lang))}</p>

              ${
                product.hasSizes
                  ? `
                <div>
                  <span class="pdp-group-label">${escapeHtml(t(UI_TEXT.product.selectSize, lang))}</span>
                  <div class="size-options" id="pdp-sizes">
                    ${product.sizes
                      .map(
                        (sz, i) => `
                      <button type="button" class="size-option ${i === 0 ? 'is-selected' : ''}" data-size-id="${sz.id}">
                        <span class="size-option__name">${escapeHtml(t(sz.label, lang))}</span>
                        <span class="size-option__delta tabular-nums">${escapeHtml(formatPrice(sz.price ?? (product.basePrice + (sz.priceDelta || 0)), lang))}</span>
                      </button>
                    `
                      )
                      .join('')}
                  </div>
                </div>
              `
                  : ''
              }

              ${
                product.availableAddons.length
                  ? `
                <div>
                  <span class="pdp-group-label">${escapeHtml(t(UI_TEXT.product.selectAddons, lang))}</span>
                  <div class="addons-list" id="pdp-addons">
                    ${product.availableAddons
                      .map((addonId) => {
                        const addon = ADDONS[addonId];
                        if (!addon) return '';
                        return `
                          <label class="addon-item">
                            <span class="addon-item__left">
                              <input type="checkbox" value="${addon.id}" />
                              <span>${escapeHtml(t(addon.name, lang))}</span>
                            </span>
                            <span class="tabular-nums">+${escapeHtml(formatPrice(addon.price, lang))}</span>
                          </label>
                        `;
                      })
                      .join('')}
                  </div>
                </div>
              `
                  : ''
              }

              <div>
                <label class="pdp-group-label" for="pdp-notes">${escapeHtml(t(UI_TEXT.product.instructions, lang))}</label>
                <textarea id="pdp-notes" class="notes-input" placeholder="${escapeHtml(t(UI_TEXT.product.instructionsPlaceholder, lang))}"></textarea>
              </div>

              <div class="pdp-buy-row">
                <div class="qty-stepper">
                  <button type="button" id="pdp-qty-dec" aria-label="Decrease">−</button>
                  <span id="pdp-qty-val" class="tabular-nums">1</span>
                  <button type="button" id="pdp-qty-inc" aria-label="Increase">+</button>
                </div>
                <button type="button" class="btn btn--primary btn--lg" style="flex: 1 1 180px;" id="pdp-add-btn">
                  <span>${escapeHtml(t(UI_TEXT.common.addToCart, lang))}</span>
                  <span>·</span>
                  <span id="pdp-live-total" class="tabular-nums">${escapeHtml(formatPrice(product.basePrice, lang))}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">${escapeHtml(t(UI_TEXT.product.relatedTitle, lang))}</h2>
          <a href="/menu.html" class="btn btn--outline">${escapeHtml(t(UI_TEXT.sections.viewFullMenu, lang))}</a>
        </div>
        <div class="products-grid">
          ${related.map((item) => renderProductCard(item)).join('')}
        </div>
      </div>
    </section>
  `;

  function updatePdpTotal() {
    const unit = calculateUnitPrice(product.id, state.sizeId, state.addonIds);
    const total = unit * state.quantity;
    const totalEl = document.getElementById('pdp-live-total');
    if (totalEl) totalEl.textContent = formatPrice(total, lang);
  }

  root.querySelectorAll('#pdp-sizes .size-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('#pdp-sizes .size-option').forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      state.sizeId = btn.getAttribute('data-size-id');
      updatePdpTotal();
    });
  });

  root.querySelectorAll('#pdp-addons input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      state.addonIds = Array.from(root.querySelectorAll('#pdp-addons input:checked')).map((el) => el.value);
      updatePdpTotal();
    });
  });

  document.getElementById('pdp-qty-dec')?.addEventListener('click', () => {
    if (state.quantity > 1) {
      state.quantity -= 1;
      document.getElementById('pdp-qty-val').textContent = String(state.quantity);
      updatePdpTotal();
    }
  });

  document.getElementById('pdp-qty-inc')?.addEventListener('click', () => {
    state.quantity += 1;
    document.getElementById('pdp-qty-val').textContent = String(state.quantity);
    updatePdpTotal();
  });

  document.getElementById('pdp-add-btn')?.addEventListener('click', () => {
    state.instructions = document.getElementById('pdp-notes')?.value || '';
    addToCart({
      productId: product.id,
      sizeId: state.sizeId,
      addonIds: state.addonIds,
      instructions: state.instructions,
      quantity: state.quantity,
    });
    showToast(`${t(product.name, lang)} — ${t(UI_TEXT.common.addedToast, lang)}`);
  });

  bindProductCardActions(root);
}

initAppShell('menu', renderProductDetailsPage);
renderProductDetailsPage();
