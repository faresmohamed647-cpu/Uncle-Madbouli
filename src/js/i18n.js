/**
 * Bilingual Arabic (RTL) / English (LTR) Helper
 */
import { BRAND_CONFIG } from './data.js';

const LANG_STORAGE_KEY = 'feteer_house_lang';

export function getLang() {
  const stored = localStorage.getItem(LANG_STORAGE_KEY);
  return stored === 'en' ? 'en' : 'ar';
}

export function setLang(lang) {
  const normalized = lang === 'en' ? 'en' : 'ar';
  localStorage.setItem(LANG_STORAGE_KEY, normalized);
  applyDocumentDirection(normalized);
  window.dispatchEvent(new CustomEvent('lang:changed', { detail: { lang: normalized } }));
  return normalized;
}

export function toggleLang() {
  const next = getLang() === 'ar' ? 'en' : 'ar';
  return setLang(next);
}

export function applyDocumentDirection(lang = getLang()) {
  const html = document.documentElement;
  html.lang = lang;
  html.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Resolves either a bilingual object { ar, en } or returns a string directly.
 */
export function t(value, lang = getLang()) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value.ar ?? value.en ?? '';
}

export function formatPrice(amount, lang = getLang()) {
  const num = Math.round(Number(amount) || 0);
  const formatted = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(num);
  return `${formatted} ${t(BRAND_CONFIG.currency, lang)}`;
}
