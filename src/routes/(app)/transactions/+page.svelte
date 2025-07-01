<script lang="ts">
	import type { PageProps } from '../$types';
	import { t } from 'svelte-i18n';
	import AddTransactionDialog from '$lib/components/add-transaction-wizard/add-transaction-dialog.svelte';
	import TransactionList from '$lib/components/transaction-list.svelte';
	import type { Transaction } from '$lib/types/transactions.types';

	let { data }: PageProps = $props();

	let isEditTransactionDialogOpen = $state(false);
	let selectedTransaction: Transaction | undefined = $state(undefined);
</script>

<svelte:head>
	<title>Budget App - {$t('transactions.title')}</title>
</svelte:head>

<section class="flex h-full w-full flex-col p-4 md:p-6">
	<div class="mb-4 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">{$t('transactions.title')}</h1>
			<p class="text-muted-foreground">{$t('transactions.description')}</p>
		</div>

		<div class="flex items-center space-x-2">
			{#if data.accounts.length > 0}
				<AddTransactionDialog
					addTransactionForm={data.addTransactionForm}
					addTransferForm={data.addTransferForm}
					createCategoryForm={data.createCategoryForm}
					categories={data.categories}
					accounts={data.accounts}
					transaction={selectedTransaction}
					bind:open={isEditTransactionDialogOpen}
				/>
			{/if}
		</div>
	</div>

	<TransactionList
		transactions={data.transactions}
		headless
		editable
		onEdit={(event) => {
			selectedTransaction = event;
			isEditTransactionDialogOpen = true;
		}}
	/>
</section>
