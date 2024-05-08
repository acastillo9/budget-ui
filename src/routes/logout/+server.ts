import { redirect } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, locals }: RequestEvent) => {
	locals.user = undefined;
	cookies.delete('AuthorizationToken', { path: '/' });
	throw redirect(303, '/login');
};
