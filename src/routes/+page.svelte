<script lang="ts">
	import { onMount, type ComponentEvents } from 'svelte';
	import Calendar from '../lib/components/Calendar.svelte';
	import Modal from '../lib/components/Modal.svelte';
	import type { Category, Transaction } from '../lib/components/types';
	import dayjs from 'dayjs';

	let transactions: Transaction[] = [];
	let activeTransaction: Transaction | null = null;
	let categories: Category[] = [];
	let showModal = false;
	let showConfirmationModal = false;
	let categoriesFiltered: Category[] = [];

	let categoryId: string = '';
	let categoryName: string = '';

	$: startDate = activeTransaction
		? dayjs(activeTransaction.startDate).format('YYYY-MM-DD')
		: dayjs().format('YYYY-MM-DD');

	function editTransactionHandler(event: ComponentEvents<Calendar>['edit']) {
		console.log(event.detail);
		activeTransaction = event.detail;
		categoryId = activeTransaction?.category.id ?? '';
		categoryName = activeTransaction?.category.name ?? '';
		showModal = true;
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

	function clean() {
		activeTransaction = null;
		categoryId = '';
		categoryName = '';
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

	async function saveTransaction(event: SubmitEvent) {
		const formData = new FormData(event.target as HTMLFormElement);
		const data = Object.fromEntries(formData);
		data.category = categoryId;

		const response = await fetch(
			`http://localhost:3000/transactions${activeTransaction ? `/${activeTransaction.id}` : ''}`,
			{
				method: activeTransaction ? 'PATCH' : 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			}
		);
		const newTransaction = await response.json();
		newTransaction.amount = Math.abs(newTransaction.amount);
		newTransaction.startDate = new Date(newTransaction.startDate);
		newTransaction.endDate = newTransaction.endDate ? new Date(newTransaction.endDate) : undefined;
		transactions = [
			...transactions.filter((transaction) => transaction.id !== newTransaction.id),
			newTransaction
		];
		showModal = false;
	}

	async function deleteTransaction() {
		await fetch(`http://localhost:3000/transactions/${activeTransaction!.id}`, {
			method: 'DELETE'
		});
		transactions = transactions.filter((transaction) => transaction.id !== activeTransaction!.id);
		showModal = false;
		showConfirmationModal = false;
	}

	onMount(async () => {
		const responseTransactions = await fetch(`http://localhost:3000/transactions`);
		transactions = await responseTransactions.json();
		transactions.forEach((transaction) => {
			transaction.amount = Math.abs(transaction.amount);
			transaction.startDate = new Date(transaction.startDate);
			transaction.endDate = transaction.endDate ? new Date(transaction.endDate) : undefined;
		});
		const responseCategories = await fetch(`http://localhost:3000/categories`);
		categories = await responseCategories.json();
	});
</script>

<svelte:head>
	<title>Budget</title>
	<meta name="description" content="Budget App" />
</svelte:head>

<button on:click={() => (showModal = true)}>Create New</button>

<section>
	<Calendar transactionsEvents={transactions} on:edit={editTransactionHandler}></Calendar>
</section>

<Modal bind:showModal on:close={clean}>
	<h2 slot="header" class="font-bold">Transaction Details</h2>
	<p>{activeTransaction?.description ?? 'empty'}</p>
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
				value={activeTransaction?.description ?? ''}
			/>
		</div>
		<div>
			<label for="type" class="mb-3 block text-base font-medium">Type</label>
			<select
				id="transactionType"
				name="transactionType"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				value={activeTransaction?.transactionType ?? ''}
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
				id="amount"
				name="amount"
				placeholder="Amount"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				value={activeTransaction?.amount ?? 0}
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
				value={startDate}
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
			/>
		</div>
		<div>
			<label for="repeatType" class="mb-3 block text-base font-medium">Repeat</label>
			<select
				id="repeatType"
				name="repeatType"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				value={activeTransaction?.repeatType ?? 'NEVER'}
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
				value={activeTransaction?.currencyCode ?? 'COP'}
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
							<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions a11y-autofocus -->
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
						<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions a11y-autofocus -->
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
	</form>
	<div slot="buttons">
		{#if activeTransaction}
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
