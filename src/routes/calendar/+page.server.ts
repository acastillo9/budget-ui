import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const responseTransactions = await fetch(`${API_URL}/transactions`, {
		headers: {
			Authorization: `Bearer ${locals!.user!.access_token}`
		}
	});
	const transactions = await responseTransactions.json();

	const responseCategories = await fetch(`${API_URL}/categories`, {
		headers: {
			Authorization: `Bearer ${locals!.user!.access_token}`
		}
	});
	const categories = await responseCategories.json();

	return {
		transactions,
		categories
	};
};
