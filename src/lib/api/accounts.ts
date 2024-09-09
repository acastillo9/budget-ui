import type { Account } from '$lib/types';

export async function save(account: Account) {
	const response = await fetch('/accounts', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(account)
	});
	return response.json();
}

export async function update(account: Account) {
	const response = await fetch(`/accounts/${account.id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(account)
	});
	return response.json();
}

export async function remove(accountId: string) {
	const response = await fetch(`/accounts/${accountId}`, {
		method: 'DELETE'
	});
	return response.json();
}
