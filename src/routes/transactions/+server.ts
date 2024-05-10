import { API_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, fetch }: RequestEvent) => {
	const newTransaction = await request.json();
	const response = await fetch(`${API_URL}/transactions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newTransaction)
	});
	const data = await response.json();
	return json(data);
};
