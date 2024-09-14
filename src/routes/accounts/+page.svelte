<script lang="ts">
	import type { Account, Category, Transaction } from '$lib/types';
	import Accounts from '$lib/components/Accounts.svelte';
	import { toast } from '$lib/utils/toast';
	import { browser } from '$app/environment';

	let { data } = $props<{
		data: {
			accounts: Account[];
			transactions: Transaction[];
			categories: Category[];
		};
	}>();

	if (browser && data.accountsError) {
		toast.showError(data.accountsError);
	}
</script>

<section class="w-full">
	<Accounts accounts={data.accounts} />
</section>
