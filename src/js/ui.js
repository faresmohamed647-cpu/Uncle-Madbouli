/**
 * Shared catalog UI utilities: toasts, product cards, and customization modal.
 */
import { ADDONS, CATEGORIES, PRODUCTS, UI_TEXT } from './data.js';
import { addToCart, calculateUnitPrice, getCustomerProfile } from './cart.js';
import { formatPrice, getLang, t } from './i18n.js';

export function getOrderEntryHref() {
  return getCustomerProfile() ? '/menu' : '/delivery?next=menu';
}

export function renderImageWithFallback(src, alt, className = '') {
  return `
    <div class="media-frame ${className}">
      <img src="${src}" alt="${escapeHtml(alt)}" referrerpolicy="no-referrer" loading="lazy" onerror="this.parentElement.classList.add('is-broken')" />
      <div class="media-fallback" aria-hidden="true">
        <i class="fa-solid fa-bread-slice fa-2x"></i>
        <span>${escapeHtml(alt)}</span>
      </div>
    </div>
  `;
}

export function escapeHtml(str) {
  return String(str || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function showToast(message, showCartLink = true) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const lang = getLang();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span><i class="fa-solid fa-circle-check"></i> ${escapeHtml(message)}</span>
    ${showCartLink ? `<a href="/cart" style="text-decoration: underline; color: var(--color-accent); white-space: nowrap;">${escapeHtml(t(UI_TEXT.common.viewCart, lang))}</a>` : ''}
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 220);
  }, 3000);
}

export function renderProductCard(product) {
  const lang = getLang();
  const category = CATEGORIES.find((c) => c.id === product.category);
  const categoryLabel = category ? t(category.name, lang) : '';
  const metaParts = [categoryLabel];
  if (product.isBestSeller) {
    metaParts.push(t(UI_TEXT.common.bestSellerTag, lang));
  }

  return `
    <article class="product-card tilt-3d" data-product-id="${product.id}">
      <a href="/product?id=${product.id}" aria-label="${escapeHtml(t(product.name, lang))}">
        ${renderImageWithFallback(product.image, t(product.name, lang))}
      </a>
      <div class="product-card__body">
        <div class="product-card__meta">
          <span>${escapeHtml(metaParts.join(' · '))}</span>
        </div>
        <h3 class="product-card__title">
          <a href="/product?id=${product.id}">${escapeHtml(t(product.name, lang))}</a>
        </h3>
        <p class="product-card__desc">${escapeHtml(t(product.description, lang))}</p>
        <div class="product-card__footer">
          <span class="product-card__price tabular-nums">${escapeHtml(formatPrice(product.basePrice, lang))}</span>
          <div class="product-card__actions">
            <button type="button" class="btn btn--outline btn--sm js-open-customize" data-id="${product.id}">
              ${escapeHtml(t(UI_TEXT.common.customize, lang))}
            </button>
            <button type="button" class="btn btn--primary btn--sm js-quick-add" data-id="${product.id}">
              <i class="fa-solid fa-plus"></i>
              <span>${escapeHtml(t(UI_TEXT.common.addToCart, lang))}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

export function bindProductCardActions(container = document) {
  container.querySelectorAll('.js-quick-add').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      addToCart({ productId: id, quantity: 1 });
      const product = PRODUCTS.find((p) => p.id === id);
      showToast(`${t(product?.name, getLang())} — ${t(UI_TEXT.common.addedToast, getLang())}`);
    });
  });

  container.querySelectorAll('.js-open-customize').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openProductModal(id);
    });
  });

  bind3DTilt(container);
}

export function bind3DTilt(root = document) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  root.querySelectorAll('.tilt-3d').forEach((el) => {
    if (el.dataset.tiltBound === '1') return;
    el.dataset.tiltBound = '1';

    let rafId = 0;
    const maxDeg = el.classList.contains('hero-media') ? 5.5 : 4.2;

    el.addEventListener('pointermove', (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const rx = (-py * maxDeg * 2).toFixed(2);
        const ry = (px * maxDeg * 2).toFixed(2);
        el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
        el.style.setProperty('--glare-x', `${Math.round((px + 0.5) * 100)}%`);
        el.style.setProperty('--glare-y', `${Math.round((py + 0.5) * 100)}%`);
      });
    });

    el.addEventListener('pointerleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.style.transform = '';
    });
  });
}

/* ==========================================================================
   Shared Product Customization Modal
   ========================================================================== */
export function openProductModal(productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  let backdrop = document.getElementById('product-modal-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'product-modal-backdrop';
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `<div class="modal-dialog" role="dialog" aria-modal="true" id="product-modal-dialog"></div>`;
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeProductModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
        closeProductModal();
      }
    });
  }

  const dialog = document.getElementById('product-modal-dialog');
  const lang = getLang();
  const state = {
    sizeId: product.hasSizes && product.sizes.length ? product.sizes[0].id : null,
    addonIds: [],
    quantity: 1,
    instructions: '',
  };

  function updateModalTotal() {
    const unit = calculateUnitPrice(product.id, state.sizeId, state.addonIds);
    const total = unit * state.quantity;
    const totalEl = dialog.querySelector('#modal-live-total');
    if (totalEl) totalEl.textContent = formatPrice(total, lang);
  }

  const category = CATEGORIES.find((c) => c.id === product.category);

  dialog.innerHTML = `
    <button type="button" class="modal-close" id="modal-close-btn" aria-label="Close">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <div class="pdp-grid">
      <div class="pdp-media">
        ${renderImageWithFallback(product.image, t(product.name, lang))}
      </div>
      <div class="pdp-info">
        <div class="product-card__meta">
          <span>${escapeHtml(t(category?.name, lang))}</span>
          ${product.isBestSeller ? `<span>· ${escapeHtml(t(UI_TEXT.common.bestSellerTag, lang))}</span>` : ''}
        </div>
        <h2 class="pdp-title">${escapeHtml(t(product.name, lang))}</h2>
        <p class="pdp-desc">${escapeHtml(t(product.description, lang))}</p>

        ${
          product.hasSizes
            ? `
          <div>
            <span class="pdp-group-label">${escapeHtml(t(UI_TEXT.product.selectSize, lang))}</span>
            <div class="size-options" id="modal-sizes">
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
            <div class="addons-list" id="modal-addons">
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
          <label class="pdp-group-label" for="modal-notes">${escapeHtml(t(UI_TEXT.product.instructions, lang))}</label>
          <textarea id="modal-notes" class="notes-input" placeholder="${escapeHtml(t(UI_TEXT.product.instructionsPlaceholder, lang))}"></textarea>
        </div>

        <div class="pdp-buy-row">
          <div class="qty-stepper" aria-label="${escapeHtml(t(UI_TEXT.product.quantity, lang))}">
            <button type="button" id="modal-qty-dec" aria-label="Decrease">−</button>
            <span id="modal-qty-val" class="tabular-nums">1</span>
            <button type="button" id="modal-qty-inc" aria-label="Increase">+</button>
          </div>
          <button type="button" class="btn btn--primary" style="flex: 1 1 180px;" id="modal-add-btn">
            <span>${escapeHtml(t(UI_TEXT.common.addToCart, lang))}</span>
            <span>·</span>
            <span id="modal-live-total" class="tabular-nums">${escapeHtml(formatPrice(product.basePrice, lang))}</span>
          </button>
        </div>

        <a href="/product?id=${product.id}" style="font-size: 0.85rem; color: var(--color-secondary); text-decoration: underline;">
          ${escapeHtml(t(UI_TEXT.common.viewDetails, lang))}
        </a>
      </div>
    </div>
  `;

  backdrop.classList.add('is-open');

  dialog.querySelector('#modal-close-btn')?.addEventListener('click', closeProductModal);

  dialog.querySelectorAll('#modal-sizes .size-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      dialog.querySelectorAll('#modal-sizes .size-option').forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      state.sizeId = btn.getAttribute('data-size-id');
      updateModalTotal();
    });
  });

  dialog.querySelectorAll('#modal-addons input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      state.addonIds = Array.from(dialog.querySelectorAll('#modal-addons input:checked')).map((el) => el.value);
      updateModalTotal();
    });
  });

  dialog.querySelector('#modal-qty-dec')?.addEventListener('click', () => {
    if (state.quantity > 1) {
      state.quantity -= 1;
      dialog.querySelector('#modal-qty-val').textContent = String(state.quantity);
      updateModalTotal();
    }
  });

  dialog.querySelector('#modal-qty-inc')?.addEventListener('click', () => {
    state.quantity += 1;
    dialog.querySelector('#modal-qty-val').textContent = String(state.quantity);
    updateModalTotal();
  });

  dialog.querySelector('#modal-add-btn')?.addEventListener('click', () => {
    state.instructions = dialog.querySelector('#modal-notes')?.value || '';
    addToCart({
      productId: product.id,
      sizeId: state.sizeId,
      addonIds: state.addonIds,
      instructions: state.instructions,
      quantity: state.quantity,
    });
    closeProductModal();
    showToast(`${t(product.name, lang)} — ${t(UI_TEXT.common.addedToast, lang)}`);
  });
}

export function closeProductModal() {
  document.getElementById('product-modal-backdrop')?.classList.remove('is-open');
}

