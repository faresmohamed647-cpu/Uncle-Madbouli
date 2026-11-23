import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/index.js';
import { applyDocumentDirection } from './js/i18n.js';
import { useCartStore } from './stores/cart.js';
import { useUiStore } from './stores/ui.js';

const app = createApp(App);
const pinia = createPinia();

applyDocumentDirection();
app.use(pinia);
app.use(router);
useCartStore(pinia);
useUiStore(pinia);
app.mount('#app');
