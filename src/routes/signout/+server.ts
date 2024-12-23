import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies, locals }) => {
	locals.user = null;
	cookies.delete('AuthorizationToken', { path: '/' });
	throw redirect(303, '/signin');
};
