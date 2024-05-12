<script lang="ts">
	import type { Account } from '$lib/types';
	import { formatNumber } from '$lib/utils/number';
	import { onMount } from 'svelte';

	let account: Account | null = null;
	$: account = null;

	async function load() {
		const response = await fetch('/accounts');
		account = await response.json();
	}

	onMount(() => {
		load();
	});
</script>

<section>
	<div class="flex gap-4 justify-end">
		{#if account}
			<div class="flex flex-col border-r pr-4">
				<h2 class="font-medium">Current Balance</h2>
				<span class={`text-2xl font-bold ${account.balance < 0 ? 'text-red-500' : ''}`}
					>${formatNumber(account.balance)}</span
				>
			</div>
			<div class="flex flex-col">
				<h2 class="font-medium">Projected Balance</h2>
				<span class={`text-2xl font-bold ${account.monthBalance < 0 ? 'text-red-500' : ''}`}
					>${formatNumber(account.monthBalance)}</span
				>
			</div>
		{/if}
	</div>
</section>
