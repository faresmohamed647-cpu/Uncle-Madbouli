import { BRAND_CONFIG } from '../data.js';
import { getLang, t } from '../i18n.js';
import { escapeHtml, initAppShell } from '../ui.js';

function renderContactPage() {
  const lang = getLang();
  const root = document.getElementById('contact-root');
  if (!root) return;

  const copy = {
    title: { ar: 'تواصل معنا', en: 'Contact Us' },
    subtitle: {
      ar: 'يسعدنا استقبال طلباتكم، استفسارات العزومات، وملاحظاتكم يومياً.',
      en: 'Reach out for direct orders, group catering inquiries, or feedback any day of the week.',
    },
    phoneLabel: { ar: 'رقم الهاتف والطلبات السريعة', en: 'Phone & Quick Orders' },
    whatsappLabel: { ar: 'تواصل عبر واتساب', en: 'Order via WhatsApp' },
    whatsappBtn: { ar: 'محادثة واتساب مباشرة', en: 'Chat on WhatsApp' },
    locationLabel: { ar: 'موقع المخبز الرئيسي', en: 'Main Bakery Location' },
    hoursLabel: { ar: 'ساعات العمل', en: 'Opening Hours' },
    mapTitle: { ar: 'موقع المخبز على الخريطة', en: 'Bakery Location Map' },
    mapBtn: { ar: 'فتح في خرائط جوجل', en: 'Open in Google Maps' },
    mapHint: { ar: 'اسحب الخريطة أو اضغط على العلامة للتفاصيل', en: 'Drag map or click the pin for branch details' },
    landmarkClub: { ar: 'نادي الجزيرة · ٣ دقائق', en: 'Gezira Club · 3 min' },
    landmarkMetro: { ar: 'محطة سيدي جابر · الإسكندرية', en: 'Sidi Gaber Station · Alexandria' },
    formTitle: { ar: 'أرسل لنا رسالة', en: 'Send Us a Message' },
    nameLabel: { ar: 'الاسم', en: 'Your Name' },
    phoneInputLabel: { ar: 'رقم الهاتف', en: 'Phone Number' },
    msgLabel: { ar: 'رسالتك', en: 'Your Message' },
    sendBtn: { ar: 'إرسال الرسالة', en: 'Send Message' },
    sentMsg: {
      ar: 'شكراً لتواصلك معنا! تم استلام رسالتك وسيتواصل معك فريقنا قريباً.',
      en: 'Thank you! Your message has been received and our team will respond shortly.',
    },
  };

  root.innerHTML = `
    <section class="page-banner">
      <div class="container">
        <h1 class="page-banner__title">${escapeHtml(t(copy.title, lang))}</h1>
        <p class="page-banner__subtitle">${escapeHtml(t(copy.subtitle, lang))}</p>
      </div>
    </section>

    <section class="section">
      <div class="container contact-grid">
        <div>
          <div class="contact-cards">
            <div class="contact-item">
              <div class="contact-item__icon"><i class="fa-solid fa-phone"></i></div>
              <div>
                <strong style="display: block; color: var(--color-primary);">${escapeHtml(t(copy.phoneLabel, lang))}</strong>
                <a href="${BRAND_CONFIG.phoneHref}" dir="ltr" style="color: var(--color-text-muted); font-weight: 600;">${escapeHtml(BRAND_CONFIG.phone)}</a>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-item__icon"><i class="fa-brands fa-whatsapp"></i></div>
              <div>
                <strong style="display: block; color: var(--color-primary); margin-bottom: 6px;">${escapeHtml(t(copy.whatsappLabel, lang))}</strong>
                <a
                  href="https://wa.me/${BRAND_CONFIG.whatsappNumber}?text=${encodeURIComponent('مرحباً، أود الاستفسار عن طلب من عم مدبولي')}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn--primary btn--sm"
                >
                  <i class="fa-brands fa-whatsapp"></i>
                  <span>${escapeHtml(t(copy.whatsappBtn, lang))}</span>
                </a>
              </div>
            </div>

            <div class="contact-item contact-item--qr">
              <div class="contact-item__icon"><i class="fa-brands fa-facebook-f"></i></div>
              <div>
                <strong style="display:block;color:var(--color-primary);margin-bottom:8px;">${lang === 'ar' ? 'تابعنا على فيسبوك' : 'Find us on Facebook'}</strong>
                <a href="https://www.facebook.com/share/1FhQyU6Afz/" target="_blank" rel="noopener noreferrer" aria-label="${lang === 'ar' ? 'فتح رمز فيسبوك' : 'Open Facebook QR code'}">
                  <img src="/images/facebook-qr.png" alt="Facebook QR code" width="112" height="112" style="display:block;border-radius:8px;image-rendering:pixelated;" />
                </a>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-item__icon"><i class="fa-solid fa-location-dot"></i></div>
              <div>
                <strong style="display: block; color: var(--color-primary);">${escapeHtml(t(copy.locationLabel, lang))}</strong>
                <span style="color: var(--color-text-muted);">${escapeHtml(t(BRAND_CONFIG.address, lang))}</span>
              </div>
            </div>

            <div class="contact-item">
              <div class="contact-item__icon"><i class="fa-regular fa-clock"></i></div>
              <div>
                <strong style="display: block; color: var(--color-primary);">${escapeHtml(t(copy.hoursLabel, lang))}</strong>
                <span style="color: var(--color-text-muted);">${escapeHtml(t(BRAND_CONFIG.hours, lang))}</span>
              </div>
            </div>
          </div>

          <div class="panel" style="margin-top:18px;">
            <h2 class="section-title" style="font-size:1.25rem;margin-bottom:10px;">${escapeHtml(t(copy.mapTitle, lang))}</h2>
            <p style="margin-bottom:14px;color:var(--color-text-muted);">${escapeHtml(t(BRAND_CONFIG.address, lang))}</p>
            <a href="${BRAND_CONFIG.mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--sm">
              <i class="fa-solid fa-diamond-turn-right"></i>
              <span>${escapeHtml(t(copy.mapBtn, lang))}</span>
            </a>
          </div>

        </div>

        <form class="panel" id="contact-form">
          <h2 class="section-title" style="font-size: 1.5rem; margin-bottom: 18px;">${escapeHtml(t(copy.formTitle, lang))}</h2>
          <div class="form-grid">
            <div class="field">
              <label for="c-name">${escapeHtml(t(copy.nameLabel, lang))} *</label>
              <input type="text" id="c-name" required />
            </div>
            <div class="field">
              <label for="c-phone">${escapeHtml(t(copy.phoneInputLabel, lang))} *</label>
              <input type="tel" id="c-phone" dir="ltr" required />
            </div>
            <div class="field">
              <label for="c-msg">${escapeHtml(t(copy.msgLabel, lang))} *</label>
              <textarea id="c-msg" required></textarea>
            </div>
            <button type="submit" class="btn btn--primary btn--lg">${escapeHtml(t(copy.sendBtn, lang))}</button>
          </div>
          <div class="alert-success" id="contact-success" role="status">
            ${escapeHtml(t(copy.sentMsg, lang))}
          </div>
        </form>
      </div>
    </section>
  `;



  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    form.reset();
    document.getElementById('contact-success')?.classList.add('is-visible');
  });
}

initAppShell('contact', renderContactPage);
renderContactPage();
