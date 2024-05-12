<script lang="ts">
	import Calendar from '$lib/components/Calendar.svelte';
	import Balance from '$lib/components/Balance.svelte';
	import type { Category, Transaction } from '$lib/types';
	import SaveTransactionModal from '$lib/components/SaveTransactionModal.svelte';
	import dayjs from 'dayjs';
	import { convertUTCDateToLocalDate } from '$lib/utils/date';

	export let data: { transactions: Transaction[]; categories: Category[] };

	let transactions: Transaction[] = [];
	let activeTransaction: Transaction | null = null;
	let showModal = false;

	function editTransaction(transaction: Transaction) {
		activeTransaction = transaction;
		showModal = true;
	}

	function closeModal() {
		activeTransaction = null;
		showModal = false;
	}

	async function saveTransaction(transaction: Transaction) {
		const response = await fetch(`/transactions${transaction.id ? `/${transaction.id}` : ''}`, {
			method: transaction.id ? 'PATCH' : 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(transaction)
		});
		const newTransaction = await response.json();
		newTransaction.amount = Math.abs(newTransaction.amount);
		newTransaction.startDate = convertUTCDateToLocalDate(dayjs(newTransaction.startDate)).toDate();
		newTransaction.endDate =
			newTransaction.endDate && convertUTCDateToLocalDate(dayjs(newTransaction.endDate)).toDate();
		transactions = [
			...transactions.filter((transaction) => transaction.id !== newTransaction.id),
			newTransaction
		];
		closeModal();
	}

	async function deleteTransaction(id: string) {
		const response = await fetch(`/transactions/${id}`, {
			method: 'DELETE'
		});
		const deletedTransaction = await response.json();
		transactions = transactions.filter((transaction) => transaction.id !== deletedTransaction.id);
		closeModal();
	}

	transactions = data.transactions;
	transactions.forEach((transaction) => {
		transaction.amount = Math.abs(transaction.amount);
		transaction.startDate = convertUTCDateToLocalDate(dayjs(transaction.startDate)).toDate();
		transaction.endDate =
			transaction.endDate && convertUTCDateToLocalDate(dayjs(transaction.endDate)).toDate();
	});
</script>

<section class="w-full">
	<Balance />
	<button on:click={() => (showModal = true)}>Create New</button>
	<Calendar {transactions} on:edit={(e) => editTransaction(e.detail)}></Calendar>
</section>

<SaveTransactionModal
	transaction={activeTransaction}
	categories={data.categories}
	{showModal}
	on:save={(e) => saveTransaction(e.detail)}
	on:delete={(e) => deleteTransaction(e.detail)}
	on:close={closeModal}
/>
