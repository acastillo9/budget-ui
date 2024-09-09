<script lang="ts">
	import type { Account } from '$lib/types';
	import SaveAccountModal from '$lib/components/SaveAccountModal.svelte';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
	import { save, update, remove } from '$lib/api/accounts';

	let { accounts = [] } = $props<{ accounts: Account[] }>();

	let selectedAccount = $state<Account | null>(null);
	let showModal = $state(false);
	let showConfirmationModal = $state(false);

	async function saveAccount(account: Account) {
		const newAccount = account.id ? await update(account) : await save(account);
		const oldAccount = accounts.find((account: Account) => account.id === newAccount.id);
		accounts = oldAccount
			? accounts.map((account: Account) => (account.id === newAccount.id ? newAccount : account))
			: [newAccount, ...accounts];
		showModal = false;
		selectedAccount = null;
	}

	async function deleteAccount(accountId: string) {
		const deletedAccount = await remove(accountId);
		accounts = accounts.filter((account: Account) => account.id !== deletedAccount.id);
		showModal = false;
		showConfirmationModal = false;
		selectedAccount = null;
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

<section class="border rounded p-4">
	<h2>Accounts</h2>

	<button onclick={() => openEditModal()}>Add account</button>
	<table class="table-auto">
		<thead>
			<tr>
				<th>Name</th>
				<th>Balance</th>
				<th>Currency</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#if !accounts.length}
				<tr>
					<td colspan="3">There is no records</td>
				</tr>
			{/if}
			{#each accounts as account}
				<tr>
					<td>{account.name}</td>
					<td>{account.balance}</td>
					<td>{account.currencyCode}</td>
					<td>
						<div>
							<button onclick={() => openEditModal(account)}>Edit</button>
							<button onclick={() => openDeleteConfirmationModal(account)}>Delete</button>
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
	onSave={saveAccount}
	onDelete={openDeleteConfirmationModal}
/>

<ConfirmationModal
	bind:showModal={showConfirmationModal}
	contentText="Are you sure to delete this account?"
	okButtonText="Delete"
	onOk={() => deleteAccount(selectedAccount!.id!)}
></ConfirmationModal>
