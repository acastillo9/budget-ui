<script lang="ts">
	import type { Account, Category, CreateTransaction, Transaction } from '$lib/types';
	import SaveTransactionModal from '$lib/components/SaveTransactionModal.svelte';
	import Calendar from '$lib/components/Calendar.svelte';
	import dayjs from 'dayjs';
	import { convertUTCDateToLocalDate } from '$lib/utils/date';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
	import { save, update, remove } from '$lib/api/transactions';

	let {
		transactions = [],
		categories = [],
		accounts = []
	} = $props<{
		transactions: Transaction[];
		categories: Category[];
		accounts: Account[];
	}>();

	let selectedTransaction = $state<Transaction | null>(null);
	let showModal = $state(false);
	let showConfirmationModal = $state(false);

	async function saveTransaction(transaction: CreateTransaction) {
		const newTransaction = transaction.id ? await update(transaction) : await save(transaction);
		newTransaction.startDate = convertUTCDateToLocalDate(dayjs(newTransaction.startDate)).toDate();
		newTransaction.endDate =
			newTransaction.endDate && convertUTCDateToLocalDate(dayjs(newTransaction.endDate)).toDate();
		const oldTransaction = transactions.find(
			(transaction: Transaction) => transaction.id === newTransaction.id
		);
		transactions = oldTransaction
			? transactions.map((transaction: Transaction) =>
					transaction.id === newTransaction.id ? newTransaction : transaction
				)
			: [newTransaction, ...transactions];
		showModal = false;
	}

	async function deleteTransaction(id: string) {
		const deletedTransaction = await remove(id);
		transactions = transactions.filter(
			(transaction: Transaction) => transaction.id !== deletedTransaction.id
		);
		showConfirmationModal = false;
	}

	async function getTransactions(date: { year: number; month: number }) {
		const response = await fetch(`/transactions?month=${date.month}&year=${date.year}`);
		transactions = await response.json();
	}

	function openEditModal(transaction: Transaction | null = null) {
		selectedTransaction = transaction;
		showModal = true;
	}

	function openDeleteConfirmationModal(transaction: Transaction) {
		selectedTransaction = transaction;
		showConfirmationModal = true;
	}
</script>

<section class="border rounded p-4">
	<h2>Transactions</h2>

	<div class="flex gap-4">
		<!-- <Calendar {transactions} on:change={(e) => getTransactions(e.detail)}></Calendar> -->
		<div>
			<button onclick={() => openEditModal()}>Add transaction</button>
			<table class="table-auto">
				<thead>
					<tr>
						<th>Description</th>
						<th>Amount</th>
						<th>Category</th>
						<th>Date</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#if !transactions.length}
						<tr>
							<td colspan="9">There is no records</td>
						</tr>
					{/if}
					{#each transactions as transaction}
						<tr>
							<td>{transaction.description}</td>
							<td>{transaction.amount}</td>
							<td>{transaction.category.name}</td>
							<td>{dayjs(transaction.startDate).format('YYYY-MM-DD')}</td>
							<td>{transaction.paid ? 'Paid' : 'Pending'}</td>
							<td>
								<div>
									<button onclick={() => openEditModal(transaction)}>Edit</button>
									<button onclick={() => openDeleteConfirmationModal(transaction)}>Delete</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>

<SaveTransactionModal
	bind:showModal
	transaction={selectedTransaction}
	{categories}
	{accounts}
	onSave={saveTransaction}
	onDelete={openDeleteConfirmationModal}
/>

<ConfirmationModal
	bind:showModal={showConfirmationModal}
	contentText="Are you sure to delete this transaction?"
	okButtonText="Delete"
	onOk={() => deleteTransaction(selectedTransaction!.id!)}
></ConfirmationModal>
