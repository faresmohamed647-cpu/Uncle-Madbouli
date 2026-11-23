import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    publicDir: path.resolve(__dirname, 'src/assets'),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          menu: path.resolve(__dirname, 'menu.html'),
          product: path.resolve(__dirname, 'product.html'),
          cart: path.resolve(__dirname, 'cart.html'),
          checkout: path.resolve(__dirname, 'checkout.html'),
          about: path.resolve(__dirname, 'about.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          track: path.resolve(__dirname, 'track.html'),
          delivery: path.resolve(__dirname, 'delivery.html'),
          account: path.resolve(__dirname, 'account.html'),
          kitchen: path.resolve(__dirname, 'kitchen.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
