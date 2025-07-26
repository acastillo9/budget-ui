<script lang="ts">
	import AccountList from '$lib/components/account-list.svelte';
	import CreateTransactionDialog from '$lib/components/create-transaction-wizard/create-transaction-dialog.svelte';
	import TransactionList from '$lib/components/transaction-list.svelte';
	import { t } from 'svelte-i18n';
	import type { PageProps } from './$types';
	import { formatCurrencyWithSymbol } from '$lib/utils/currency';
	import { getUserContext } from '$lib/context';
	import { toast } from 'svelte-sonner';
	import TotalCard from '$lib/components/total-card.svelte';

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

<section class="flex h-full w-full flex-col gap-4 py-4 md:py-6">
	<div class="container mx-auto">
		<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<div>
				<h1 class="text-3xl font-bold">{$t('dashboard.title')}</h1>
				<p class="text-muted-foreground">{$t('dashboard.description')}</p>
			</div>

			<div class="flex items-center space-x-2">
				{#if data.accounts.length > 0}
					<CreateTransactionDialog
						addTransactionForm={data.addTransactionForm}
						addTransferForm={data.addTransferForm}
						createCategoryForm={data.createCategoryForm}
						categories={data.categories}
						accounts={data.accounts}
					/>
				{/if}
			</div>
		</div>
	</div>

	<div class="container mx-auto">
		<div class="space-y-6">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<TotalCard
					title={$t('dashboard.totalBalance')}
					description={$t('dashboard.totalBalanceDescription', {
						values: { count: data.accounts.length, currency: userCurrencyCode }
					})}
					total={formatCurrencyWithSymbol(totalBalance, userCurrencyCode)}
				></TotalCard>
				<TotalCard
					title={$t('dashboard.totalIncome')}
					description={$t('dashboard.totalTransactionsDescription', {
						values: { currency: userCurrencyCode }
					})}
					total={formatCurrencyWithSymbol(transactionsSummary.totalIncome, userCurrencyCode)}
					variant="income"
				></TotalCard>
				<TotalCard
					title={$t('dashboard.totalExpenses')}
					description={$t('dashboard.totalTransactionsDescription', {
						values: { currency: userCurrencyCode }
					})}
					total={formatCurrencyWithSymbol(transactionsSummary.totalExpenses, userCurrencyCode)}
					variant="expense"
				></TotalCard>
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
