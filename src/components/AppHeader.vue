<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { BRAND_CONFIG, UI_TEXT } from '../js/data.js';
import { t } from '../js/i18n.js';
import { getOrderEntryHref } from '../js/ui.js';
import { useCartStore } from '../stores/cart.js';
import { useUiStore } from '../stores/ui.js';

const route = useRoute();
const cart = useCartStore();
const ui = useUiStore();
const drawer = ref(null);
const drawerOpen = ref(false);

const navItems = computed(() => [
  { key: 'home', to: '/', label: t(UI_TEXT.nav.home, ui.lang) },
  { key: 'menu', to: '/menu', label: t(UI_TEXT.nav.menu, ui.lang) },
  { key: 'track', to: '/track', label: t(UI_TEXT.nav.track, ui.lang) },
  { key: 'about', to: '/about', label: t(UI_TEXT.nav.about, ui.lang) },
  { key: 'contact', to: '/contact', label: t(UI_TEXT.nav.contact, ui.lang) },
]);
const activePage = computed(() => route.name === 'product' ? 'menu' : String(route.name || 'home'));

function openDrawer() {
  if (drawer.value && !drawer.value.open) {
    drawer.value.showModal();
    drawerOpen.value = true;
    nextTick(() => drawer.value?.querySelector('#mobile-menu-close')?.focus());
  }
}

function closeDrawer() {
  if (drawer.value?.open) drawer.value.close();
  drawerOpen.value = false;
}

watch(() => route.fullPath, closeDrawer);
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <RouterLink to="/" class="brand-link">
        <span class="brand-mark"><img src="/images/brand-logo.png" alt="Amo Madbouly Pie & Pizza" /></span>
        <span>{{ t(BRAND_CONFIG.name, ui.lang) }}</span>
      </RouterLink>

      <nav class="nav-links" aria-label="Main Navigation">
        <RouterLink
          v-for="item in navItems"
          :key="item.key"
          :to="item.to"
          class="nav-link"
          :class="{ 'nav-link--active': activePage === item.key }"
        >{{ item.label }}</RouterLink>
      </nav>

      <div class="header-actions">
        <button type="button" class="lang-toggle" aria-label="Switch Language" @click="ui.setLanguage(ui.lang === 'ar' ? 'en' : 'ar')">
          {{ ui.lang === 'ar' ? 'EN' : 'عربي' }}
        </button>
        <RouterLink to="/account" class="cart-trigger" :aria-label="t(UI_TEXT.account.navLabel, ui.lang)" :title="t(UI_TEXT.account.navLabel, ui.lang)">
          <i class="fa-regular fa-user"></i>
        </RouterLink>
        <RouterLink to="/cart" class="cart-trigger" :aria-label="t(UI_TEXT.nav.cart, ui.lang)">
          <i class="fa-solid fa-bag-shopping"></i>
          <span class="cart-badge tabular-nums">{{ cart.count }}</span>
        </RouterLink>
        <RouterLink :to="getOrderEntryHref()" class="btn btn--primary btn--sm header-order-cta">
          {{ t(UI_TEXT.nav.orderNow, ui.lang) }}
        </RouterLink>
        <button
          type="button"
          class="mobile-menu-btn"
          aria-label="Open Menu"
          aria-controls="mobile-drawer"
          :aria-expanded="drawerOpen"
          @click="openDrawer"
        >
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </div>

    <dialog
      id="mobile-drawer"
      ref="drawer"
      class="mobile-drawer"
      :class="{ 'is-open': drawerOpen }"
      :aria-label="ui.lang === 'ar' ? 'قائمة التنقل' : 'Mobile Navigation'"
      @close="drawerOpen = false"
      @click.self="closeDrawer"
    >
      <div class="mobile-drawer__head">
        <span class="brand-link">{{ t(BRAND_CONFIG.name, ui.lang) }}</span>
        <button type="button" class="mobile-menu-btn" id="mobile-menu-close" :aria-label="ui.lang === 'ar' ? 'إغلاق القائمة' : 'Close Menu'" @click="closeDrawer">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <nav class="mobile-drawer__nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.key"
          :to="item.to"
          class="mobile-drawer__link"
          :class="{ 'mobile-drawer__link--active': activePage === item.key }"
          @click="closeDrawer"
        >{{ item.label }}</RouterLink>
        <RouterLink to="/account" class="mobile-drawer__link" :class="{ 'mobile-drawer__link--active': activePage === 'account' }" @click="closeDrawer">
          {{ t(UI_TEXT.account.navLabel, ui.lang) }}
        </RouterLink>
        <RouterLink to="/delivery" class="mobile-drawer__link" :class="{ 'mobile-drawer__link--active': activePage === 'delivery' }" @click="closeDrawer">
          {{ t(UI_TEXT.delivery.navLabel, ui.lang) }}
        </RouterLink>
        <RouterLink to="/cart" class="mobile-drawer__link" :class="{ 'mobile-drawer__link--active': activePage === 'cart' }" @click="closeDrawer">
          {{ t(UI_TEXT.nav.cart, ui.lang) }}
        </RouterLink>
      </nav>
      <RouterLink :to="getOrderEntryHref()" class="btn btn--primary btn--full" style="margin-top: auto" @click="closeDrawer">
        {{ t(UI_TEXT.nav.orderNow, ui.lang) }}
      </RouterLink>
    </dialog>
  </header>
</template>
