<script lang="ts">
	import Modal from './Modal.svelte';
	import type { Account } from '$lib/types';
	import ButtonWithSpinner from './ButtonWithSpinner.svelte';

	let {
		showModal = $bindable(),
		account = null,
		saving = false,
		deleting = false,
		onSave,
		onDelete,
		onClose
	} = $props<{
		showModal: boolean;
		account: Account | null;
		saving: boolean;
		deleting: boolean;
		onSave(account: Account): void;
		onDelete(account: Account): void;
		onClose?(): void;
	}>();

	function saveAccount(event: SubmitEvent) {
		event.preventDefault();

		const target = event.target as HTMLFormElement;
		const formData = new FormData(target);

		const name = formData.get('name') as string | null;
		const balanceString = formData.get('balance') as string | null;
		const currencyCode = formData.get('currencyCode') as string | null;

		if (!name || !balanceString || !currencyCode) {
			return;
		}

		const balance = parseFloat(balanceString);
		if (isNaN(balance)) {
			return;
		}

		const account: Account = {
			name,
			balance,
			currencyCode
		};

		onSave(account);
	}

	function close() {
		if (onClose) {
			onClose();
		}
	}
</script>

{#snippet header()}
	<h2 class="font-bold">Account Details</h2>
{/snippet}

{#snippet body()}
	<form class="grid grid-cols-1 gap-4 sm:grid-cols-2" id="accountForm" onsubmit={saveAccount}>
		<div class="sm:col-span-2">
			<label for="name" class="mb-3 block text-base font-medium">Name</label>
			<input
				type="text"
				id="name"
				name="name"
				placeholder="Name"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				value={account?.name || ''}
			/>
		</div>
		<div>
			<label for="balance" class="mb-3 block text-base font-medium">Balance</label>
			<input
				type="number"
				step=".01"
				id="balance"
				name="balance"
				placeholder="Balance"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				value={account?.balance || 0}
			/>
		</div>
		<div>
			<label for="currency" class="mb-3 block text-base font-medium">Currency</label>
			<select
				id="currencyCode"
				name="currencyCode"
				class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
				value={account?.currencyCode || 'COP'}
			>
				<option value="COP" selected>COP</option>
				<option value="USD">USD</option>
			</select>
		</div>
	</form>
{/snippet}

{#snippet buttons()}
	<div class="flex gap-2">
		{#if account}
			<ButtonWithSpinner
				className="px-4 border-red-600 bg-red-600 hover:bg-red-500 hover:border-red-500 disabled:bg-red-400 disabled:border-red-400"
				isLoading={deleting}
				onClick={() => onDelete(account)}>Delete</ButtonWithSpinner
			>
		{/if}

		<ButtonWithSpinner className="px-4" type="submit" form="accountForm" isLoading={saving}
			>Save</ButtonWithSpinner
		>
	</div>
{/snippet}

<Modal bind:showModal {header} {body} {buttons} onClose={close}></Modal>
