<script lang="ts">
	import AccountList from '$lib/components/account-list.svelte';
	import AddAccountDialog from '$lib/components/add-account-dialog.svelte';
	import CreateTransactionDialog from '$lib/components/create-transaction-wizard/create-transaction-dialog.svelte';
	import TransactionList from '$lib/components/transaction-list.svelte';
	import { t } from 'svelte-i18n';
	import type { PageProps } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { DollarSign, TrendingDown, TrendingUp } from '@lucide/svelte';
	import { formatCurrencyWithSymbol } from '$lib/utils/currency';
	import { getUserContext } from '$lib/context';
	import { toast } from 'svelte-sonner';

	let { data }: PageProps = $props();

	const userState = getUserContext();

	let userCurrencyCode = $derived(userState.user?.currencyCode || 'USD');
	let currencies = $state(data.currencies);
	let totalBalance = $derived(
		data.accountsSummary.reduce(
			(acc: number, accountSummary: { totalBalance: number; currencyCode: string }) =>
				acc + accountSummary.totalBalance / currencies[accountSummary.currencyCode],
			0
		)
	);
	let transactionsSummary = $derived(
		data.transactionsSummary.reduce(
			(
				acc: { totalIncome: number; totalExpenses: number },
				transactionSummary: { totalIncome: number; totalExpenses: number; currencyCode: string }
			) => {
				return {
					totalIncome:
						acc.totalIncome +
						transactionSummary.totalIncome / currencies[transactionSummary.currencyCode],
					totalExpenses:
						acc.totalExpenses +
						transactionSummary.totalExpenses / currencies[transactionSummary.currencyCode]
				};
			},
			{ totalIncome: 0, totalExpenses: 0 }
		)
	);

	async function loadCurrencies(currencyCode: string) {
		try {
			const response = await fetch(`/api/currencies/${currencyCode}`);

			if (!response.ok) {
				throw new Error('Failed to fetch currency data');
			}

			const data = await response.json();
			currencies = data;
		} catch {
			toast.error($t('currencies.loadCurrenciesError'));
		}
	}

	$effect(() => {
		loadCurrencies(userCurrencyCode);
	});
</script>

<svelte:head>
	<title>Budget App - {$t('dashboard.title')}</title>
</svelte:head>

<section class="flex h-full w-full flex-col py-4 md:py-6">
	<div class="container mx-auto">
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold">{$t('dashboard.title')}</h1>
				<p class="text-muted-foreground">{$t('dashboard.description')}</p>
			</div>

			<div class="flex items-center space-x-2">
				<AddAccountDialog data={data.addAccountForm} />
				{#if data.accounts.length > 0}
					<CreateTransactionDialog
						buttonVariant="outline"
						addTransactionForm={data.addTransactionForm}
						addTransferForm={data.addTransferForm}
						createCategoryForm={data.createCategoryForm}
						categories={data.categories}
						accounts={data.accounts}
					/>
				{/if}
			</div>
		</div>

		<div class="space-y-6">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">{$t('dashboard.totalBalance')}</Card.Title>
						<DollarSign class="text-muted-foreground h-4 w-4" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold">
							{formatCurrencyWithSymbol(totalBalance, userCurrencyCode)}
						</div>
						<p class="text-muted-foreground text-xs">
							{$t('dashboard.totalBalanceDescription', {
								values: { count: data.accounts.length, currency: userCurrencyCode }
							})}
						</p>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">{$t('dashboard.totalIncome')}</Card.Title>
						<TrendingUp class="h-4 w-4 text-green-600" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold text-green-600">
							{formatCurrencyWithSymbol(transactionsSummary.totalIncome, userCurrencyCode)}
						</div>
						<p class="text-muted-foreground text-xs">
							{$t('dashboard.totalTransactionsDescription', {
								values: { currency: userCurrencyCode }
							})}
						</p>
					</Card.Content>
				</Card.Root>
				<Card.Root>
					<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
						<Card.Title class="text-sm font-medium">{$t('dashboard.totalExpenses')}</Card.Title>
						<TrendingDown class="h-4 w-4 text-red-600" />
					</Card.Header>
					<Card.Content>
						<div class="text-2xl font-bold text-red-600">
							{formatCurrencyWithSymbol(transactionsSummary.totalExpenses, userCurrencyCode)}
						</div>
						<p class="text-muted-foreground text-xs">
							{$t('dashboard.totalTransactionsDescription', {
								values: { currency: userCurrencyCode }
							})}
						</p>
					</Card.Content>
				</Card.Root>
			</div>
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div>
					<AccountList accounts={data.accounts} />
				</div>
				<div>
					<TransactionList transactions={data.transactions} />
				</div>
			</div>
		</div>
	</div>
</section>
