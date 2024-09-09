import type { CreateTransaction } from '$lib/types';

export async function save(transaction: CreateTransaction) {
	const response = await fetch('/transactions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(transaction)
	});
	return response.json();
}

export async function update(transaction: CreateTransaction) {
	const response = await fetch(`/transactions/${transaction.id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(transaction)
	});
	return response.json();
}

export async function remove(transactionId: string) {
	const response = await fetch(`/transactions/${transactionId}`, {
		method: 'DELETE'
	});
	return response.json();
}
