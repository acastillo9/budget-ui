<script lang="ts">
	import type { Account, Category, Transaction } from '$lib/types';
	// import dayjs from 'dayjs';
	// import { convertUTCDateToLocalDate } from '$lib/utils/date';
	import Accounts from '$lib/components/Accounts.svelte';
	import { toast } from '$lib/utils/toast';
	import { browser } from '$app/environment';
	// import Transactions from '$lib/components/Transactions.svelte';

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

	// let transactions: Transaction[] = data.transactions.map((transaction: Transaction) => {
	// 	transaction.startDate = convertUTCDateToLocalDate(dayjs(transaction.startDate)).toDate();
	// 	transaction.endDate =
	// 		transaction.endDate && convertUTCDateToLocalDate(dayjs(transaction.endDate)).toDate();
	// 	return transaction;
	// });
</script>

<section class="w-full">
	<Accounts accounts={data.accounts} />
	<!-- <Transactions {transactions} accounts={data.accounts} categories={data.categories} /> -->
</section>
