import { fail, redirect } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());

		// Data validation
		if (!formData.name || !formData.email || !formData.password) {
			return fail(400, {
				error: 'Please fill in all fields'
			});
		}

		const user = formData as { name: string; email: string; password: string };

		try {
			await fetch(`${API_URL}/users/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			});
		} catch (error) {
			return fail(500, {
				error: 'Registration failed'
			});
		}

		// Redirect to the login page
		throw redirect(302, '/login');
	}
};
