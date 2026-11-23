/**
 * Shared UI Components: Header, Mobile Drawer, Footer, Toast, Product Cards & Customization Modal
 */
import { ADDONS, BRAND_CONFIG, CATEGORIES, PRODUCTS, UI_TEXT } from './data.js';
import { addToCart, calculateUnitPrice, getCartCount, getCustomerProfile } from './cart.js';
import { applyDocumentDirection, formatPrice, getLang, t, toggleLang } from './i18n.js';

export function getOrderEntryHref() {
  return getCustomerProfile() ? '/menu.html' : '/delivery.html?next=menu';
}

function getBrandLogo() {
  return '<img src="/images/brand-logo.png" alt="Amo Madbouly Pie & Pizza" />';
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
    ${
      showCartLink
        ? `<a href="/cart.html" style="text-decoration: underline; color: var(--color-accent); white-space: nowrap;">${escapeHtml(t(UI_TEXT.common.viewCart, lang))}</a>`
        : ''
    }
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 220);
  }, 3000);
}

export function renderHeader(activePage = 'home') {
  const headerEl = document.getElementById('site-header');
  if (!headerEl) return;

  const lang = getLang();
  const count = getCartCount();
  const navItems = [
    { key: 'home', href: '/index.html', label: t(UI_TEXT.nav.home, lang) },
    { key: 'menu', href: '/menu.html', label: t(UI_TEXT.nav.menu, lang) },
    { key: 'track', href: '/track.html', label: t(UI_TEXT.nav.track, lang) },
    { key: 'about', href: '/about.html', label: t(UI_TEXT.nav.about, lang) },
    { key: 'contact', href: '/contact.html', label: t(UI_TEXT.nav.contact, lang) },
  ];

  headerEl.className = 'site-header';
  headerEl.innerHTML = `
    <div class="container site-header__inner">
      <a href="/index.html" class="brand-link">
        <span class="brand-mark">${getBrandLogo()}</span>
        <span>${escapeHtml(t(BRAND_CONFIG.name, lang))}</span>
      </a>

      <nav class="nav-links" aria-label="Main Navigation">
        ${navItems
          .map(
            (item) => `
          <a href="${item.href}" class="nav-link ${activePage === item.key ? 'nav-link--active' : ''}">
            ${escapeHtml(item.label)}
          </a>
        `
          )
          .join('')}
      </nav>

      <div class="header-actions">
        <button type="button" class="lang-toggle" id="lang-toggle-btn" aria-label="Switch Language">
          ${lang === 'ar' ? 'EN' : 'عربي'}
        </button>

        <a href="/account.html" class="cart-trigger ${activePage === 'account' ? 'is-active' : ''}" aria-label="${escapeHtml(t(UI_TEXT.account.navLabel, lang))}" title="${escapeHtml(t(UI_TEXT.account.navLabel, lang))}">
          <i class="fa-regular fa-user"></i>
        </a>

        <a href="/cart.html" class="cart-trigger" aria-label="${escapeHtml(t(UI_TEXT.nav.cart, lang))}">
          <i class="fa-solid fa-bag-shopping"></i>
          <span class="cart-badge tabular-nums" id="header-cart-count">${count}</span>
        </a>

        <a href="${getOrderEntryHref()}" class="btn btn--primary btn--sm header-order-cta">
          ${escapeHtml(t(UI_TEXT.nav.orderNow, lang))}
        </a>

        <button type="button" class="mobile-menu-btn" id="mobile-menu-open" aria-label="Open Menu" aria-controls="mobile-drawer" aria-expanded="false">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </div>
  `;

  renderMobileDrawer(activePage, navItems, lang);

  document.getElementById('lang-toggle-btn')?.addEventListener('click', () => {
    toggleLang();
  });
}

function renderMobileDrawer(activePage, navItems, lang) {
  let drawer = document.getElementById('mobile-drawer');

  if (!drawer) {
    drawer = document.createElement('dialog');
    drawer.id = 'mobile-drawer';
    drawer.className = 'mobile-drawer';
    drawer.setAttribute('aria-label', 'Mobile Navigation');
    document.body.appendChild(drawer);

    drawer.addEventListener('close', () => {
      drawer.classList.remove('is-open');
      document.getElementById('mobile-menu-open')?.setAttribute('aria-expanded', 'false');
      document.getElementById('mobile-menu-open')?.focus();
    });
  }

  drawer.innerHTML = `
    <div class="mobile-drawer__head">
      <span class="brand-link">${escapeHtml(t(BRAND_CONFIG.name, lang))}</span>
      <button type="button" class="mobile-menu-btn" id="mobile-menu-close" aria-label="Close Menu">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <nav class="mobile-drawer__nav">
      ${navItems
        .map(
          (item) => `
        <a href="${item.href}" class="mobile-drawer__link ${activePage === item.key ? 'mobile-drawer__link--active' : ''}">
          ${escapeHtml(item.label)}
        </a>
      `
        )
        .join('')}
      <a href="/account.html" class="mobile-drawer__link ${activePage === 'account' ? 'mobile-drawer__link--active' : ''}">
        ${escapeHtml(t(UI_TEXT.account.navLabel, lang))}
      </a>
      <a href="/delivery.html" class="mobile-drawer__link ${activePage === 'delivery' ? 'mobile-drawer__link--active' : ''}">
        ${escapeHtml(t(UI_TEXT.delivery.navLabel, lang))}
      </a>
      <a href="/cart.html" class="mobile-drawer__link ${activePage === 'cart' ? 'mobile-drawer__link--active' : ''}">
        ${escapeHtml(t(UI_TEXT.nav.cart, lang))}
      </a>
    </nav>
    <a href="${getOrderEntryHref()}" class="btn btn--primary btn--full" style="margin-top: auto;">
      ${escapeHtml(t(UI_TEXT.nav.orderNow, lang))}
    </a>
  `;

  const openButton = document.getElementById('mobile-menu-open');
  openButton?.addEventListener('click', () => {
    if (drawer.open) return;
    drawer.showModal();
    openButton.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    document.getElementById('mobile-menu-close')?.focus();
  });

  drawer.querySelector('#mobile-menu-close')?.addEventListener('click', () => {
    if (drawer.open) drawer.close();
  });
  drawer.onclick = (event) => {
    if (event.target === drawer) drawer.close();
  };
  drawer.querySelectorAll('.mobile-drawer__link').forEach((link) => {
    link.addEventListener('click', () => {
      if (drawer.open) drawer.close();
    }, { once: true });
  });
}

export function renderFooter() {
  const footerEl = document.getElementById('site-footer');
  if (!footerEl) return;

  const lang = getLang();
  footerEl.className = 'site-footer';
  footerEl.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand-lockup">
            <img src="/images/brand-logo.png" alt="Amo Madbouly Pie & Pizza" />
            <h2 class="footer-brand">${escapeHtml(t(BRAND_CONFIG.name, lang))}</h2>
          </div>
          <p class="footer-copy">${escapeHtml(t(BRAND_CONFIG.tagline, lang))}</p>
          <div class="footer-socials">
            <a href="https://www.facebook.com/share/1FhQyU6Afz/" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://wa.me/${BRAND_CONFIG.whatsappNumber}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>

        <div>
          <h3 class="footer-heading">${escapeHtml(t(UI_TEXT.footer.quickLinks, lang))}</h3>
          <ul class="footer-list">
            <li><a href="/index.html">${escapeHtml(t(UI_TEXT.nav.home, lang))}</a></li>
            <li><a href="/menu.html">${escapeHtml(t(UI_TEXT.nav.menu, lang))}</a></li>
            <li><a href="/track.html">${escapeHtml(t(UI_TEXT.nav.track, lang))}</a></li>
            <li><a href="/account.html">${escapeHtml(t(UI_TEXT.account.navLabel, lang))}</a></li>
            <li><a href="/delivery.html">${escapeHtml(t(UI_TEXT.delivery.navLabel, lang))}</a></li>
            <li><a href="/about.html">${escapeHtml(t(UI_TEXT.nav.about, lang))}</a></li>
            <li><a href="/contact.html">${escapeHtml(t(UI_TEXT.nav.contact, lang))}</a></li>
            <li><a href="/cart.html">${escapeHtml(t(UI_TEXT.nav.cart, lang))}</a></li>
            <li><a href="/kitchen.html" target="_blank" rel="noopener noreferrer">${escapeHtml(t(UI_TEXT.kitchen.navLabel, lang))}</a></li>
          </ul>
        </div>

        <div>
          <h3 class="footer-heading">${escapeHtml(t(UI_TEXT.footer.contactInfo, lang))}</h3>
          <ul class="footer-list">
            <li><a href="${BRAND_CONFIG.phoneHref}" dir="ltr">${escapeHtml(BRAND_CONFIG.phone)}</a></li>
            <li><a href="mailto:${BRAND_CONFIG.email}">${escapeHtml(BRAND_CONFIG.email)}</a></li>
            <li>${escapeHtml(t(BRAND_CONFIG.address, lang))}</li>
          </ul>
        </div>

        <div>
          <h3 class="footer-heading">${escapeHtml(t(UI_TEXT.footer.openingHours, lang))}</h3>
          <ul class="footer-list">
            <li>${escapeHtml(t(BRAND_CONFIG.hours, lang))}</li>
            <li>${lang === 'ar' ? 'التوصيل متاح في مناطق الإسكندرية' : 'Delivery across Alexandria'}</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${escapeHtml(t(BRAND_CONFIG.name, lang))} · ${escapeHtml(t(UI_TEXT.footer.copyright, lang))}</span>
        <a href="/menu.html" style="color: var(--color-accent); font-weight: 600;">${escapeHtml(t(UI_TEXT.nav.orderNow, lang))}</a>
      </div>
    </div>
  `;
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
      <a href="/product.html?id=${product.id}" aria-label="${escapeHtml(t(product.name, lang))}">
        ${renderImageWithFallback(product.image, t(product.name, lang))}
      </a>
      <div class="product-card__body">
        <div class="product-card__meta">
          <span>${escapeHtml(metaParts.join(' · '))}</span>
        </div>
        <h3 class="product-card__title">
          <a href="/product.html?id=${product.id}">${escapeHtml(t(product.name, lang))}</a>
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

        <a href="/product.html?id=${product.id}" style="font-size: 0.85rem; color: var(--color-secondary); text-decoration: underline;">
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

export function initAppShell(activePage, onLangRefresh) {
  applyDocumentDirection();
  renderHeader(activePage);
  renderFooter();

  window.addEventListener('cart:updated', (e) => {
    const badge = document.getElementById('header-cart-count');
    if (badge) {
      badge.textContent = String(e.detail.count);
      badge.classList.remove('is-bump');
      void badge.offsetWidth;
      badge.classList.add('is-bump');
    }
  });

  window.addEventListener('lang:changed', () => {
    renderHeader(activePage);
    renderFooter();
    if (typeof onLangRefresh === 'function') {
      onLangRefresh();
    }
  });
}
