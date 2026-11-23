import { ADDONS, BRAND_CONFIG, DELIVERY_DISTRICTS, PRODUCTS, UI_TEXT } from '../data.js';
import {
  clearCart,
  getAccountData,
  getCartTotals,
  getCustomerProfile,
  saveCustomerProfile,
  saveOrderReceipt,
} from '../cart.js';
import { formatPrice, getLang, t } from '../i18n.js';
import { escapeHtml, initAppShell } from '../ui.js';

const savedProfile = getCustomerProfile();
let selectedDistrictId = savedProfile?.districtId || DELIVERY_DISTRICTS[0].id;

function buildDefaultNotes(account, profile, lang) {
  const parts = [];
  if (profile.notes) parts.push(profile.notes);
  const prefs = account.preferences;
  if (prefs) {
    if (prefs.bakingStyle && prefs.bakingStyle !== 'standard') {
      parts.push(t(UI_TEXT.account.bakingOptions[prefs.bakingStyle], lang));
    }
    if (prefs.cutPreference) {
      parts.push(t(UI_TEXT.account.cutOptions[prefs.cutPreference], lang));
    }
    if (prefs.courierArrival) {
      parts.push(t(UI_TEXT.account.arrivalOptions[prefs.courierArrival], lang));
    }
    if (prefs.defaultNotes && !parts.includes(prefs.defaultNotes)) {
      parts.push(prefs.defaultNotes);
    }
  }
  return parts.join(' · ');
}

function renderCheckoutPage() {
  const lang = getLang();
  const root = document.getElementById('checkout-root');
  if (!root) return;

  const account = getAccountData();
  const profile = getCustomerProfile() || {};
  const districtObj = DELIVERY_DISTRICTS.find((d) => d.id === selectedDistrictId) || DELIVERY_DISTRICTS[0];
  const totals = getCartTotals(districtObj ? districtObj.fee : BRAND_CONFIG.baseDeliveryFee);

  if (totals.items.length === 0) {
    root.innerHTML = `
      <section class="page-banner">
        <div class="container">
          <h1 class="page-banner__title">${escapeHtml(t(UI_TEXT.checkout.title, lang))}</h1>
          <p class="page-banner__subtitle">${escapeHtml(t(UI_TEXT.checkout.subtitle, lang))}</p>
        </div>
      </section>
      <section class="section">
        <div class="container">
          <div class="empty-state">
            <div class="empty-state__icon"><i class="fa-solid fa-bag-shopping"></i></div>
            <h2>${escapeHtml(t(UI_TEXT.cart.emptyTitle, lang))}</h2>
            <p style="color: var(--color-text-muted); margin-bottom: 20px;">${escapeHtml(t(UI_TEXT.cart.emptyDesc, lang))}</p>
            <a href="/menu.html" class="btn btn--primary btn--lg">${escapeHtml(t(UI_TEXT.cart.browseMenu, lang))}</a>
          </div>
        </div>
      </section>
    `;
    return;
  }

  const combinedAddress = [profile.streetAddress, profile.buildingDetails].filter(Boolean).join(' · ');
  const initialNotes = buildDefaultNotes(account, profile, lang);

  root.innerHTML = `
    <section class="page-banner">
      <div class="container">
        <h1 class="page-banner__title">${escapeHtml(t(UI_TEXT.checkout.title, lang))}</h1>
        <p class="page-banner__subtitle">${escapeHtml(t(UI_TEXT.checkout.subtitle, lang))}</p>
      </div>
    </section>

    <section class="section">
      <div class="container checkout-layout">
        <form class="panel" id="checkout-form" novalidate>
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 18px;">
            <h2 class="section-title" style="font-size: 1.5rem; margin: 0;">
              ${escapeHtml(t(UI_TEXT.checkout.customerDetails, lang))}
            </h2>
            <a href="/account.html" style="font-size: 0.86rem; font-weight: 600; color: var(--color-secondary); text-decoration: underline;">
              ${escapeHtml(t(UI_TEXT.checkout.editDetails, lang))}
            </a>
          </div>

          ${
            profile.fullName
              ? `<p style="margin: 0 0 16px; padding: 10px 14px; border-radius: var(--radius-sm); background-color: var(--color-success-bg); color: var(--color-success); font-size: 0.88rem; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> ${escapeHtml(t(UI_TEXT.checkout.savedNotice, lang))}</p>`
              : ''
          }

          ${
            account.addresses.length > 1 || account.phones.length > 1
              ? `
            <div class="form-grid form-grid--2" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--color-border);">
              ${
                account.addresses.length > 1
                  ? `
                <div class="field">
                  <label for="saved-addr-picker">${escapeHtml(t(UI_TEXT.checkout.savedAddressPick, lang))}</label>
                  <select id="saved-addr-picker">
                    ${account.addresses
                      .map(
                        (a) => `
                      <option value="${escapeHtml(a.id)}" ${a.isDefault ? 'selected' : ''}>
                        ${escapeHtml(a.label)} — ${escapeHtml(a.streetAddress)}
                      </option>
                    `
                      )
                      .join('')}
                  </select>
                </div>
              `
                  : ''
              }
              ${
                account.phones.length > 1
                  ? `
                <div class="field">
                  <label for="saved-phone-picker">${escapeHtml(t(UI_TEXT.checkout.savedPhonePick, lang))}</label>
                  <select id="saved-phone-picker">
                    ${account.phones
                      .map(
                        (p) => `
                      <option value="${escapeHtml(p.id)}" ${p.isDefault ? 'selected' : ''}>
                        ${escapeHtml(p.label)} (${escapeHtml(p.number)})
                      </option>
                    `
                      )
                      .join('')}
                  </select>
                </div>
              `
                  : ''
              }
            </div>
          `
              : ''
          }

          <div class="form-grid form-grid--2">
            <div class="field" id="field-fullName">
              <label for="input-fullName">${escapeHtml(t(UI_TEXT.checkout.fullName, lang))} *</label>
              <input type="text" id="input-fullName" name="fullName" value="${escapeHtml(profile.fullName || '')}" required autocomplete="name" />
              <span class="field__error">${escapeHtml(t(UI_TEXT.checkout.errors.fullName, lang))}</span>
            </div>

            <div class="field" id="field-phone">
              <label for="input-phone">${escapeHtml(t(UI_TEXT.checkout.phone, lang))} *</label>
              <input type="tel" id="input-phone" name="phone" value="${escapeHtml(profile.phone || '')}" required placeholder="01012345678" dir="ltr" autocomplete="tel" />
              <span class="field__error">${escapeHtml(t(UI_TEXT.checkout.errors.phone, lang))}</span>
            </div>
          </div>

          <div class="form-grid" style="margin-top: 16px;">
            <div class="field" id="field-district">
              <label for="input-district">${escapeHtml(t(UI_TEXT.checkout.district, lang))} *</label>
              <select id="input-district" name="district" required>
                <option value="">${escapeHtml(t(UI_TEXT.checkout.selectDistrict, lang))}</option>
                ${DELIVERY_DISTRICTS.map(
                  (d) => `
                  <option value="${d.id}" ${d.id === selectedDistrictId ? 'selected' : ''}>
                    ${escapeHtml(t(d.name, lang))} — ${escapeHtml(formatPrice(d.fee, lang))}
                  </option>
                `
                ).join('')}
              </select>
              <span class="field__error">${escapeHtml(t(UI_TEXT.checkout.errors.district, lang))}</span>
            </div>

            <div class="field" id="field-address">
              <label for="input-address">${escapeHtml(t(UI_TEXT.checkout.address, lang))} *</label>
              <input type="text" id="input-address" name="address" value="${escapeHtml(combinedAddress)}" required autocomplete="street-address" />
              <span class="field__error">${escapeHtml(t(UI_TEXT.checkout.errors.address, lang))}</span>
            </div>

            <div class="field">
              <label for="input-notes">${escapeHtml(t(UI_TEXT.checkout.notes, lang))}</label>
              <textarea id="input-notes" name="notes">${escapeHtml(initialNotes)}</textarea>
            </div>
          </div>

          <div style="margin-top: 24px;">
            <span class="pdp-group-label">${escapeHtml(t(UI_TEXT.checkout.paymentMethod, lang))}</span>
            <div class="payment-option">
              <div>
                <strong style="display: block; color: var(--color-primary);">${escapeHtml(t(UI_TEXT.checkout.codLabel, lang))}</strong>
                <span style="font-size: 0.85rem; color: var(--color-text-muted);">${escapeHtml(t(UI_TEXT.checkout.codHint, lang))}</span>
              </div>
              <i class="fa-solid fa-money-bill-wave fa-lg" style="color: var(--color-primary);"></i>
            </div>
          </div>

          <button type="submit" class="btn btn--primary btn--lg btn--full">
            ${escapeHtml(t(UI_TEXT.checkout.trackOrderBtn, lang))} · <span id="checkout-btn-total" class="tabular-nums">${escapeHtml(formatPrice(totals.total, lang))}</span>
          </button>
        </form>

        <aside class="panel">
          <h2 class="section-title" style="font-size: 1.4rem; margin-bottom: 18px;">
            ${escapeHtml(t(UI_TEXT.checkout.orderSummary, lang))}
          </h2>

          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 18px; padding-bottom: 16px; border-bottom: 1px solid var(--color-border);">
            ${totals.items
              .map((item) => {
                const product = PRODUCTS.find((p) => p.id === item.productId);
                if (!product) return '';
                const sizeObj = product.sizes?.find((s) => s.id === item.sizeId);
                const addonNames = (item.addonIds || []).map((id) => t(ADDONS[id]?.name, lang)).filter(Boolean);
                const subline = [sizeObj ? t(sizeObj.label, lang) : '', ...addonNames].filter(Boolean).join(' · ');

                return `
                  <div style="display: flex; justify-content: space-between; gap: 12px; font-size: 0.92rem;">
                    <div>
                      <strong class="tabular-nums">${item.quantity}×</strong> ${escapeHtml(t(product.name, lang))}
                      ${subline ? `<div style="font-size: 0.8rem; color: var(--color-text-muted);">${escapeHtml(subline)}</div>` : ''}
                    </div>
                    <span class="tabular-nums" style="white-space: nowrap; font-weight: 600;">
                      ${escapeHtml(formatPrice(item.unitPrice * item.quantity, lang))}
                    </span>
                  </div>
                `;
              })
              .join('')}
          </div>

          <div class="summary-rows" style="margin-bottom: 0;">
            <div class="summary-row">
              <span>${escapeHtml(t(UI_TEXT.cart.subtotal, lang))}</span>
              <span class="tabular-nums">${escapeHtml(formatPrice(totals.subtotal, lang))}</span>
            </div>
            <div class="summary-row">
              <span>${escapeHtml(t(UI_TEXT.cart.deliveryFee, lang))}</span>
              <span class="tabular-nums" id="summary-delivery-fee">
                ${totals.isFreeDelivery ? escapeHtml(t(UI_TEXT.cart.freeDelivery, lang)) : escapeHtml(formatPrice(totals.deliveryFee, lang))}
              </span>
            </div>
            <div class="summary-row summary-row--total">
              <span>${escapeHtml(t(UI_TEXT.cart.total, lang))}</span>
              <span class="tabular-nums" id="summary-final-total">${escapeHtml(formatPrice(totals.total, lang))}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  `;

  const districtSelect = document.getElementById('input-district');
  const updateFeeTotals = () => {
    selectedDistrictId = districtSelect.value || DELIVERY_DISTRICTS[0].id;
    const dist = DELIVERY_DISTRICTS.find((d) => d.id === selectedDistrictId);
    const updated = getCartTotals(dist ? dist.fee : BRAND_CONFIG.baseDeliveryFee);
    const feeEl = document.getElementById('summary-delivery-fee');
    const totalEl = document.getElementById('summary-final-total');
    const btnTotalEl = document.getElementById('checkout-btn-total');
    if (feeEl) feeEl.textContent = updated.isFreeDelivery ? t(UI_TEXT.cart.freeDelivery, lang) : formatPrice(updated.deliveryFee, lang);
    if (totalEl) totalEl.textContent = formatPrice(updated.total, lang);
    if (btnTotalEl) btnTotalEl.textContent = formatPrice(updated.total, lang);
  };

  districtSelect?.addEventListener('change', updateFeeTotals);

  document.getElementById('saved-addr-picker')?.addEventListener('change', (e) => {
    const chosen = account.addresses.find((a) => a.id === e.target.value);
    if (!chosen) return;
    if (districtSelect) {
      districtSelect.value = chosen.districtId;
      updateFeeTotals();
    }
    const addrInput = document.getElementById('input-address');
    if (addrInput) {
      addrInput.value = [chosen.streetAddress, chosen.buildingDetails].filter(Boolean).join(' · ');
    }
    if (chosen.notes) {
      const notesInput = document.getElementById('input-notes');
      if (notesInput) notesInput.value = buildDefaultNotes(account, chosen, lang);
    }
  });

  document.getElementById('saved-phone-picker')?.addEventListener('change', (e) => {
    const chosen = account.phones.find((p) => p.id === e.target.value);
    const phoneInput = document.getElementById('input-phone');
    if (chosen && phoneInput) {
      phoneInput.value = chosen.number;
    }
  });

  const form = document.getElementById('checkout-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('input-fullName').value.trim();
    const phone = document.getElementById('input-phone').value.trim();
    const district = document.getElementById('input-district').value;
    const address = document.getElementById('input-address').value.trim();
    const notes = document.getElementById('input-notes').value.trim();

    let isValid = true;
    const setErr = (fieldId, hasErr) => {
      document.getElementById(fieldId)?.classList.toggle('has-error', hasErr);
      if (hasErr) isValid = false;
    };

    setErr('field-fullName', fullName.length < 3);
    setErr('field-phone', !/^01[0125][0-9]{8}$/.test(phone));
    setErr('field-district', !district);
    setErr('field-address', address.length < 6);

    if (!isValid) return;

    saveCustomerProfile({
      fullName,
      phone,
      districtId: district,
      streetAddress: address,
      buildingDetails: '',
      notes,
    });

    const chosenDistrict = DELIVERY_DISTRICTS.find((d) => d.id === district);
    const finalTotals = getCartTotals(chosenDistrict ? chosenDistrict.fee : BRAND_CONFIG.baseDeliveryFee);
    const orderNumber = `FH-${Math.floor(1000 + Math.random() * 9000)}`;

    const receipt = {
      orderNumber,
      createdAt: new Date().toISOString(),
      trackingProgress: 12,
      customer: {
        fullName,
        phone,
        district: chosenDistrict ? chosenDistrict.name : { ar: district, en: district },
        address,
        notes,
      },
      items: finalTotals.items.map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        const sizeObj = product?.sizes?.find((s) => s.id === item.sizeId);
        return {
          name: product?.name,
          size: sizeObj?.label || null,
          quantity: item.quantity,
          lineTotal: item.unitPrice * item.quantity,
        };
      }),
      subtotal: finalTotals.subtotal,
      deliveryFee: finalTotals.deliveryFee,
      total: finalTotals.total,
    };

    saveOrderReceipt(receipt);
    clearCart();
    window.location.href = `/track.html?confirmed=1&order=${encodeURIComponent(orderNumber)}`;
  });
}

initAppShell('checkout', renderCheckoutPage);
renderCheckoutPage();
