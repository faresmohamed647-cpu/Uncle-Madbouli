import { onBeforeUnmount, onMounted } from 'vue';
import { applyDocumentDirection, getLang } from '../js/i18n.js';

export function usePageLocale(refreshPage) {
  const handleLanguageChange = (event) => {
    applyDocumentDirection(event.detail?.lang || getLang());
    refreshPage();
  };

  onMounted(() => {
    applyDocumentDirection();
    window.addEventListener('lang:changed', handleLanguageChange);
  });

  onBeforeUnmount(() => window.removeEventListener('lang:changed', handleLanguageChange));
}
