<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Modal from './Modal.svelte';
	import type { Category, Transaction } from '$lib/types';
	import dayjs from 'dayjs';
	import { convertUTCDateToLocalDate } from '$lib/utils/date';

	export let showModal: boolean;
	export let transaction: Transaction | null = null;

	const dispatch = createEventDispatcher();

	let categories: Category[] = [];
	let categoriesFiltered: Category[] = [];
	let showConfirmationModal = false;

	$: activeTransaction = transaction
		? {
				...transaction,
				startDate: dayjs(transaction.startDate).format('YYYY-MM-DD'),
				endDate: transaction.endDate && dayjs(transaction.endDate).format('YYYY-MM-DD')
			}
		: {
				transactionType: '',
				amount: 0,
				currencyCode: 'COP',
				startDate: dayjs().format('YYYY-MM-DD'),
				endDate: '',
				repeatType: 'NEVER',
				description: '',
				category: '',
				paid: false
			};
	$: categoryId = transaction ? transaction.category.id : '';
	$: categoryName = transaction ? transaction.category.name : '';

	function saveTransaction() {
		const newTransaction = {
			...activeTransaction,
			startDate: convertUTCDateToLocalDate(dayjs(activeTransaction.startDate)).format(),
			endDate:
				activeTransaction.endDate &&
				convertUTCDateToLocalDate(dayjs(activeTransaction.endDate)).format(),
			category: categoryId
		};
		dispatch('save', newTransaction);
	}

	function close() {
		activeTransaction = {
			transactionType: '',
			amount: 0,
			currencyCode: 'COP',
			startDate: dayjs().format('YYYY-MM-DD'),
			endDate: '',
			repeatType: 'NEVER',
			description: '',
			category: '',
			paid: false
		};
		categoryId = '';
		categoryName = '';
		dispatch('close');
	}

	function filterCategories() {
		categoriesFiltered = categories
			.filter((category) => category.name.toLowerCase().includes(categoryName.toLowerCase()))
			.slice(0, 5);
	}

	function selectCategory(category: Category) {
		categoryId = category.id;
		categoryName = category.name;
		categoriesFiltered = [];
	}

	async function addCategory(categoryName: string) {
		const response = await fetch(`http://localhost:3000/categories`, {
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

	function deleteTransaction() {
		dispatch('delete', transaction!.id);
		showConfirmationModal = false;
	}

	onMount(async () => {
		// const responseCategories = await fetch(`http://localhost:3000/categories`);
		// categories = await responseCategories.json();
	});
</script>

<Modal bind:showModal on:close={close}>
	<h2 slot="header" class="font-bold">Transaction Details</h2>
	<form
		class="grid grid-cols-2 gap-4"
		id="transactionForm"
		on:submit|preventDefault={saveTransaction}
	>
		<div class="col-span-2">
			<label for="description" class="mb-3 block text-base font-medium">Description</label>
			<input
				type="text"
				id="description"
				name="description"
				placeholder="Description"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				bind:value={activeTransaction.description}
			/>
		</div>
		<div>
			<label for="type" class="mb-3 block text-base font-medium">Type</label>
			<select
				id="transactionType"
				name="transactionType"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				bind:value={activeTransaction.transactionType}
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
				bind:value={activeTransaction.amount}
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
				bind:value={activeTransaction.startDate}
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
				bind:value={activeTransaction.endDate}
			/>
		</div>
		<div>
			<label for="repeatType" class="mb-3 block text-base font-medium">Repeat</label>
			<select
				id="repeatType"
				name="repeatType"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				bind:value={activeTransaction.repeatType}
			>
				<option value="NEVER" selected>Never</option>
				<option value="DAILY">Daily</option>
				<option value="WEEKLY">Weekly</option>
				<option value="BIWEEKLY">Biweekly</option>
				<option value="MONTHLY">Monthly</option>
				<option value="YEARLY">Yearly</option>
			</select>
		</div>
		<div>
			<label for="currency" class="mb-3 block text-base font-medium">Currency</label>
			<select
				id="currencyCode"
				name="currencyCode"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				bind:value={activeTransaction.currencyCode}
			>
				<option value="COP" selected>COP</option>
				<option value="USD">USD</option>
			</select>
		</div>
		<div class="col-span-2">
			<label for="category" class="mb-3 block text-base font-medium">Category</label>
			<input
				type="text"
				id="category"
				name="category"
				placeholder="Category"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				bind:value={categoryName}
				on:focus={filterCategories}
				on:input={filterCategories}
				on:blur={() => setTimeout(() => (categoriesFiltered = []), 100)}
			/>
			<div class="relative">
				{#if categoriesFiltered.length > 0}
					<ul class="absolute w-full rounded-md border">
						{#each categoriesFiltered as category}
							<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
							<li
								class="bg-white border-b px-4 py-2 cursor-pointer hover:bg-neutral-100"
								on:click={() => selectCategory(category)}
							>
								{category.name}
							</li>
						{/each}
					</ul>
				{:else if !categoryId && categoryName}
					<ul class="absolute w-full rounded-md border">
						<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
						<li
							class="bg-white border-b px-4 py-2 cursor-pointer hover:bg-neutral-100"
							on:click={() => addCategory(categoryName)}
						>
							Add {categoryName}
						</li>
					</ul>
				{/if}
			</div>
		</div>
		<div>
			<input type="checkbox" id="paid" name="paid" bind:checked={activeTransaction.paid} />
			<label for="paid" class="ml-2 text-base font-medium">is paid?</label>
		</div>
	</form>
	<div slot="buttons">
		{#if transaction}
			<button
				class="py-2 px-4 rounded-lg border border-red-500 text-red-500"
				on:click={() => (showConfirmationModal = true)}
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
</Modal>
<Modal bind:showModal={showConfirmationModal}>
	<h2 slot="header" class="font-bold">Confirmation Modal</h2>
	<p>Are you sure to delete this transaction?</p>
	<button
		slot="buttons"
		class="py-2 px-4 rounded-lg border border-red-500 text-white bg-red-500"
		on:click={deleteTransaction}
	>
		Delete
	</button>
</Modal>
