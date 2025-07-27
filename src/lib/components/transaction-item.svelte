<script lang="ts">
	import { formatCurrencyWithSymbol } from '$lib/utils/currency';
	import { ArrowDownLeft, ArrowUpRight, Edit, Trash2 } from '@lucide/svelte';
	import CategoryBadge from './category-badge.svelte';
	import Button from './ui/button/button.svelte';
	import { t } from 'svelte-i18n';
	import { getUserContext } from '$lib/context';
	import Badge from './ui/badge/badge.svelte';

	let { transaction, editable = false, onEdit, onDelete } = $props();
	let isIncome = $derived(transaction.amount > 0);
	let description = $derived.by(() => {
		if (transaction.isTransfer) {
			const descriptionTranslation =
				transaction.amount < 0
					? 'transactions.descriptionTransferTo'
					: 'transactions.descriptionTransferFrom';
			return $t(descriptionTranslation, {
				values: {
					account: transaction.transfer?.account.name || $t('accounts.deletedAccount'),
					description: transaction.transfer?.description || '--'
				}
			});
		} else {
			return transaction.description;
		}
	});

	const userState = getUserContext();
</script>

<div class="flex items-center justify-between gap-4 border-b py-3 last:border-0">
	<div class="flex w-full items-center gap-4">
		<div class={`rounded-full p-2 ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
			{#if isIncome}
				<ArrowUpRight class="h-4 w-4 text-green-600" />
			{:else}
				<ArrowDownLeft class="h-4 w-4 text-red-600" />
			{/if}
		</div>

		<div
			class="flex w-full flex-col items-start gap-2 md:flex-row md:items-center md:justify-between"
		>
			<div class="flex flex-col gap-1">
				<p class="font-medium">{description}</p>
				<div class="flex flex-col gap-1">
					<Badge>
						{transaction.account.name}
					</Badge>
					<div class="flex gap-1">
						<Badge variant="outline">
							{new Date(transaction.date).toLocaleDateString()}
						</Badge>
						{#if transaction.category}
							<CategoryBadge category={transaction.category} size="sm" />
						{/if}
					</div>
				</div>
			</div>

			<p class={`font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
				{#if transaction.account.currencyCode !== userState.user?.currencyCode}
					<span>{transaction.account.currencyCode}</span>
				{/if}
				{formatCurrencyWithSymbol(transaction.amount, transaction.account.currencyCode)}
			</p>
		</div>
	</div>
	<div class="flex items-center gap-2">
		{#if editable}
			<div class="flex items-center gap-2">
				{#if !transaction.isTransfer || (transaction.isTransfer && transaction.transfer)}
					<Button variant="ghost" size="icon" onclick={onEdit}>
						<Edit class="h-4 w-4" />
					</Button>
				{/if}
				<Button
					variant="ghost"
					size="icon"
					onclick={onDelete}
					class="text-destructive hover:text-destructive"
				>
					<Trash2 class="h-4 w-4" />
				</Button>
			</div>
		{/if}
	</div>
</div>
