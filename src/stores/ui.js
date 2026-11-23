import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getLang, setLang } from '../js/i18n.js';

export const useUiStore = defineStore('ui', () => {
  const lang = ref(getLang());

  function setLanguage(next) {
    const normalized = next === 'en' ? 'en' : 'ar';
    setLang(normalized);
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('lang:changed', (event) => {
      lang.value = event.detail?.lang === 'en' ? 'en' : 'ar';
    });
  }

  return { lang, setLanguage };
});
