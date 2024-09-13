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

export async function update(id: string, account: Account) {
	const response = await fetch(`/accounts/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(account)
	});
	return response.json();
}

export async function remove(id: string) {
	const response = await fetch(`/accounts/${id}`, {
		method: 'DELETE'
	});
	return response.json();
}
