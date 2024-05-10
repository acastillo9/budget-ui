import { API_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request, locals, params }: RequestEvent) => {
	const updatedTransaction = await request.json();
	const response = await fetch(`${API_URL}/transactions/${params.slug}`, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${locals!.user!.access_token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(updatedTransaction)
	});
	const data = await response.json();
	return json(data);
};

export const DELETE: RequestHandler = async ({ locals, params }: RequestEvent) => {
	const response = await fetch(`${API_URL}/transactions/${params.slug}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${locals!.user!.access_token}`,
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();
	return json(data);
};
