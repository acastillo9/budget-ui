import { authenticateUser } from '$lib/server/auth';
import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = await authenticateUser(event);
	return await resolve(event);
};

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	const { cookies } = event;
	const token = cookies.get('AuthorizationToken');
	if (token) {
		request.headers.set('Authorization', `Bearer ${token}`);
	}
	return fetch(request).then((response) => {
		if (response.status === 401) {
			redirect(302, '/logout');
		}
		return response;
	});
};
