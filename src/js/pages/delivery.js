import { DELIVERY_DISTRICTS, UI_TEXT } from '../data.js';
import { getCustomerProfile, saveCustomerProfile } from '../cart.js';
import { formatPrice, getLang, t } from '../i18n.js';
import { bind3DTilt, escapeHtml, initAppShell } from '../ui.js';

function renderDeliveryPage() {
  const lang = getLang();
  const root = document.getElementById('delivery-root');
  if (!root) return;

  const saved = getCustomerProfile() || {};
  const nextTarget = new URLSearchParams(window.location.search).get('next');
  const primaryCtaText =
    nextTarget === 'checkout' ? t(UI_TEXT.delivery.saveAndCheckout, lang) : t(UI_TEXT.delivery.saveAndMenu, lang);

  const selectedDistrict =
    DELIVERY_DISTRICTS.find((d) => d.id === saved.districtId) || DELIVERY_DISTRICTS[0];

  root.innerHTML = `
    <section class="page-banner">
      <div class="container">
        <h1 class="page-banner__title">${escapeHtml(t(UI_TEXT.delivery.title, lang))}</h1>
        <p class="page-banner__subtitle">${escapeHtml(t(UI_TEXT.delivery.subtitle, lang))}</p>
      </div>
    </section>

    <section class="section">
      <div class="container checkout-layout">
        <form class="panel" id="delivery-profile-form" novalidate>
          <div class="form-grid form-grid--2">
            <div class="field" id="df-fullName">
              <label for="d-fullName">${escapeHtml(t(UI_TEXT.checkout.fullName, lang))} *</label>
              <input type="text" id="d-fullName" value="${escapeHtml(saved.fullName || '')}" required autocomplete="name" />
              <span class="field__error">${escapeHtml(t(UI_TEXT.checkout.errors.fullName, lang))}</span>
            </div>

            <div class="field" id="df-phone">
              <label for="d-phone">${escapeHtml(t(UI_TEXT.checkout.phone, lang))} *</label>
              <input type="tel" id="d-phone" value="${escapeHtml(saved.phone || '')}" placeholder="01012345678" dir="ltr" required autocomplete="tel" />
              <span class="field__error">${escapeHtml(t(UI_TEXT.checkout.errors.phone, lang))}</span>
            </div>
          </div>

          <div class="form-grid" style="margin-top: 16px;">
            <div class="field" id="df-district">
              <label for="d-district">${escapeHtml(t(UI_TEXT.checkout.district, lang))} *</label>
              <select id="d-district" required>
                <option value="">${escapeHtml(t(UI_TEXT.checkout.selectDistrict, lang))}</option>
                ${DELIVERY_DISTRICTS.map(
                  (d) => `
                  <option value="${d.id}" ${(saved.districtId || DELIVERY_DISTRICTS[0].id) === d.id ? 'selected' : ''}>
                    ${escapeHtml(t(d.name, lang))} — ${escapeHtml(formatPrice(d.fee, lang))}
                  </option>
                `
                ).join('')}
              </select>
              <span class="field__error">${escapeHtml(t(UI_TEXT.checkout.errors.district, lang))}</span>
            </div>

            <div class="field" id="df-address">
              <label for="d-address">${escapeHtml(t(UI_TEXT.checkout.address, lang))} *</label>
              <input type="text" id="d-address" value="${escapeHtml(saved.streetAddress || '')}" required autocomplete="street-address" />
              <span class="field__error">${escapeHtml(t(UI_TEXT.checkout.errors.address, lang))}</span>
            </div>

            <div class="field">
              <label for="d-building">${escapeHtml(t(UI_TEXT.delivery.buildingLabel, lang))}</label>
              <input type="text" id="d-building" value="${escapeHtml(saved.buildingDetails || '')}" />
            </div>

            <div class="field">
              <label for="d-notes">${escapeHtml(t(UI_TEXT.delivery.landmarkLabel, lang))}</label>
              <textarea id="d-notes">${escapeHtml(saved.notes || '')}</textarea>
            </div>
          </div>

          <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 22px;">
            <button type="submit" class="btn btn--primary btn--lg" style="flex: 1 1 180px; white-space: normal; text-align: center;">
              ${escapeHtml(primaryCtaText)}
            </button>
            <a href="/menu.html" class="btn btn--outline btn--lg" style="flex: 1 1 140px;">
              ${escapeHtml(t(UI_TEXT.delivery.skipToMenu, lang))}
            </a>
          </div>
        </form>

        <aside class="panel tilt-3d">
          <h2 class="section-title" style="font-size: 1.4rem; margin-bottom: 12px;">
            ${escapeHtml(t(UI_TEXT.delivery.estimatedFeeLabel, lang))}
          </h2>
          <p style="font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--color-primary); margin: 0 0 12px;" class="tabular-nums" id="delivery-fee-preview">
            ${escapeHtml(formatPrice(selectedDistrict.fee, lang))}
          </p>
          <p style="color: var(--color-text-muted); font-size: 0.92rem; margin: 0 0 18px;">
            ${
              lang === 'ar'
                ? 'التوصيل مجاني تماماً عند الطلب بقيمة ٤٥٠ ج.م أو أكثر، ويصلك الفطير ساخناً خلال ٣٥ إلى ٤٥ دقيقة.'
                : 'Delivery is completely free on orders of 450 EGP or more, arriving hot in 35–45 minutes.'
            }
          </p>
          <div style="padding-top: 14px; border-top: 1px solid var(--color-border); display: flex; flex-direction: column; gap: 8px; font-size: 0.9rem; color: var(--color-text-muted);">
            <div><i class="fa-solid fa-fire-burner" style="color: var(--color-accent);"></i> ${lang === 'ar' ? 'يُفرد ويُخبز طازجاً بعد تأكيد الطلب' : 'Hand-stretched & baked fresh on order'}</div>
            <div><i class="fa-solid fa-money-bill-wave" style="color: var(--color-accent);"></i> ${escapeHtml(t(UI_TEXT.checkout.codLabel, lang))}</div>
          </div>
        </aside>
      </div>
    </section>
  `;

  bind3DTilt(root);

  const districtSelect = document.getElementById('d-district');
  districtSelect?.addEventListener('change', () => {
    const dist = DELIVERY_DISTRICTS.find((d) => d.id === districtSelect.value);
    const feeEl = document.getElementById('delivery-fee-preview');
    if (dist && feeEl) {
      feeEl.textContent = formatPrice(dist.fee, lang);
    }
  });

  document.getElementById('delivery-profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = document.getElementById('d-fullName').value.trim();
    const phone = document.getElementById('d-phone').value.trim();
    const districtId = document.getElementById('d-district').value;
    const streetAddress = document.getElementById('d-address').value.trim();
    const buildingDetails = document.getElementById('d-building').value.trim();
    const notes = document.getElementById('d-notes').value.trim();

    let valid = true;
    const setErr = (id, err) => {
      document.getElementById(id)?.classList.toggle('has-error', err);
      if (err) valid = false;
    };

    setErr('df-fullName', fullName.length < 3);
    setErr('df-phone', !/^01[0125][0-9]{8}$/.test(phone));
    setErr('df-district', !districtId);
    setErr('df-address', streetAddress.length < 5);

    if (!valid) return;

    saveCustomerProfile({
      fullName,
      phone,
      districtId,
      streetAddress,
      buildingDetails,
      notes,
    });

    window.location.href = nextTarget === 'checkout' ? '/checkout.html' : '/menu.html';
  });
}

initAppShell('delivery', renderDeliveryPage);
renderDeliveryPage();
