import { UI_TEXT } from '../data.js';
import {
  getLastOrderReceipt,
  getOrderByNumber,
  getOrdersHistory,
  getOrderStageIndex,
  subscribeOrderUpdates,
} from '../cart.js';
import { formatPrice, getLang, t } from '../i18n.js';
import { bind3DTilt, escapeHtml, initAppShell, showToast } from '../ui.js';

const STAGE_ICONS = [
  'fa-solid fa-check',
  'fa-solid fa-fire-burner',
  'fa-solid fa-motorcycle',
  'fa-solid fa-box-open',
];

const params = new URLSearchParams(window.location.search);
let selectedOrderNumber = params.get('order') || '';
let lookupMessage = '';
let lastRenderedSignature = '';

function getRemainingMinutes(progress) {
  if (progress >= 100) return 0;
  return Math.max(1, Math.round(((100 - progress) / 100) * 40));
}

function resolveActiveOrder() {
  if (selectedOrderNumber) {
    const exact = getOrderByNumber(selectedOrderNumber);
    if (exact) return exact;
  }
  return getOrdersHistory()[0] || getLastOrderReceipt();
}

function updateTrackerUIOnly(progress, lang) {
  const fill = document.getElementById('track-progress-fill');
  const bar = document.getElementById('track-progress-bar');
  const pctEl = document.getElementById('track-progress-percent');
  const etaEl = document.getElementById('track-progress-eta');
  const stepEls = document.querySelectorAll('.track-step');

  if (fill) fill.style.width = `${progress}%`;
  if (bar) bar.setAttribute('aria-valuenow', String(progress));
  if (pctEl) pctEl.textContent = `${progress}%`;

  if (etaEl) {
    const mins = getRemainingMinutes(progress);
    etaEl.textContent =
      progress >= 100
        ? t(UI_TEXT.track.arrivedText, lang)
        : `${t(UI_TEXT.track.etaLabel, lang)}: ~${mins} ${t(UI_TEXT.track.minutesUnit, lang)}`;
  }

  const currentIdx = getOrderStageIndex(progress);
  stepEls.forEach((el, idx) => {
    el.classList.remove('is-done', 'is-current');
    if (progress >= 100 || idx < currentIdx) {
      el.classList.add('is-done');
    } else if (idx === currentIdx) {
      el.classList.add('is-current');
    }

    const icon = el.querySelector('.track-step__icon i');
    if (icon) {
      icon.className = progress >= 100 || idx < currentIdx ? 'fa-solid fa-check' : STAGE_ICONS[idx];
    }
  });
}

function renderTrackPage() {
  const lang = getLang();
  const root = document.getElementById('track-root');
  if (!root) return;

  const order = resolveActiveOrder();

  if (!order) {
    lastRenderedSignature = 'empty';
    root.innerHTML = `
      <section class="page-banner">
        <div class="container">
          <h1 class="page-banner__title">${escapeHtml(t(UI_TEXT.track.title, lang))}</h1>
          <p class="page-banner__subtitle">${escapeHtml(t(UI_TEXT.track.subtitle, lang))}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="empty-state">
            <div class="empty-state__icon"><i class="fa-solid fa-motorcycle"></i></div>
            <h2>${escapeHtml(t(UI_TEXT.track.emptyTitle, lang))}</h2>
            <p style="color: var(--color-text-muted); max-width: 520px; margin: 0 auto 22px;">
              ${escapeHtml(t(UI_TEXT.track.emptyDesc, lang))}
            </p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
              <a href="/menu.html" class="btn btn--primary btn--lg">
                ${escapeHtml(t(UI_TEXT.cart.browseMenu, lang))}
              </a>
              <a href="/account.html" class="btn btn--outline btn--lg">
                ${escapeHtml(t(UI_TEXT.account.myOrdersTitle, lang))}
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
    return;
  }

  const progress = Math.max(0, Math.min(100, Number(order.trackingProgress ?? 15)));
  const currentStage = getOrderStageIndex(progress);
  const minsRemaining = getRemainingMinutes(progress);
  lastRenderedSignature = `${order.orderNumber}:${progress}:${order.updatedAt || ''}`;

  root.innerHTML = `
    <section class="page-banner">
      <div class="container">
        <h1 class="page-banner__title">${escapeHtml(t(UI_TEXT.track.title, lang))}</h1>
        <p class="page-banner__subtitle">${escapeHtml(t(UI_TEXT.track.subtitle, lang))}</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="confirmed-banner" role="status">
          <div class="confirmed-banner__icon" aria-hidden="true">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <h2 class="confirmed-banner__title">${escapeHtml(t(UI_TEXT.track.confirmedBannerTitle, lang))}</h2>
            <p class="confirmed-banner__desc">${escapeHtml(t(UI_TEXT.track.confirmedBannerDesc, lang))}</p>
          </div>
        </div>

        <form class="track-lookup" id="track-lookup-form">
          <input
            type="text"
            id="track-lookup-input"
            value="${escapeHtml(selectedOrderNumber)}"
            placeholder="${escapeHtml(t(UI_TEXT.track.lookupPlaceholder, lang))}"
            aria-label="${escapeHtml(t(UI_TEXT.track.lookupPlaceholder, lang))}"
          />
          <button type="submit" class="btn btn--outline">${escapeHtml(t(UI_TEXT.track.lookupBtn, lang))}</button>
        </form>
        ${
          lookupMessage
            ? `<p style="color: var(--color-secondary); font-size: 0.9rem; margin: -12px 0 20px;">${escapeHtml(lookupMessage)}</p>`
            : ''
        }

        <div class="track-layout">
          <div class="panel">
            <div class="track-progress-header">
              <div>
                <p class="section-kicker" style="margin-bottom: 4px;">
                  ${escapeHtml(t(UI_TEXT.checkout.orderRef, lang))}: <strong class="tabular-nums" dir="ltr">${escapeHtml(order.orderNumber)}</strong>
                </p>
                <div class="track-progress-eta" id="track-progress-eta">
                  ${
                    progress >= 100
                      ? escapeHtml(t(UI_TEXT.track.arrivedText, lang))
                      : `${escapeHtml(t(UI_TEXT.track.etaLabel, lang))}: <span class="tabular-nums">~${minsRemaining}</span> ${escapeHtml(t(UI_TEXT.track.minutesUnit, lang))}`
                  }
                </div>
              </div>
              <div class="track-progress-percent tabular-nums" id="track-progress-percent">${progress}%</div>
            </div>

            <div
              class="track-progress-bar"
              id="track-progress-bar"
              role="progressbar"
              aria-label="${escapeHtml(t(UI_TEXT.track.progressLabel, lang))}"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow="${progress}"
            >
              <div class="track-progress-fill" id="track-progress-fill" style="width: ${progress}%;"></div>
            </div>

            <div class="track-steps">
              ${UI_TEXT.track.stages
                .map((stage, idx) => {
                  const isDone = progress >= 100 || idx < currentStage;
                  const isCurrent = !isDone && idx === currentStage;
                  return `
                    <article class="track-step ${isDone ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''}">
                      <div class="track-step__icon" aria-hidden="true">
                        <i class="${isDone ? 'fa-solid fa-check' : STAGE_ICONS[idx]}"></i>
                      </div>
                      <div>
                        <h3 class="track-step__title">${escapeHtml(t(stage.title, lang))}</h3>
                        <p class="track-step__desc">${escapeHtml(t(stage.desc, lang))}</p>
                      </div>
                    </article>
                  `;
                })
                .join('')}
            </div>

            <div class="track-controls" style="justify-content: space-between;">
              <span style="font-size: 0.88rem; color: var(--color-text-muted);">
                ${escapeHtml(t(UI_TEXT.track.liveUpdateNote, lang))}
              </span>
              <a href="/account.html" style="font-size: 0.88rem; font-weight: 700; color: var(--color-primary); text-decoration: underline;">
                ${escapeHtml(t(UI_TEXT.account.myOrdersTitle, lang))}
              </a>
            </div>
          </div>

          <aside class="panel tilt-3d">
            <h2 class="section-title" style="font-size: 1.4rem; margin-bottom: 14px;">
              ${escapeHtml(t(UI_TEXT.checkout.orderSummary, lang))}
            </h2>
            <div style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--color-border);">
              <div><strong style="color: var(--color-primary);">${escapeHtml(order.customer.fullName)}</strong></div>
              <div dir="ltr" style="margin-top: 2px;">${escapeHtml(order.customer.phone)}</div>
              <div style="margin-top: 4px;">${escapeHtml(t(order.customer.district, lang))} — ${escapeHtml(order.customer.address)}</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid var(--color-border);">
              ${order.items
                .map(
                  (item) => `
                <div style="display: flex; justify-content: space-between; gap: 12px; font-size: 0.92rem;">
                  <span><strong class="tabular-nums">${item.quantity}×</strong> ${escapeHtml(t(item.name, lang))} ${item.size ? `(${escapeHtml(t(item.size, lang))})` : ''}</span>
                  <span class="tabular-nums" style="font-weight: 600; white-space: nowrap;">${escapeHtml(formatPrice(item.lineTotal, lang))}</span>
                </div>
              `
                )
                .join('')}
            </div>

            <div class="summary-rows" style="margin-bottom: 0;">
              <div class="summary-row">
                <span>${escapeHtml(t(UI_TEXT.cart.subtotal, lang))}</span>
                <span class="tabular-nums">${escapeHtml(formatPrice(order.subtotal, lang))}</span>
              </div>
              <div class="summary-row">
                <span>${escapeHtml(t(UI_TEXT.cart.deliveryFee, lang))}</span>
                <span class="tabular-nums">${order.deliveryFee === 0 ? escapeHtml(t(UI_TEXT.cart.freeDelivery, lang)) : escapeHtml(formatPrice(order.deliveryFee, lang))}</span>
              </div>
              <div class="summary-row summary-row--total">
                <span>${escapeHtml(t(UI_TEXT.cart.total, lang))}</span>
                <span class="tabular-nums">${escapeHtml(formatPrice(order.total, lang))}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  `;

  document.getElementById('track-lookup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = document.getElementById('track-lookup-input').value.trim().toUpperCase();
    if (!val) return;
    const matched = getOrderByNumber(val);
    if (matched) {
      selectedOrderNumber = matched.orderNumber;
      lookupMessage = '';
      const url = new URL(window.location.href);
      url.searchParams.set('order', matched.orderNumber);
      window.history.replaceState({}, '', url);
    } else {
      lookupMessage = t(UI_TEXT.track.lookupNotFound, lang);
    }
    renderTrackPage();
  });

  bind3DTilt(root);
}

function syncOrderFromKitchen() {
  const order = resolveActiveOrder();
  if (!order) {
    if (lastRenderedSignature !== 'empty') {
      renderTrackPage();
    }
    return;
  }

  const progress = Math.max(0, Math.min(100, Number(order.trackingProgress ?? 15)));
  const sig = `${order.orderNumber}:${progress}:${order.updatedAt || ''}`;
  if (sig === lastRenderedSignature) return;

  const prevProgress = Number(lastRenderedSignature.split(':')[1] ?? progress);
  const prevOrder = lastRenderedSignature.split(':')[0];

  if (prevOrder !== order.orderNumber) {
    renderTrackPage();
    return;
  }

  lastRenderedSignature = sig;
  const lang = getLang();
  updateTrackerUIOnly(progress, lang);

  const prevStage = getOrderStageIndex(prevProgress);
  const nextStage = getOrderStageIndex(progress);
  if (nextStage !== prevStage && UI_TEXT.track.stages[nextStage]) {
    showToast(`${t(UI_TEXT.track.stageToastPrefix, lang)} ${t(UI_TEXT.track.stages[nextStage].title, lang)}`, false);
  }
}

initAppShell('track', renderTrackPage);
renderTrackPage();
subscribeOrderUpdates(syncOrderFromKitchen);
setInterval(syncOrderFromKitchen, 1200);
