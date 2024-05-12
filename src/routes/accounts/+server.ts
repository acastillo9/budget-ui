import { API_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, locals }) => {
	const response = await fetch(`${API_URL}/accounts/${locals.user?.account}`);
	const data = await response.json();
	return json(data);
};
