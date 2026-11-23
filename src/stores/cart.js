import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { getCart } from '../js/cart.js';

export const useCartStore = defineStore('cart', () => {
  const items = ref(getCart());
  const count = computed(() => items.value.reduce((total, item) => total + (Number(item.quantity) || 0), 0));

  function sync(nextItems = getCart()) {
    items.value = Array.isArray(nextItems) ? nextItems : getCart();
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('cart:updated', (event) => sync(event.detail?.items));
    window.addEventListener('storage', (event) => {
      if (!event.key || event.key === 'feteer_house_cart_v1') sync();
    });
  }

  return { items, count, sync };
});
