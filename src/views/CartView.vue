<script setup>
import { onBeforeUnmount, onMounted } from 'vue';
import { usePageLocale } from '../composables/usePageLocale.js';
import { ADDONS, BRAND_CONFIG, PRODUCTS, UI_TEXT } from '../js/data.js';
import { getCartTotals, removeFromCart, updateQuantity } from '../js/cart.js';
import { formatPrice, getLang, t } from '../js/i18n.js';
import { escapeHtml, renderImageWithFallback } from '../js/ui.js';

function renderCartPage() {
  const lang = getLang();
  const root = document.getElementById('cart-root');
  if (!root) return;

  const totals = getCartTotals();

  if (totals.items.length === 0) {
    root.innerHTML = `
      <section class="page-banner">
        <div class="container">
          <h1 class="page-banner__title">${escapeHtml(t(UI_TEXT.cart.title, lang))}</h1>
          <p class="page-banner__subtitle">${escapeHtml(t(UI_TEXT.cart.subtitle, lang))}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="empty-state">
            <div class="empty-state__icon"><i class="fa-solid fa-bag-shopping"></i></div>
            <h2>${escapeHtml(t(UI_TEXT.cart.emptyTitle, lang))}</h2>
            <p style="color: var(--color-text-muted); margin-bottom: 20px;">${escapeHtml(t(UI_TEXT.cart.emptyDesc, lang))}</p>
            <a href="/menu" class="btn btn--primary btn--lg">${escapeHtml(t(UI_TEXT.cart.browseMenu, lang))}</a>
          </div>
        </div>
      </section>
    `;
    return;
  }

  const progressPct = Math.min(100, Math.round((totals.subtotal / BRAND_CONFIG.freeDeliveryThreshold) * 100));
  const deliveryBannerText = totals.isFreeDelivery
    ? t(UI_TEXT.cart.freeDeliveryAchieved, lang)
    : t(UI_TEXT.cart.freeDeliveryRemaining, lang).replace('{amount}', formatPrice(totals.amountForFree, lang));

  root.innerHTML = `
    <section class="page-banner">
      <div class="container">
        <h1 class="page-banner__title">${escapeHtml(t(UI_TEXT.cart.title, lang))}</h1>
        <p class="page-banner__subtitle">${escapeHtml(t(UI_TEXT.cart.subtitle, lang))}</p>
      </div>
    </section>

    <section class="section">
      <div class="container cart-layout">
        <div class="panel">
          <div class="cart-items">
            ${totals.items
              .map((item) => {
                const product = PRODUCTS.find((p) => p.id === item.productId);
                if (!product) return '';
                const sizeObj = product.sizes?.find((s) => s.id === item.sizeId);
                const addonNames = (item.addonIds || [])
                  .map((id) => t(ADDONS[id]?.name, lang))
                  .filter(Boolean);

                const detailsParts = [];
                if (sizeObj) detailsParts.push(t(sizeObj.label, lang));
                if (addonNames.length) detailsParts.push(addonNames.join('، '));

                return `
                  <article class="cart-item">
                    <div class="cart-item__img">
                      ${renderImageWithFallback(product.image, t(product.name, lang))}
                    </div>
                    <div class="cart-item__body">
                      <div class="cart-item__top">
                        <div>
                          <h3 class="cart-item__title">
                            <a href="/product?id=${product.id}">${escapeHtml(t(product.name, lang))}</a>
                          </h3>
                          ${detailsParts.length ? `<div class="cart-item__meta">${escapeHtml(detailsParts.join(' · '))}</div>` : ''}
                          ${item.instructions ? `<div class="cart-item__meta" style="margin-top: 2px;">“${escapeHtml(item.instructions)}”</div>` : ''}
                        </div>
                        <strong class="tabular-nums" style="color: var(--color-primary); white-space: nowrap;">
                          ${escapeHtml(formatPrice(item.unitPrice * item.quantity, lang))}
                        </strong>
                      </div>
                      <div class="cart-item__controls">
                        <div class="qty-stepper" style="height: 36px;">
                          <button type="button" class="js-qty-dec" data-item-id="${escapeHtml(item.cartItemId)}" aria-label="Decrease">−</button>
                          <span class="tabular-nums">${item.quantity}</span>
                          <button type="button" class="js-qty-inc" data-item-id="${escapeHtml(item.cartItemId)}" aria-label="Increase">+</button>
                        </div>
                        <button type="button" class="remove-btn js-remove-item" data-item-id="${escapeHtml(item.cartItemId)}">
                          <i class="fa-solid fa-trash-can"></i>
                          <span>${escapeHtml(t(UI_TEXT.cart.remove, lang))}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                `;
              })
              .join('')}
          </div>
        </div>

        <aside class="panel">
          <div class="delivery-progress">
            <span>${escapeHtml(deliveryBannerText)}</span>
            <div class="delivery-progress__bar">
              <div class="delivery-progress__fill" style="width: ${progressPct}%;"></div>
            </div>
          </div>

          <div class="summary-rows">
            <div class="summary-row">
              <span>${escapeHtml(t(UI_TEXT.cart.subtotal, lang))}</span>
              <span class="tabular-nums">${escapeHtml(formatPrice(totals.subtotal, lang))}</span>
            </div>
            <div class="summary-row">
              <span>${escapeHtml(t(UI_TEXT.cart.deliveryFee, lang))}</span>
              <span class="tabular-nums">${totals.isFreeDelivery ? escapeHtml(t(UI_TEXT.cart.freeDelivery, lang)) : escapeHtml(formatPrice(totals.deliveryFee, lang))}</span>
            </div>
            <div class="summary-row summary-row--total">
              <span>${escapeHtml(t(UI_TEXT.cart.total, lang))}</span>
              <span class="tabular-nums">${escapeHtml(formatPrice(totals.total, lang))}</span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            <a href="/checkout" class="btn btn--primary btn--lg btn--full">
              ${escapeHtml(t(UI_TEXT.cart.proceedCheckout, lang))}
            </a>
            <a href="/menu" class="btn btn--outline btn--full">
              ${escapeHtml(t(UI_TEXT.cart.continueShopping, lang))}
            </a>
          </div>
        </aside>
      </div>
    </section>
  `;

  root.querySelectorAll('.js-qty-dec').forEach((btn) => {
    btn.addEventListener('click', () => {
      updateQuantity(btn.getAttribute('data-item-id'), -1);
      renderCartPage();
    });
  });

  root.querySelectorAll('.js-qty-inc').forEach((btn) => {
    btn.addEventListener('click', () => {
      updateQuantity(btn.getAttribute('data-item-id'), 1);
      renderCartPage();
    });
  });

  root.querySelectorAll('.js-remove-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeFromCart(btn.getAttribute('data-item-id'));
      renderCartPage();
    });
  });
}

function mountPage() {
  renderCartPage();
}

function unmountPage() {}

usePageLocale(renderCartPage);
onMounted(mountPage);
onBeforeUnmount(unmountPage);
</script>

<template>
  <main id="cart-root"></main>
</template>
