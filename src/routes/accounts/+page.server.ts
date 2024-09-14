import { API_URL } from '$env/static/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	let accounts = [];
	let accountsError = '';
	const responseAccounts = await fetch(`${API_URL}/accounts`);
	if (!responseAccounts.ok) {
		accountsError = 'Failed to load accounts';
	}
	accounts = await responseAccounts.json();

	return {
		accounts,
		accountsError
	};
};
