import { API_URL } from '$env/static/private';
import { setFlash } from 'sveltekit-flash-message/server';
import type { LayoutServerLoad } from './$types';
import { $t } from '$lib/i18n';

export const load: LayoutServerLoad = async ({ locals, cookies, fetch }) => {
  const user = locals.user;

  // Get the currency exhange rates
  let rates: { [currencyCode: string]: number } = {};
  try {
    const response = await fetch(`${API_URL}/currencies/${user.currencyCode}`);
    if (!response.ok) {
      throw new Error('Failed to load rates');
    }
    rates = await response.json();
  } catch {
    setFlash({ type: 'error', message: $t('currencies.loadCurrenciesError') }, cookies);
  }

  return { user: user, rates };
};
