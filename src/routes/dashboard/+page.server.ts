import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const month = new Date().getMonth() + 1;
	const year = new Date().getFullYear();
	const responseTransactions = await fetch(`${API_URL}/transactions?month=${month}&year=${year}`);
	const transactions = await responseTransactions.json();

	const responseCategories = await fetch(`${API_URL}/categories`);
	const categories = await responseCategories.json();

	const responseAccounts = await fetch(`${API_URL}/accounts`);
	const accounts = await responseAccounts.json();

	return {
		transactions,
		categories,
		accounts
	};
};
