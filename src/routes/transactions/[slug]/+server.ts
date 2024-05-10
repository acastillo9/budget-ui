import { API_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request, params, fetch }: RequestEvent) => {
	const updatedTransaction = await request.json();
	const response = await fetch(`${API_URL}/transactions/${params.slug}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(updatedTransaction)
	});
	const data = await response.json();
	return json(data);
};

export const DELETE: RequestHandler = async ({ params, fetch }: RequestEvent) => {
	const response = await fetch(`${API_URL}/transactions/${params.slug}`, {
		method: 'DELETE'
	});
	const data = await response.json();
	return json(data);
};
