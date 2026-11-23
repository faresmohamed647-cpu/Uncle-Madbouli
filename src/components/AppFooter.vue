<script setup>
import { RouterLink } from 'vue-router';
import { BRAND_CONFIG, UI_TEXT } from '../js/data.js';
import { t } from '../js/i18n.js';
import { useUiStore } from '../stores/ui.js';

const ui = useUiStore();
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand-lockup">
            <img src="/images/brand-logo.png" alt="Amo Madbouly Pie & Pizza" />
            <h2 class="footer-brand">{{ t(BRAND_CONFIG.name, ui.lang) }}</h2>
          </div>
          <p class="footer-copy">{{ t(BRAND_CONFIG.tagline, ui.lang) }}</p>
          <div class="footer-socials">
            <a href="https://www.facebook.com/share/1FhQyU6Afz/" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a :href="`https://wa.me/${BRAND_CONFIG.whatsappNumber}`" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>

        <div>
          <h3 class="footer-heading">{{ t(UI_TEXT.footer.quickLinks, ui.lang) }}</h3>
          <ul class="footer-list">
            <li><RouterLink to="/">{{ t(UI_TEXT.nav.home, ui.lang) }}</RouterLink></li>
            <li><RouterLink to="/menu">{{ t(UI_TEXT.nav.menu, ui.lang) }}</RouterLink></li>
            <li><RouterLink to="/track">{{ t(UI_TEXT.nav.track, ui.lang) }}</RouterLink></li>
            <li><RouterLink to="/account">{{ t(UI_TEXT.account.navLabel, ui.lang) }}</RouterLink></li>
            <li><RouterLink to="/delivery">{{ t(UI_TEXT.delivery.navLabel, ui.lang) }}</RouterLink></li>
            <li><RouterLink to="/about">{{ t(UI_TEXT.nav.about, ui.lang) }}</RouterLink></li>
            <li><RouterLink to="/contact">{{ t(UI_TEXT.nav.contact, ui.lang) }}</RouterLink></li>
            <li><RouterLink to="/cart">{{ t(UI_TEXT.nav.cart, ui.lang) }}</RouterLink></li>
            <li><a href="/kitchen" target="_blank" rel="noopener noreferrer">{{ t(UI_TEXT.kitchen.navLabel, ui.lang) }}</a></li>
          </ul>
        </div>

        <div>
          <h3 class="footer-heading">{{ t(UI_TEXT.footer.contactInfo, ui.lang) }}</h3>
          <ul class="footer-list">
            <li><a :href="BRAND_CONFIG.phoneHref" dir="ltr">{{ BRAND_CONFIG.phone }}</a></li>
            <li><a :href="`mailto:${BRAND_CONFIG.email}`">{{ BRAND_CONFIG.email }}</a></li>
            <li>{{ t(BRAND_CONFIG.address, ui.lang) }}</li>
          </ul>
        </div>

        <div>
          <h3 class="footer-heading">{{ t(UI_TEXT.footer.openingHours, ui.lang) }}</h3>
          <ul class="footer-list">
            <li>{{ t(BRAND_CONFIG.hours, ui.lang) }}</li>
            <li>{{ ui.lang === 'ar' ? 'التوصيل متاح في مناطق الإسكندرية' : 'Delivery across Alexandria' }}</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© {{ currentYear }} {{ t(BRAND_CONFIG.name, ui.lang) }} · {{ t(UI_TEXT.footer.copyright, ui.lang) }}</span>
        <RouterLink to="/menu" class="footer-order-link">{{ t(UI_TEXT.nav.orderNow, ui.lang) }}</RouterLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-order-link {
  color: var(--color-accent);
  font-weight: 600;
}
</style>
