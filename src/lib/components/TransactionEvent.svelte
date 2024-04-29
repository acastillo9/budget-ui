<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { TransactionType, type Transaction } from './types';

	export let transactionEvent: Transaction;

	const dispatch = createEventDispatcher();
</script>

<button
	class={`w-4 h-4 rounded-full border ${transactionEvent.transactionType === TransactionType.INCOME ? 'bg-teal-200 border-teal-300' : ''} ${transactionEvent.transactionType === TransactionType.EXPENSE ? 'bg-yellow-200 border-yellow-300' : ''} ${transactionEvent.paid && 'bg-lime-200 border-lime-300'}`}
	title={transactionEvent.description}
	on:click={() => dispatch('edit', transactionEvent)}
></button>
