import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const allowed = ['/login', '/register'];

	if (!allowed.includes(url.pathname) && !locals.user) {
		throw redirect(302, '/login');
	}

	if (url.pathname === '/') {
		throw redirect(302, '/dashboard');
	}

	return {
		user: locals.user
	};
};
