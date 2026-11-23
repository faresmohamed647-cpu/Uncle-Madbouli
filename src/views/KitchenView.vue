<script setup>
import { onBeforeUnmount, onMounted } from 'vue';
import { usePageLocale } from '../composables/usePageLocale.js';
import { UI_TEXT } from '../js/data.js';
import {
  createDemoOrderReceipt,
  getOrdersHistory,
  getOrderStageIndex,
  subscribeOrderUpdates,
  updateOrderByNumber,
} from '../js/cart.js';
import { formatPrice, getLang, t } from '../js/i18n.js';
import { escapeHtml, showToast } from '../js/ui.js';

const STAGE_PROGRESS_VALUES = [15, 45, 78, 100];
let autoTimer = null;

function stopAutoTimer() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}

function startAutoTimerIfNeeded() {
  stopAutoTimer();
  const orders = getOrdersHistory();
  const hasRunningOrder = orders.some((o) => !o.paused && Number(o.trackingProgress ?? 15) < 100);
  if (!hasRunningOrder) return;

  autoTimer = setInterval(() => {
    const currentOrders = getOrdersHistory();
    let changed = false;
    currentOrders.forEach((ord) => {
      const curr = Number(ord.trackingProgress ?? 15);
      if (!ord.paused && curr < 100) {
        updateOrderByNumber(ord.orderNumber, {
          trackingProgress: Math.min(100, curr + 4),
        });
        changed = true;
      }
    });
    if (changed) {
      renderKitchenPage();
    } else {
      stopAutoTimer();
    }
  }, 2500);
}

function renderKitchenPage() {
  const lang = getLang();
  const root = document.getElementById('kitchen-root');
  if (!root) return;

  const orders = getOrdersHistory();

  root.innerHTML = `
    <section class="page-banner">
      <div class="container">
        <div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
          <div>
            <h1 class="page-banner__title">${escapeHtml(t(UI_TEXT.kitchen.title, lang))}</h1>
            <p class="page-banner__subtitle">${escapeHtml(t(UI_TEXT.kitchen.subtitle, lang))}</p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button type="button" class="btn btn--outline btn--sm" id="kitchen-create-demo">
              <i class="fa-solid fa-plus"></i>
              <span>${escapeHtml(t(UI_TEXT.kitchen.createDemoBtn, lang))}</span>
            </button>
            <a href="/track" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--sm">
              <i class="fa-solid fa-up-right-from-square"></i>
              <span>${escapeHtml(t(UI_TEXT.kitchen.openCustomerTrack, lang))}</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${
          orders.length === 0
            ? `
          <div class="empty-state">
            <div class="empty-state__icon"><i class="fa-solid fa-fire-burner"></i></div>
            <h2>${escapeHtml(t(UI_TEXT.kitchen.emptyTitle, lang))}</h2>
            <p style="color: var(--color-text-muted); max-width: 520px; margin: 0 auto 22px;">
              ${escapeHtml(t(UI_TEXT.kitchen.emptyDesc, lang))}
            </p>
            <button type="button" class="btn btn--primary btn--lg" id="kitchen-empty-demo">
              ${escapeHtml(t(UI_TEXT.kitchen.createDemoBtn, lang))}
            </button>
          </div>
        `
            : `
          <div class="saved-list" style="gap: 22px;">
            ${orders
              .map((order) => {
                const progress = Math.max(0, Math.min(100, Number(order.trackingProgress ?? 15)));
                const stageIdx = getOrderStageIndex(progress);
                const isPaused = Boolean(order.paused);
                const itemsSummary = (order.items || [])
                  .map((it) => `${it.quantity}× ${t(it.name, lang)}`)
                  .join(' · ');

                return `
                  <article class="panel">
                    <div class="track-progress-header" style="margin-bottom: 12px;">
                      <div>
                        <div class="saved-item__meta" style="margin-bottom: 4px;">
                          <strong class="tabular-nums" dir="ltr" style="font-size: 1.1rem; color: var(--color-primary);">${escapeHtml(order.orderNumber)}</strong>
                          <span>· ${escapeHtml(order.customer?.fullName || '')}</span>
                          <span dir="ltr">· ${escapeHtml(order.customer?.phone || '')}</span>
                          <span>· ${escapeHtml(formatPrice(order.total || 0, lang))}</span>
                          ${isPaused ? `<span>· <strong>${escapeHtml(t(UI_TEXT.kitchen.pausedBadge, lang))}</strong></span>` : ''}
                        </div>
                        <div style="font-size: 0.9rem; color: var(--color-text-muted);">
                          ${escapeHtml(itemsSummary)}
                        </div>
                      </div>
                      <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                        <span class="track-progress-percent tabular-nums" style="font-size: 1.5rem;">${progress}%</span>
                        <a href="/track?order=${encodeURIComponent(order.orderNumber)}" target="_blank" rel="noopener noreferrer" class="btn btn--outline btn--sm">
                          ${escapeHtml(t(UI_TEXT.kitchen.openCustomerTrack, lang))}
                        </a>
                      </div>
                    </div>

                    <div class="track-progress-bar" style="margin-bottom: 18px;">
                      <div class="track-progress-fill" style="width: ${progress}%;"></div>
                    </div>

                    <div class="track-steps" style="margin-bottom: 16px;">
                      ${UI_TEXT.track.stages
                        .map((stage, idx) => {
                          const targetPct = STAGE_PROGRESS_VALUES[idx];
                          const isDone = progress >= 100 || idx < stageIdx;
                          const isCurrent = !isDone && idx === stageIdx;
                          return `
                            <button
                              type="button"
                              class="track-step js-set-stage ${isDone ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''}"
                              data-order="${escapeHtml(order.orderNumber)}"
                              data-progress="${targetPct}"
                              style="text-align: start; width: 100%;"
                            >
                              <div class="track-step__icon" aria-hidden="true">
                                <i class="${isDone ? 'fa-solid fa-check' : 'fa-solid fa-utensils'}"></i>
                              </div>
                              <div>
                                <h3 class="track-step__title">${escapeHtml(t(UI_TEXT.kitchen.confirmStagePrefix, lang))} ${escapeHtml(t(stage.title, lang))}</h3>
                                <p class="track-step__desc">${escapeHtml(t(stage.desc, lang))}</p>
                              </div>
                            </button>
                          `;
                        })
                        .join('')}
                    </div>

                    <div class="track-controls">
                      <button type="button" class="btn btn--primary btn--sm js-admin-advance" data-order="${escapeHtml(order.orderNumber)}" ${progress >= 100 ? 'disabled' : ''}>
                        <i class="fa-solid fa-forward-step"></i>
                        <span>${escapeHtml(t(UI_TEXT.track.advanceBtn, lang))}</span>
                      </button>
                      <button type="button" class="btn btn--outline btn--sm js-admin-pause" data-order="${escapeHtml(order.orderNumber)}" ${progress >= 100 ? 'disabled' : ''}>
                        <i class="fa-solid ${isPaused ? 'fa-play' : 'fa-pause'}"></i>
                        <span>${escapeHtml(t(isPaused ? UI_TEXT.track.resumeBtn : UI_TEXT.track.pauseBtn, lang))}</span>
                      </button>
                      <button type="button" class="btn btn--ghost btn--sm js-admin-reset" data-order="${escapeHtml(order.orderNumber)}">
                        <i class="fa-solid fa-rotate-right"></i>
                        <span>${escapeHtml(t(UI_TEXT.track.resetBtn, lang))}</span>
                      </button>
                    </div>
                  </article>
                `;
              })
              .join('')}
          </div>
        `
        }
      </div>
    </section>
  `;

  document.getElementById('kitchen-create-demo')?.addEventListener('click', () => {
    createDemoOrderReceipt();
    renderKitchenPage();
  });

  document.getElementById('kitchen-empty-demo')?.addEventListener('click', () => {
    createDemoOrderReceipt();
    renderKitchenPage();
  });

  root.querySelectorAll('.js-set-stage').forEach((btn) => {
    btn.addEventListener('click', () => {
      const orderNumber = btn.getAttribute('data-order');
      const nextProgress = Number(btn.getAttribute('data-progress'));
      updateOrderByNumber(orderNumber, { trackingProgress: nextProgress });
      const stageIdx = getOrderStageIndex(nextProgress);
      showToast(`${orderNumber} · ${t(UI_TEXT.track.stages[stageIdx]?.title, lang)}`, false);
      renderKitchenPage();
    });
  });

  root.querySelectorAll('.js-admin-advance').forEach((btn) => {
    btn.addEventListener('click', () => {
      const orderNumber = btn.getAttribute('data-order');
      const currOrder = getOrdersHistory().find((o) => o.orderNumber === orderNumber);
      const curr = Number(currOrder?.trackingProgress ?? 15);
      const nextVal = STAGE_PROGRESS_VALUES.find((v) => v > curr) ?? 100;
      updateOrderByNumber(orderNumber, { trackingProgress: nextVal });
      renderKitchenPage();
    });
  });

  root.querySelectorAll('.js-admin-pause').forEach((btn) => {
    btn.addEventListener('click', () => {
      const orderNumber = btn.getAttribute('data-order');
      const currOrder = getOrdersHistory().find((o) => o.orderNumber === orderNumber);
      updateOrderByNumber(orderNumber, { paused: !currOrder?.paused });
      renderKitchenPage();
    });
  });

  root.querySelectorAll('.js-admin-reset').forEach((btn) => {
    btn.addEventListener('click', () => {
      const orderNumber = btn.getAttribute('data-order');
      updateOrderByNumber(orderNumber, { trackingProgress: 15, paused: false });
      renderKitchenPage();
    });
  });

  startAutoTimerIfNeeded();
}

function mountPage() {
  renderKitchenPage();
  unsubscribeOrderUpdates = subscribeOrderUpdates(() => renderKitchenPage());
}

let unsubscribeOrderUpdates = null;

function unmountPage() {
  stopAutoTimer();
  unsubscribeOrderUpdates?.();
  unsubscribeOrderUpdates = null;
}

usePageLocale(renderKitchenPage);
onMounted(mountPage);
onBeforeUnmount(unmountPage);
</script>

<template>
  <main id="kitchen-root"></main>
</template>
