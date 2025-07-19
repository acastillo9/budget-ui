<script lang="ts">
	import type { PageProps } from '../$types';
	import { t } from 'svelte-i18n';
	import CreateTransactionDialog from '$lib/components/create-transaction-wizard/create-transaction-dialog.svelte';
	import TransactionList from '$lib/components/transaction-list.svelte';
	import type { Transaction } from '$lib/types/transactions.types';
	import ConfirmationDialog from '$lib/components/confirmation-dialog.svelte';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';

	let { data }: PageProps = $props();

	let isEditTransactionDialogOpen = $state(false);
	let selectedTransaction: Transaction | undefined = $state(undefined);

	let confirmationDialog = $state({
		open: false,
		loading: false,
		title: '',
		description: '',
		onConfirm: () => {}
	});

	const confirmDeleteTransaction = (transaction: Transaction) => {
		confirmationDialog = {
			open: true,
			loading: false,
			title: $t('transactions.deleteTransactionTitle'),
			description: $t('transactions.deleteTransactionDescription', {
				values: { description: transaction.description }
			}),
			onConfirm: () => {
				deleteTransaction(transaction);
			}
		};
	};

	async function deleteTransaction(transaction: Transaction) {
		confirmationDialog.loading = true;
		try {
			const uri = transaction.isTransfer
				? `/api/transactions/transfer/${transaction.id}`
				: `/api/transactions/${transaction.id}`;
			const response = await fetch(uri, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error('Failed to delete transaction');
			}

			confirmationDialog = {
				open: false,
				loading: false,
				title: '',
				description: '',
				onConfirm: () => {}
			};

			toast.success($t('transactions.deleteTransactionSuccess'));

			invalidateAll();
		} catch {
			toast.error($t('transactions.deleteTransactionError'));
		}
	}
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
				<CreateTransactionDialog
					addTransactionForm={data.addTransactionForm}
					addTransferForm={data.addTransferForm}
					createCategoryForm={data.createCategoryForm}
					categories={data.categories}
					accounts={data.accounts}
					transaction={selectedTransaction}
					bind:open={isEditTransactionDialogOpen}
					onClose={() => {
						selectedTransaction = undefined;
					}}
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
		onDelete={confirmDeleteTransaction}
	/>
</section>

<ConfirmationDialog
	open={confirmationDialog.open}
	onOpenChange={(open: boolean) => (confirmationDialog.open = open)}
	title={confirmationDialog.title}
	description={confirmationDialog.description}
	confirmText={$t('common.delete')}
	cancelText={$t('common.cancel')}
	variant="destructive"
	onConfirm={confirmationDialog.onConfirm}
	loading={confirmationDialog.loading}
/>
