import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, locals }) => {
	locals.user = undefined;
	cookies.delete('AuthorizationToken', { path: '/' });
	throw redirect(303, '/login');
};
