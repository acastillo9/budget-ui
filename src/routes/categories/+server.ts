import type { RequestEvent, RequestHandler } from './$types';
import { API_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, fetch }: RequestEvent) => {
	const newCategory = await request.json();
	const response = await fetch(`${API_URL}/categories`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newCategory)
	});
	const data = await response.json();
	return json(data);
};
