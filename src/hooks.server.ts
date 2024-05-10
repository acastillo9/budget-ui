import { API_URL } from '$env/static/private';
import type { SessionUser } from '$lib/types';
import type { Handle, HandleFetch } from '@sveltejs/kit';
import { parse } from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
	const { headers } = event.request;
	const cookies = parse(headers.get('cookie') ?? '');

	if (cookies.AuthorizationToken) {
		const token = cookies.AuthorizationToken;

		try {
			const response = await fetch(`${API_URL}/auth/profile`, {
				headers: {
					Authorization: `Bearer ${token}`
				},
				method: 'GET'
			});
			const user = await response.json();

			if (response.status === 401) {
				throw new Error('Unauthorized');
			}

			const sessionUser: SessionUser = {
				id: user.sub,
				name: user.name,
				email: user.username,
				access_token: token
			};

			event.locals.user = sessionUser;
		} catch (error) {
			console.error(error);
		}
	}

	return await resolve(event);
};

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	if (event.locals.user) {
		request.headers.set('Authorization', `Bearer ${event.locals.user.access_token}`);
	}

	return fetch(request);
};
