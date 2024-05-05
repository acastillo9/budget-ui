<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { TransactionType, type Transaction } from './types';

	export let transactionEvent: Transaction;

	const dispatch = createEventDispatcher();

	function getEventColor(type: string, paid: boolean) {
		if (type === TransactionType.INCOME) {
			if (paid) {
				return 'bg-lime-200 border-lime-300';
			}
			return 'bg-teal-200 border-teal-300';
		}
		if (type === TransactionType.EXPENSE) {
			if (paid) {
				return 'bg-red-200 border-red-300';
			}
			return 'bg-yellow-200 border-yellow-300';
		}
	}

	$: eventColor = getEventColor(transactionEvent.transactionType, transactionEvent.paid);
</script>

<button
	class={`w-4 h-4 rounded-full border ${eventColor}`}
	title={transactionEvent.description}
	on:click={() => dispatch('edit', transactionEvent)}
></button>
