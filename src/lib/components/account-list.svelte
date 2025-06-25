<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { t } from 'svelte-i18n';
	import type { Account } from '$lib/types/account.types';
	import Wallet from '@lucide/svelte/icons/wallet';
	import { Badge } from '$lib/components/ui/badge';
	import Building2 from '@lucide/svelte/icons/building-2';
	import CreditCard from '@lucide/svelte/icons/credit-card';
  import { formatCurrency } from '$lib/utils/currency';

	interface Props {
		accounts: Account[];
	}

	let { accounts }: Props = $props();

	const accountTypeIcons = {
		CHECKING: Building2,
		CREDIT: CreditCard,
		CASH: Wallet
	};
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{$t('accounts.yourAccounts')}</Card.Title>
		<Card.Description>{$t('accounts.yourAccountsDescription')}</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if accounts.length === 0}
			<div class="text-muted-foreground py-8 text-center">
				<Wallet class="mx-auto mb-4 h-12 w-12 opacity-50" />
				<p>{$t('accounts.noAccounts')}</p>
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
									{$t(`accounts.accountTypes.${account.accountType}`)} • {account.currencyCode}
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
