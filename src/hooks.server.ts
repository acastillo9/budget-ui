import { API_URL } from '$env/static/private';
import type { SessionUser } from '$lib/types';
import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
	const { headers } = event.request;
	const cookies = parse(headers.get('cookie') ?? '');

	if (cookies.AuthorizationToken) {
		const token = cookies.AuthorizationToken.split(' ')[1];

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
