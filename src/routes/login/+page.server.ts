import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { API_URL } from '$env/static/private';

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const formData = Object.fromEntries(await request.formData());

		if (!formData.email || !formData.password) {
			return fail(400, {
				error: 'Missing email or password'
			});
		}

		const { email, password } = formData as { email: string; password: string };

		let data;
		try {
			const response = await fetch(`${API_URL}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});
			data = await response.json();
		} catch (error) {
			return fail(401, {
				error: 'Login failed'
			});
		}

		// Set the cookie
		cookies.set('AuthorizationToken', `${data.access_token}`, {
			httpOnly: true,
			path: '/',
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 // 1 day
		});

		throw redirect(302, '/dashboard');
	}
};
