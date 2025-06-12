<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { t } from 'svelte-i18n';
	import type { Account } from '$lib/types/account.types';
	import Wallet from '@lucide/svelte/icons/wallet';
	import { Badge } from '$lib/components/ui/badge';
	import Building2 from '@lucide/svelte/icons/building-2';
	import CreditCard from '@lucide/svelte/icons/credit-card';

	interface Props {
		accounts: Account[];
	}

	let { accounts }: Props = $props();

	const accountTypeIcons = {
		CHECKING: Building2,
		CREDIT: CreditCard,
		CASH: Wallet
	};

	const currencies = [
		{ code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
		{ code: 'COP', name: 'Colombian Peso', symbol: '$', locale: 'es-CO' },
		{ code: 'EUR', name: 'Euro', symbol: '€', locale: 'de-DE' },
		{ code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
		{ code: 'JPY', name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
		{ code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA' },
		{ code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU' },
		{ code: 'MXN', name: 'Mexican Peso', symbol: '$', locale: 'es-MX' }
	] as const;

	const formatCurrency = (amount: number, currencyCode: string) => {
		const currency = currencies.find((c) => c.code === currencyCode);
		if (!currency) return `${amount.toFixed(2)}`;

		return new Intl.NumberFormat(currency.locale, {
			style: 'currency',
			currency: currencyCode,
			minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
			maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2
		}).format(amount);
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{$t('account.yourAccounts')}</Card.Title>
		<Card.Description>{$t('account.yourAccountsDescription')}</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if accounts.length === 0}
			<div class="text-muted-foreground py-8 text-center">
				<Wallet class="mx-auto mb-4 h-12 w-12 opacity-50" />
				<p>{$t('account.noAccounts')}</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each accounts as account (account.id)}
					{@const Icon = accountTypeIcons[account.accountType]}
					<div class="flex items-center justify-between rounded-lg border p-4">
						<div class="flex items-center gap-3">
							<div class="bg-muted rounded-lg p-2">
								<Icon class="h-4 w-4" />
							</div>
							<div>
								<p class="font-medium">{account.name}</p>
								<p class="text-muted-foreground text-sm">
									{$t(`account.accountTypes.${account.accountType}`)} • {account.currencyCode}
								</p>
							</div>
						</div>
						<div class="text-right">
							<p class="font-semibold">{formatCurrency(account.balance, account.currencyCode)}</p>
							<Badge variant={account.accountType === 'CREDIT' ? 'destructive' : 'secondary'}>
								{account.accountType}
							</Badge>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
