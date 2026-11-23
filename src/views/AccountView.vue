<script setup>
import { onBeforeUnmount, onMounted } from 'vue';
import { usePageLocale } from '../composables/usePageLocale.js';
import { DELIVERY_DISTRICTS, UI_TEXT } from '../js/data.js';
import {
  deleteAddress,
  deletePhone,
  getAccountData,
  getLastOrderReceipt,
  getOrdersHistory,
  getOrderStageIndex,
  saveAccountData,
  saveAccountPreferences,
  setDefaultAddress,
  setDefaultPhone,
  subscribeOrderUpdates,
  upsertAddress,
  upsertPhone,
} from '../js/cart.js';
import { formatPrice, getLang, t } from '../js/i18n.js';
import { bind3DTilt, escapeHtml } from '../js/ui.js';

let editingAddressId = null;

function notifySaved(lang) {
  const container = document.getElementById('toast-container') || (() => {
    const el = document.createElement('div');
    el.id = 'toast-container';
    el.className = 'toast-container';
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
    return el;
  })();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span><i class="fa-solid fa-circle-check"></i> ${escapeHtml(t(UI_TEXT.account.savedToast, lang))}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 220);
  }, 2400);
}

function renderAccountPage() {
  const lang = getLang();
  const root = document.getElementById('account-root');
  if (!root) return;

  const account = getAccountData();
  const orders = getOrdersHistory();
  const recentOrder = orders[0] || getLastOrderReceipt();
  const editingAddr = editingAddressId
    ? account.addresses.find((a) => a.id === editingAddressId) || null
    : null;

  const formatOrderDate = (iso) => {
    if (!iso) return '';
    try {
      return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(iso));
    } catch {
      return '';
    }
  };

  root.innerHTML = `
    <section class="page-banner">
      <div class="container">
        <h1 class="page-banner__title">${escapeHtml(t(UI_TEXT.account.title, lang))}</h1>
        <p class="page-banner__subtitle">${escapeHtml(t(UI_TEXT.account.subtitle, lang))}</p>
      </div>
    </section>

    <section class="section">
      <div class="container account-layout">
        <div class="account-main">
          <!-- My Orders -->
          <section class="panel" aria-labelledby="my-orders-heading">
            <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 14px;">
              <div>
                <h2 class="section-title" id="my-orders-heading" style="font-size: 1.4rem; margin: 0 0 4px;">
                  ${escapeHtml(t(UI_TEXT.account.myOrdersTitle, lang))}
                </h2>
                <p style="margin: 0; font-size: 0.88rem; color: var(--color-text-muted);">
                  ${escapeHtml(t(UI_TEXT.account.myOrdersSubtitle, lang))}
                </p>
              </div>
              <a href="/menu" class="btn btn--outline btn--sm">
                ${escapeHtml(t(UI_TEXT.nav.orderNow, lang))}
              </a>
            </div>

            ${
              orders.length === 0
                ? `<p style="color: var(--color-text-muted); margin: 0; font-size: 0.92rem;">${escapeHtml(t(UI_TEXT.account.noOrders, lang))}</p>`
                : `
              <div class="saved-list">
                ${orders
                  .map((ord) => {
                    const progress = Math.max(0, Math.min(100, Number(ord.trackingProgress ?? 15)));
                    const stageIdx = getOrderStageIndex(progress);
                    const stageTitle = t(UI_TEXT.track.stages[stageIdx]?.title, lang);
                    const isDelivered = progress >= 100;
                    const itemsText = (ord.items || [])
                      .map((it) => `${it.quantity}× ${t(it.name, lang)}`)
                      .join(' · ');

                    return `
                      <article class="saved-item ${isDelivered ? '' : 'is-default'}">
                        <div>
                          <div class="saved-item__meta">
                            <strong class="tabular-nums" dir="ltr" style="color: var(--color-primary);">${escapeHtml(ord.orderNumber)}</strong>
                            ${ord.createdAt ? `<span>· ${escapeHtml(formatOrderDate(ord.createdAt))}</span>` : ''}
                            <span>· <strong style="color: ${isDelivered ? 'var(--color-success)' : 'var(--color-primary)'};">${escapeHtml(stageTitle)}</strong></span>
                          </div>
                          ${
                            itemsText
                              ? `<div style="font-size: 0.9rem; color: var(--color-text); margin-top: 4px;">${escapeHtml(itemsText)}</div>`
                              : ''
                          }
                          <div style="font-size: 0.88rem; color: var(--color-text-muted); margin-top: 4px;">
                            ${escapeHtml(t(UI_TEXT.account.orderTotalLabel, lang))}: <strong class="tabular-nums" style="color: var(--color-primary);">${escapeHtml(formatPrice(ord.total || 0, lang))}</strong>
                          </div>
                        </div>
                        <div class="saved-item__actions">
                          <a href="/track?order=${encodeURIComponent(ord.orderNumber)}" class="btn btn--outline btn--sm">
                            ${escapeHtml(t(UI_TEXT.account.trackThisOrder, lang))}
                          </a>
                        </div>
                      </article>
                    `;
                  })
                  .join('')}
              </div>
            `
            }
          </section>

          <!-- Personal Details -->
          <form class="panel" id="account-profile-form" novalidate>
            <h2 class="section-title" style="font-size: 1.4rem; margin-bottom: 16px;">
              ${escapeHtml(t(UI_TEXT.account.profileTitle, lang))}
            </h2>
            <div style="display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap;">
              <div class="field" id="acc-field-name" style="flex: 1 1 200px;">
                <label for="acc-fullName">${escapeHtml(t(UI_TEXT.checkout.fullName, lang))} *</label>
                <input type="text" id="acc-fullName" value="${escapeHtml(account.fullName || '')}" required />
                <span class="field__error">${escapeHtml(t(UI_TEXT.checkout.errors.fullName, lang))}</span>
              </div>
              <button type="submit" class="btn btn--primary" style="min-height: 44px;">
                ${escapeHtml(t(UI_TEXT.account.saveProfileBtn, lang))}
              </button>
            </div>
          </form>

          <!-- Saved Phone Numbers -->
          <div class="panel">
            <h2 class="section-title" style="font-size: 1.4rem; margin-bottom: 16px;">
              ${escapeHtml(t(UI_TEXT.account.phonesTitle, lang))}
            </h2>

            ${
              account.phones.length === 0
                ? `<p style="color: var(--color-text-muted); margin: 0 0 16px; font-size: 0.92rem;">${escapeHtml(t(UI_TEXT.account.noPhones, lang))}</p>`
                : `
              <div class="saved-list">
                ${account.phones
                  .map(
                    (ph) => `
                  <article class="saved-item ${ph.isDefault ? 'is-default' : ''}">
                    <div>
                      <div class="saved-item__meta">
                        <strong>${escapeHtml(ph.label)}</strong>
                        ${ph.isDefault ? `<span>· ${escapeHtml(t(UI_TEXT.account.defaultTag, lang))}</span>` : ''}
                      </div>
                      <div class="tabular-nums" dir="ltr" style="font-weight: 700; color: var(--color-primary); margin-top: 2px;">
                        ${escapeHtml(ph.number)}
                      </div>
                    </div>
                    <div class="saved-item__actions">
                      ${
                        !ph.isDefault
                          ? `<button type="button" class="btn btn--outline btn--sm js-default-phone" data-id="${escapeHtml(ph.id)}">${escapeHtml(t(UI_TEXT.account.setDefault, lang))}</button>`
                          : ''
                      }
                      <button type="button" class="remove-btn js-delete-phone" data-id="${escapeHtml(ph.id)}">
                        ${escapeHtml(t(UI_TEXT.account.delete, lang))}
                      </button>
                    </div>
                  </article>
                `
                  )
                  .join('')}
              </div>
            `
            }

            <form id="account-phone-form" class="form-grid form-grid--2" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--color-border);" novalidate>
              <div class="field">
                <label for="ph-label">${escapeHtml(t(UI_TEXT.account.phoneLabelField, lang))}</label>
                <input type="text" id="ph-label" placeholder="${lang === 'ar' ? 'شخصي' : 'Personal'}" />
              </div>
              <div class="field" id="acc-field-phone">
                <label for="ph-number">${escapeHtml(t(UI_TEXT.checkout.phone, lang))} *</label>
                <input type="tel" id="ph-number" placeholder="01012345678" dir="ltr" required />
                <span class="field__error">${escapeHtml(t(UI_TEXT.checkout.errors.phone, lang))}</span>
              </div>
              <div style="grid-column: 1 / -1;">
                <button type="submit" class="btn btn--outline">
                  <i class="fa-solid fa-plus"></i>
                  <span>${escapeHtml(t(UI_TEXT.account.addPhoneBtn, lang))}</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Saved Delivery Addresses -->
          <div class="panel">
            <h2 class="section-title" style="font-size: 1.4rem; margin-bottom: 16px;">
              ${escapeHtml(t(UI_TEXT.account.addressesTitle, lang))}
            </h2>

            ${
              account.addresses.length === 0
                ? `<p style="color: var(--color-text-muted); margin: 0 0 16px; font-size: 0.92rem;">${escapeHtml(t(UI_TEXT.account.noAddresses, lang))}</p>`
                : `
              <div class="saved-list">
                ${account.addresses
                  .map((addr) => {
                    const dist = DELIVERY_DISTRICTS.find((d) => d.id === addr.districtId);
                    const fullAddr = [addr.streetAddress, addr.buildingDetails].filter(Boolean).join(' · ');
                    return `
                      <article class="saved-item ${addr.isDefault ? 'is-default' : ''}">
                        <div>
                          <div class="saved-item__meta">
                            <strong>${escapeHtml(addr.label)}</strong>
                            ${dist ? `<span>· ${escapeHtml(t(dist.name, lang))} (${escapeHtml(formatPrice(dist.fee, lang))})</span>` : ''}
                            ${addr.isDefault ? `<span>· ${escapeHtml(t(UI_TEXT.account.defaultTag, lang))}</span>` : ''}
                          </div>
                          <div style="color: var(--color-primary); font-weight: 600; margin-top: 4px;">
                            ${escapeHtml(fullAddr)}
                          </div>
                          ${
                            addr.notes
                              ? `<div style="font-size: 0.84rem; color: var(--color-text-muted); margin-top: 2px;">${escapeHtml(addr.notes)}</div>`
                              : ''
                          }
                        </div>
                        <div class="saved-item__actions">
                          ${
                            !addr.isDefault
                              ? `<button type="button" class="btn btn--outline btn--sm js-default-addr" data-id="${escapeHtml(addr.id)}">${escapeHtml(t(UI_TEXT.account.setDefault, lang))}</button>`
                              : ''
                          }
                          <button type="button" class="btn btn--ghost btn--sm js-edit-addr" data-id="${escapeHtml(addr.id)}">${escapeHtml(t(UI_TEXT.account.edit, lang))}</button>
                          <button type="button" class="remove-btn js-delete-addr" data-id="${escapeHtml(addr.id)}">${escapeHtml(t(UI_TEXT.account.delete, lang))}</button>
                        </div>
                      </article>
                    `;
                  })
                  .join('')}
              </div>
            `
            }

            <form id="account-address-form" class="form-grid" style="margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--color-border);" novalidate>
              <div class="form-grid form-grid--2">
                <div class="field">
                  <label for="addr-label">${escapeHtml(t(UI_TEXT.account.addressLabelField, lang))}</label>
                  <input type="text" id="addr-label" value="${escapeHtml(editingAddr?.label || '')}" placeholder="${lang === 'ar' ? 'المنزل' : 'Home'}" />
                </div>
                <div class="field" id="acc-field-district">
                  <label for="addr-district">${escapeHtml(t(UI_TEXT.checkout.district, lang))} *</label>
                  <select id="addr-district" required>
                    ${DELIVERY_DISTRICTS.map(
                      (d) => `
                      <option value="${d.id}" ${(editingAddr?.districtId || DELIVERY_DISTRICTS[0].id) === d.id ? 'selected' : ''}>
                        ${escapeHtml(t(d.name, lang))} — ${escapeHtml(formatPrice(d.fee, lang))}
                      </option>
                    `
                    ).join('')}
                  </select>
                </div>
              </div>

              <div class="field" id="acc-field-street">
                <label for="addr-street">${escapeHtml(t(UI_TEXT.checkout.address, lang))} *</label>
                <input type="text" id="addr-street" value="${escapeHtml(editingAddr?.streetAddress || '')}" required />
                <span class="field__error">${escapeHtml(t(UI_TEXT.checkout.errors.address, lang))}</span>
              </div>

              <div class="field">
                <label for="addr-building">${escapeHtml(t(UI_TEXT.delivery.buildingLabel, lang))}</label>
                <input type="text" id="addr-building" value="${escapeHtml(editingAddr?.buildingDetails || '')}" />
              </div>

              <div class="field">
                <label for="addr-notes">${escapeHtml(t(UI_TEXT.delivery.landmarkLabel, lang))}</label>
                <input type="text" id="addr-notes" value="${escapeHtml(editingAddr?.notes || '')}" />
              </div>

              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button type="submit" class="btn btn--primary">
                  ${escapeHtml(editingAddr ? t(UI_TEXT.account.updateAddressBtn, lang) : t(UI_TEXT.account.addAddressBtn, lang))}
                </button>
                ${
                  editingAddr
                    ? `<button type="button" class="btn btn--outline" id="cancel-edit-addr">${escapeHtml(t(UI_TEXT.account.cancelEditBtn, lang))}</button>`
                    : ''
                }
              </div>
            </form>
          </div>
        </div>

        <!-- Sidebar: Default Checkout Preferences & Recent Order -->
        <aside class="account-side">
          <form class="panel tilt-3d" id="account-prefs-form">
            <h2 class="section-title" style="font-size: 1.35rem; margin-bottom: 16px;">
              ${escapeHtml(t(UI_TEXT.account.prefsTitle, lang))}
            </h2>
            <div class="form-grid">
              <div class="field">
                <label for="pref-baking">${escapeHtml(t(UI_TEXT.account.bakingLabel, lang))}</label>
                <select id="pref-baking">
                  ${Object.entries(UI_TEXT.account.bakingOptions)
                    .map(
                      ([val, labelObj]) => `
                    <option value="${val}" ${account.preferences.bakingStyle === val ? 'selected' : ''}>
                      ${escapeHtml(t(labelObj, lang))}
                    </option>
                  `
                    )
                    .join('')}
                </select>
              </div>

              <div class="field">
                <label for="pref-cut">${escapeHtml(t(UI_TEXT.account.cutLabel, lang))}</label>
                <select id="pref-cut">
                  ${Object.entries(UI_TEXT.account.cutOptions)
                    .map(
                      ([val, labelObj]) => `
                    <option value="${val}" ${account.preferences.cutPreference === val ? 'selected' : ''}>
                      ${escapeHtml(t(labelObj, lang))}
                    </option>
                  `
                    )
                    .join('')}
                </select>
              </div>

              <div class="field">
                <label for="pref-arrival">${escapeHtml(t(UI_TEXT.account.arrivalLabel, lang))}</label>
                <select id="pref-arrival">
                  ${Object.entries(UI_TEXT.account.arrivalOptions)
                    .map(
                      ([val, labelObj]) => `
                    <option value="${val}" ${account.preferences.courierArrival === val ? 'selected' : ''}>
                      ${escapeHtml(t(labelObj, lang))}
                    </option>
                  `
                    )
                    .join('')}
                </select>
              </div>

              <div class="field">
                <label for="pref-notes">${escapeHtml(t(UI_TEXT.account.defaultNotesLabel, lang))}</label>
                <textarea id="pref-notes">${escapeHtml(account.preferences.defaultNotes || '')}</textarea>
              </div>

              <button type="submit" class="btn btn--primary btn--full">
                ${escapeHtml(t(UI_TEXT.account.savePrefsBtn, lang))}
              </button>
            </div>
          </form>

          ${
            recentOrder
              ? `
            <div class="panel" style="margin-top: 20px;">
              <h3 class="section-title" style="font-size: 1.2rem; margin-bottom: 10px;">
                ${escapeHtml(t(UI_TEXT.account.recentOrderTitle, lang))}
              </h3>
              <div style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 14px;">
                <div><strong class="tabular-nums" dir="ltr" style="color: var(--color-primary);">${escapeHtml(recentOrder.orderNumber)}</strong> · <span class="tabular-nums">${escapeHtml(formatPrice(recentOrder.total, lang))}</span></div>
                <div style="margin-top: 4px;">${escapeHtml(t(UI_TEXT.track.progressLabel, lang))}: <strong class="tabular-nums">${recentOrder.trackingProgress ?? 12}%</strong></div>
              </div>
              <a href="/track" class="btn btn--outline btn--full">
                ${escapeHtml(t(UI_TEXT.account.trackRecentBtn, lang))}
              </a>
            </div>
          `
              : ''
          }
        </aside>
      </div>
    </section>
  `;

  bind3DTilt(root);

  document.getElementById('account-profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = document.getElementById('acc-fullName').value.trim();
    const hasErr = fullName.length < 3;
    document.getElementById('acc-field-name')?.classList.toggle('has-error', hasErr);
    if (hasErr) return;

    const curr = getAccountData();
    curr.fullName = fullName;
    saveAccountData(curr);
    notifySaved(lang);
  });

  document.getElementById('account-phone-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const label = document.getElementById('ph-label').value.trim() || (lang === 'ar' ? 'شخصي' : 'Personal');
    const number = document.getElementById('ph-number').value.trim();
    const hasErr = !/^01[0125][0-9]{8}$/.test(number);
    document.getElementById('acc-field-phone')?.classList.toggle('has-error', hasErr);
    if (hasErr) return;

    upsertPhone({ label, number });
    notifySaved(lang);
    renderAccountPage();
  });

  root.querySelectorAll('.js-default-phone').forEach((btn) => {
    btn.addEventListener('click', () => {
      setDefaultPhone(btn.getAttribute('data-id'));
      renderAccountPage();
    });
  });

  root.querySelectorAll('.js-delete-phone').forEach((btn) => {
    btn.addEventListener('click', () => {
      deletePhone(btn.getAttribute('data-id'));
      renderAccountPage();
    });
  });

  document.getElementById('account-address-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const label = document.getElementById('addr-label').value.trim() || (lang === 'ar' ? 'المنزل' : 'Home');
    const districtId = document.getElementById('addr-district').value;
    const streetAddress = document.getElementById('addr-street').value.trim();
    const buildingDetails = document.getElementById('addr-building').value.trim();
    const notes = document.getElementById('addr-notes').value.trim();

    const hasErr = streetAddress.length < 5;
    document.getElementById('acc-field-street')?.classList.toggle('has-error', hasErr);
    if (hasErr) return;

    upsertAddress({
      id: editingAddressId,
      label,
      districtId,
      streetAddress,
      buildingDetails,
      notes,
    });
    editingAddressId = null;
    notifySaved(lang);
    renderAccountPage();
  });

  document.getElementById('cancel-edit-addr')?.addEventListener('click', () => {
    editingAddressId = null;
    renderAccountPage();
  });

  root.querySelectorAll('.js-default-addr').forEach((btn) => {
    btn.addEventListener('click', () => {
      setDefaultAddress(btn.getAttribute('data-id'));
      renderAccountPage();
    });
  });

  root.querySelectorAll('.js-edit-addr').forEach((btn) => {
    btn.addEventListener('click', () => {
      editingAddressId = btn.getAttribute('data-id');
      renderAccountPage();
      document.getElementById('account-address-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  root.querySelectorAll('.js-delete-addr').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (editingAddressId === btn.getAttribute('data-id')) {
        editingAddressId = null;
      }
      deleteAddress(btn.getAttribute('data-id'));
      renderAccountPage();
    });
  });

  document.getElementById('account-prefs-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveAccountPreferences({
      bakingStyle: document.getElementById('pref-baking').value,
      cutPreference: document.getElementById('pref-cut').value,
      courierArrival: document.getElementById('pref-arrival').value,
      defaultNotes: document.getElementById('pref-notes').value.trim(),
    });
    notifySaved(lang);
  });
}

function mountPage() {
  renderAccountPage();
  unsubscribeOrderUpdates = subscribeOrderUpdates(() => renderAccountPage());
}
let unsubscribeOrderUpdates = null;

function unmountPage() {
  unsubscribeOrderUpdates?.();
  unsubscribeOrderUpdates = null;
}

usePageLocale(renderAccountPage);
onMounted(mountPage);
onBeforeUnmount(unmountPage);
</script>

<template>
  <main id="account-root"></main>
</template>
