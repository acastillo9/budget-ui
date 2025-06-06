import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

// Register your locale dictionaries
register('en', () => import('./locales/en.json'));
register('es', () => import('./locales/es.json'));

// Initialize
init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
  loadingDelay: 200,
  warnOnMissingMessages: true
});
