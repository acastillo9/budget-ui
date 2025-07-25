<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { t } from 'svelte-i18n';
	import type { Account } from '$lib/types/account.types';
	import Wallet from '@lucide/svelte/icons/wallet';
	import { Badge } from '$lib/components/ui/badge';
	import Building2 from '@lucide/svelte/icons/building-2';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import { formatCurrencyWithSymbol } from '$lib/utils/currency';
	import Button from './ui/button/button.svelte';
	import { Edit, Trash2 } from '@lucide/svelte';
	import { getUserContext } from '$lib/context';

	interface Props {
		accounts: Account[];
		headless?: boolean;
		editable?: boolean;
		onEdit?: (account: Account) => void;
		onDelete?: (account: Account) => void;
	}

	let {
		accounts,
		headless = false,
		editable = false,
		onEdit = () => {},
		onDelete = () => {}
	}: Props = $props();

	const accountTypeIcons = {
		CHECKING: Building2,
		CREDIT: CreditCard,
		CASH: Wallet
	};

	const userState = getUserContext();
</script>

<Card.Root>
	{#if !headless}
		<Card.Header>
			<Card.Title>{$t('accounts.yourAccounts')}</Card.Title>
			<Card.Description>{$t('accounts.yourAccountsDescription')}</Card.Description>
		</Card.Header>
	{/if}
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
						<div
							class="flex w-full flex-col items-start md:flex-row md:items-center md:justify-between"
						>
							<div class="mb-2 flex items-center gap-3 md:mb-0">
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
							<div class="mr-4 md:text-right">
								<p class="font-semibold">
									{#if account.currencyCode !== userState.user?.currencyCode}
										<span>{account.currencyCode}</span>
									{/if}
									{formatCurrencyWithSymbol(account.balance, account.currencyCode)}
								</p>
								<Badge variant={account.accountType === 'CREDIT' ? 'destructive' : 'secondary'}>
									{account.accountType}
								</Badge>
							</div>
						</div>
						<div class="flex items-center gap-2">
							{#if editable}
								<div class="flex items-center gap-2">
									<Button variant="ghost" size="icon" onclick={() => onEdit(account)}>
										<Edit class="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onclick={() => onDelete(account)}
										class="text-destructive hover:text-destructive"
									>
										<Trash2 class="h-4 w-4" />
									</Button>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
