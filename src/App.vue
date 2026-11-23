<script setup>
import { onBeforeUnmount, onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';

const router = useRouter();

function handleInternalNavigation(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = event.target.closest?.('a[href]');
  if (!anchor || anchor.target || anchor.hasAttribute('download')) return;

  const destination = new URL(anchor.href, window.location.href);
  if (destination.origin !== window.location.origin) return;
  if (destination.pathname === window.location.pathname && destination.hash) return;

  const target = `${destination.pathname}${destination.search}${destination.hash}`;
  if (!router.resolve(target).matched.length) return;
  event.preventDefault();
  router.push(target);
}

onMounted(() => document.addEventListener('click', handleInternalNavigation));
onBeforeUnmount(() => document.removeEventListener('click', handleInternalNavigation));
</script>

<template>
  <div class="app-root">
    <AppHeader />
    <RouterView v-slot="{ Component }">
      <component :is="Component" :key="$route.fullPath" />
    </RouterView>
    <AppFooter />
  </div>
</template>
