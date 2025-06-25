import type { Account } from '$lib/types/account.types';
import { $t } from '$lib/i18n';
import { formatCurrency } from './currency';

export function formatAccountName(account: Account, withBalance: boolean = false): string {
  return `${account.name} (${$t(`accounts.accountTypes.${account.accountType}`)})${withBalance ? ` - ${formatCurrency(account.balance, account.currencyCode)}` : ''}`;
}
