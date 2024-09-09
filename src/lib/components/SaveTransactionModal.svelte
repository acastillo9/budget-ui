<script lang="ts">
	import Modal from './Modal.svelte';
	import type { Account, Category, CreateTransaction, Transaction } from '$lib/types';
	import dayjs from 'dayjs';
	import { convertUTCDateToLocalDate } from '$lib/utils/date';
	import Autocomplete from './Autocomplete.svelte';
	import Select from './Select.svelte';

	let {
		showModal = $bindable(),
		transaction = null,
		categories = [],
		accounts = [],
		onSave,
		onDelete,
		onClose
	} = $props<{
		showModal: boolean;
		transaction: Transaction | null;
		categories: Category[];
		accounts: Account[];
		onSave(transaction: CreateTransaction): void;
		onDelete(transaction: Transaction): void;
		onClose?(): void;
	}>();

	let categoriesFiltered: Category[] = [];

	// const activeTransaction = $state(
	// 	transaction
	// 		? {
	// 				...transaction,
	// 				amount: Math.abs(transaction.amount),
	// 				startDate: dayjs(transaction.startDate).format('YYYY-MM-DD'),
	// 				endDate: transaction.endDate && dayjs(transaction.endDate).format('YYYY-MM-DD')
	// 			}
	// 		: {
	// 				transactionType: '',
	// 				amount: 0,
	// 				startDate: dayjs().format('YYYY-MM-DD'),
	// 				endDate: '',
	// 				repeatType: 'NEVER',
	// 				description: '',
	// 				category: '',
	// 				paid: false,
	// 				account: null
	// 			}
	// );
	// const categoryId = $derived(transaction ? transaction.category.id : '');
	// const categoryName = $derived(transaction ? transaction.category.name : '');
	// const accountId = $derived(transaction ? transaction.account?.id : '');

	function saveTransaction(event: SubmitEvent) {
		event.preventDefault();

		const target = event.target as HTMLFormElement;
		const formData = new FormData(target);

		const description = formData.get('description') as string | null;
		const transactionType = formData.get('transactionType') as string | null;
		const amountString = formData.get('amount') as string | null;
		const startDateString = formData.get('startDate') as string | null;
		const endDateString = formData.get('endDate') as string | null;
		const repeatType = formData.get('repeatType') as string | null;
		const paid = formData.get('paid') === 'on';
		const account = formData.get('account') as string | null;

		if (
			!description ||
			!transactionType ||
			!amountString ||
			!startDateString ||
			!repeatType ||
			!account
		) {
			return;
		}

		const amount = parseFloat(amountString);
		if (isNaN(amount)) {
			return;
		}

		const startDate = convertUTCDateToLocalDate(dayjs(startDateString)).format();
		const endDate = endDateString
			? convertUTCDateToLocalDate(dayjs(endDateString)).format()
			: undefined;

		const transaction: CreateTransaction = {
			description,
			transactionType,
			amount,
			startDate,
			endDate,
			repeatType,
			paid: !!paid,
			account,
			category: ''
		};

		console.log(transaction);

		// onSave(transaction);
	}

	function filterCategories() {
		// categoriesFiltered = categories
		// 	.filter((category: Category) => category.name.toLowerCase().includes(categoryName.toLowerCase()))
		// 	.slice(0, 5);
	}

	function selectCategory(category: Category) {
		// categoryId = category.id;
		// categoryName = category.name;
		// categoriesFiltered = [];
	}

	async function addCategory(categoryName: string) {
		const response = await fetch('/categories', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: categoryName })
		});
		const newCategory = await response.json();
		categories.push(newCategory);
		selectCategory(newCategory);
	}

	function close() {
		if (onClose) {
			onClose();
		}
	}
</script>

{#snippet header()}
	<h2 class="font-bold">Transaction Details</h2>
{/snippet}

{#snippet body()}
	<form
		class="grid grid-cols-1 gap-4 sm:grid-cols-2"
		id="transactionForm"
		onsubmit={saveTransaction}
	>
		<div class="sm:col-span-2">
			<label for="description" class="mb-3 block text-base font-medium">Description</label>
			<input
				type="text"
				id="description"
				name="description"
				placeholder="Description"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				value={transaction?.description || ''}
			/>
		</div>
		<div>
			<label for="type" class="mb-3 block text-base font-medium">Type</label>
			<select
				id="transactionType"
				name="transactionType"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				value={transaction?.transactionType || ''}
			>
				<option value="" selected>Choose a type</option>
				<option value="INCOME">Income</option>
				<option value="EXPENSE">Expense</option>
			</select>
		</div>
		<div>
			<label for="amount" class="mb-3 block text-base font-medium">Amount</label>
			<input
				type="number"
				step=".01"
				id="amount"
				name="amount"
				placeholder="Amount"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				value={transaction?.amount || 0}
			/>
		</div>
		<div>
			<label for="startDate" class="mb-3 block text-base font-medium">Start Date</label>
			<input
				type="date"
				id="startDate"
				name="startDate"
				placeholder="Start Date"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				value={transaction
					? dayjs(transaction.startDate).format('YYYY-MM-DD')
					: dayjs().format('YYYY-MM-DD')}
			/>
		</div>
		<div>
			<label for="endDate" class="mb-3 block text-base font-medium">End Date</label>
			<input
				type="date"
				id="endDate"
				name="endDate"
				placeholder="End Date"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				value={transaction?.endDate ? dayjs(transaction.endDate).format('YYYY-MM-DD') : ''}
			/>
		</div>
		<div>
			<label for="repeatType" class="mb-3 block text-base font-medium">Repeat</label>
			<select
				id="repeatType"
				name="repeatType"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				value={transaction?.repeatType || 'NEVER'}
			>
				<option value="NEVER" selected>Never</option>
				<option value="DAILY">Daily</option>
				<option value="WEEKLY">Weekly</option>
				<option value="BIWEEKLY">Biweekly</option>
				<option value="MONTHLY">Monthly</option>
				<option value="YEARLY">Yearly</option>
			</select>
		</div>
		<div class="sm:col-span-2">
			<label for="category" class="mb-3 block text-base font-medium">Category</label>
			<Autocomplete
				id="category"
				name="category"
				value={transaction?.category?.id || null}
				options={categories.map((category: Category) => ({
					value: category.id,
					label: category.name
				}))}
			></Autocomplete>
		</div>
		<div class="sm:col-span-2">
			<label for="account" class="mb-3 block text-base font-medium">Account</label>
			<Select
				id="account"
				name="account"
				value={transaction?.account?.id || ''}
				options={accounts.map((account: Account) => ({
					value: account.id,
					label: account.name
				}))}
			></Select>
		</div>
		<div>
			<input type="checkbox" id="paid" name="paid" checked={!!transaction?.paid} />
			<label for="paid" class="ml-2 text-base font-medium">is paid?</label>
		</div>
	</form>
{/snippet}

{#snippet buttons()}
	<div>
		{#if transaction}
			<button
				class="py-2 px-4 bg-red-500 text-white rounded-lg border"
				type="button"
				onclick={() => onDelete(transaction)}
			>
				Delete
			</button>
		{/if}

		<button
			class="py-2 px-4 bg-black text-white rounded-lg border"
			type="submit"
			form="transactionForm"
		>
			Save
		</button>
	</div>
{/snippet}

<Modal bind:showModal {header} {body} {buttons} onClose={close}></Modal>
