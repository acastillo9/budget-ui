<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { t } from 'svelte-i18n';
	import type { Transaction } from '$lib/types/transactions.types';
	import { DollarSign } from '@lucide/svelte';
	import TransactionItem from './transaction-item.svelte';

	interface Props {
		transactions: Transaction[];
	}

	let { transactions }: Props = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>{$t('transactions.recentTransactions')}</Card.Title>
		<Card.Description>{$t('transactions.recentTransactionsDescription')}</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if transactions.length === 0}
			<div class="text-muted-foreground py-8 text-center">
				<DollarSign class="h-12 w-12 mx-auto mb-4 opacity-50" />
				<p>{$t('transactions.noTransactions')}</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each transactions as transaction (transaction.id)}
					<TransactionItem {transaction} />
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
