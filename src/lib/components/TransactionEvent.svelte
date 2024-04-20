<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { TransactionType, type Transaction } from './types';

	export let transactionEvent: Transaction;

	const dispatch = createEventDispatcher();
</script>

<button
	class={`w-4 h-4 rounded-full border ${transactionEvent.transactionType === TransactionType.INCOME ? 'bg-teal-400 border-teal-500' : ''} ${transactionEvent.transactionType === TransactionType.EXPENSE ? 'bg-yellow-400 border-yellow-500' : ''}`}
	title={transactionEvent.description}
	on:click={() => dispatch('edit', transactionEvent)}
></button>
