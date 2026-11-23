import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0, behavior: 'smooth' };
  },
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue'), meta: { title: 'عم مدبولي | فطير مصري أصيل' } },
    { path: '/menu', name: 'menu', component: () => import('../views/MenuView.vue'), meta: { title: 'Menu | Amo Madbouly' } },
    { path: '/product', name: 'product', component: () => import('../views/ProductView.vue'), meta: { title: 'Product | Amo Madbouly' } },
    { path: '/cart', name: 'cart', component: () => import('../views/CartView.vue'), meta: { title: 'Cart | Amo Madbouly' } },
    { path: '/checkout', name: 'checkout', component: () => import('../views/CheckoutView.vue'), meta: { title: 'Checkout | Amo Madbouly' } },
    { path: '/about', name: 'about', component: () => import('../views/AboutView.vue'), meta: { title: 'About | Amo Madbouly' } },
    { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue'), meta: { title: 'Contact | Amo Madbouly' } },
    { path: '/track', name: 'track', component: () => import('../views/TrackView.vue'), meta: { title: 'Track Order | Amo Madbouly' } },
    { path: '/delivery', name: 'delivery', component: () => import('../views/DeliveryView.vue'), meta: { title: 'Delivery | Amo Madbouly' } },
    { path: '/account', name: 'account', component: () => import('../views/AccountView.vue'), meta: { title: 'Account | Amo Madbouly' } },
    { path: '/kitchen', name: 'kitchen', component: () => import('../views/KitchenView.vue'), meta: { title: 'Kitchen | Amo Madbouly' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

router.afterEach((to) => {
  if (to.meta.title) document.title = to.meta.title;
});

export default router;
