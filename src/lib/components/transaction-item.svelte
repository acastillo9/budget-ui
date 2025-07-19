<script lang="ts">
	import { formatCurrencyWithSymbol } from '$lib/utils/currency';
	import { ArrowDownLeft, ArrowUpRight, Edit, Trash2 } from '@lucide/svelte';
	import CategoryBadge from './category-badge.svelte';
	import Button from './ui/button/button.svelte';
	import { t } from 'svelte-i18n';

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
					account: transaction.transfer.account.name,
					description: transaction.transfer.description
				}
			});
		} else {
			return transaction.description;
		}
	});
</script>

<div class="flex items-center justify-between border-b py-3 last:border-0">
	<div class="flex items-center gap-3">
		<div class={`rounded-full p-2 ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
			{#if isIncome}
				<ArrowUpRight class="h-4 w-4 text-green-600" />
			{:else}
				<ArrowDownLeft class="h-4 w-4 text-red-600" />
			{/if}
		</div>
		<div>
			<p class="font-medium">{description}</p>
			<div class="text-muted-foreground flex items-center gap-2 text-xs">
				<span>{transaction.account.name}</span>
				{#if transaction.category}
					<span>•</span>
					<CategoryBadge category={transaction.category} size="sm" />
				{/if}
				<span>•</span>
				<span>{new Date(transaction.date).toLocaleDateString()}</span>
			</div>
		</div>
	</div>
	<div class="flex items-center gap-2">
		<div class="text-right">
			<p class={`font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
				{formatCurrencyWithSymbol(transaction.amount, transaction.account.currencyCode)}
			</p>
		</div>
		{#if editable}
			<div class="flex items-center gap-2">
				<Button variant="ghost" size="icon" onclick={onEdit}>
					<Edit class="h-4 w-4" />
				</Button>
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
