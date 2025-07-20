<script lang="ts">
	import AccountList from '$lib/components/account-list.svelte';
	import AddAccountDialog from '$lib/components/add-account-dialog.svelte';
	import CreateTransactionDialog from '$lib/components/create-transaction-wizard/create-transaction-dialog.svelte';
	import TransactionList from '$lib/components/transaction-list.svelte';
	import { t } from 'svelte-i18n';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
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

		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<div>
				<AccountList accounts={data.accounts} />
			</div>
			<div>
				<TransactionList transactions={data.transactions} />
			</div>
		</div>
	</div>
</section>
