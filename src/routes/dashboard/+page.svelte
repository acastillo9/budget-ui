<script lang="ts">
	import AccountList from '$lib/components/account-list.svelte';
	import AddAccountDialog from '$lib/components/add-account-dialog.svelte';
	import AddTransactionDialog from '$lib/components/add-transaction-wizard/add-transaction-dialog.svelte';
	import { t } from 'svelte-i18n';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Budget App - {$t('dashboard.title')}</title>
</svelte:head>

<section class="flex h-full w-full flex-col p-4 md:p-6">
	<div class="mb-4 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">{$t('dashboard.title')}</h1>
			<p class="text-muted-foreground">{$t('dashboard.description')}</p>
		</div>

		<div class="flex items-center space-x-2">
			<AddAccountDialog data={data.addAccountForm} />
			{#if data.accounts.length > 0}
				<AddTransactionDialog
					addTransactionForm={data.addTransactionForm}
          addTransferForm={data.addTransferForm}
					createCategoryForm={data.createCategoryForm}
					categories={data.categories}
          accounts={data.accounts}
				/>
			{/if}
		</div>
	</div>

	<AccountList accounts={data.accounts} />
</section>
