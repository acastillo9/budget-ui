import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const responseTransactions = await fetch(`${API_URL}/transactions`);
	const transactions = await responseTransactions.json();

	const responseCategories = await fetch(`${API_URL}/categories`);
	const categories = await responseCategories.json();

	return {
		transactions,
		categories
	};
};
