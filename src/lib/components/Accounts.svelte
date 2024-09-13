<script lang="ts">
	import type { Account } from '$lib/types';
	import SaveAccountModal from '$lib/components/SaveAccountModal.svelte';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
	import { save, update, remove } from '$lib/api/accounts';
	import FaPen from '$lib/icons/FaPen.svelte';
	import FaTrash from '$lib/icons/FaTrash.svelte';
	import { toast } from '$lib/utils/toast';

	let { accounts = [] } = $props<{ accounts: Account[] }>();

	let selectedAccount = $state<Account | null>(null);
	let showModal = $state(false);
	let showConfirmationModal = $state(false);
	let saving = $state(false);
	let deleting = $state(false);

	async function saveAccount(account: Account) {
		saving = true;
		try {
			const newAccount = selectedAccount
				? await update(selectedAccount.id!, account)
				: await save(account);
			const oldAccount = accounts.find((account: Account) => account.id === newAccount.id);
			accounts = oldAccount
				? accounts.map((account: Account) => (account.id === newAccount.id ? newAccount : account))
				: [newAccount, ...accounts];
		} catch (error) {
			toast.showError('Failed to save account');
		} finally {
			showModal = false;
			selectedAccount = null;
			saving = false;
		}
	}

	async function deleteAccount(accountId: string) {
		deleting = true;
		try {
			const deletedAccount = await remove(accountId);
			accounts = accounts.filter((account: Account) => account.id !== deletedAccount.id);
		} catch (error) {
			toast.showError('Failed to delete account');
		} finally {
			showModal = false;
			showConfirmationModal = false;
			selectedAccount = null;
			deleting = false;
		}
	}

	function openEditModal(account: Account | null = null) {
		selectedAccount = account;
		showModal = true;
	}

	function openDeleteConfirmationModal(account: Account) {
		selectedAccount = account;
		showConfirmationModal = true;
	}
</script>

<section class="border rounded p-4 shadow bg-white">
	<h2 class="font-bold text-xl mb-4 border-b py-4">Accounts</h2>

	<button
		class="py-2 px-4 bg-black text-white rounded-lg border mb-4"
		onclick={() => openEditModal()}>Add account</button
	>

	<table class="table w-full">
		<thead class="table-header-group">
			<tr class="table-row">
				<th class="table-cell text-left border-b py-3">Name</th>
				<th class="table-cell text-left border-b py-3">Balance</th>
				<th class="table-cell text-left border-b py-3">Currency</th>
				<th class="table-cell text-left border-b py-3">Actions</th>
			</tr>
		</thead>
		<tbody class="table-row-group">
			{#if !accounts.length}
				<tr class="table-row">
					<td colspan="3">There is no records</td>
				</tr>
			{/if}
			{#each accounts as account}
				<tr class="table-row">
					<td class="table-cell py-3">{account.name}</td>
					<td class="table-cell py-3">{account.balance}</td>
					<td class="table-cell py-3">{account.currencyCode}</td>
					<td class="table-cell py-3">
						<div class="flex gap-3">
							<button onclick={() => openEditModal(account)}><FaPen /></button>
							<button class="text-red-600" onclick={() => openDeleteConfirmationModal(account)}
								><FaTrash /></button
							>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<SaveAccountModal
	bind:showModal
	account={selectedAccount}
	{saving}
	onSave={saveAccount}
	onDelete={openDeleteConfirmationModal}
/>

<ConfirmationModal
	bind:showModal={showConfirmationModal}
	contentText="Are you sure to delete this account?"
	isLoading={deleting}
	okButtonText="Delete"
	onOk={() => deleteAccount(selectedAccount!.id!)}
></ConfirmationModal>
