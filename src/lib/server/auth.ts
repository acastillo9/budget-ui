import { API_URL } from '$env/static/private';
import type { RequestEvent } from '@sveltejs/kit';

export const authenticateUser = async (event: RequestEvent) => {
	const { cookies } = event;
	const token = cookies.get('AuthorizationToken');
	if (token) {
		try {
			const response = await fetch(`${API_URL}/auth/profile`, {
				headers: {
					Authorization: `Bearer ${token}`
				},
				method: 'GET'
			});
			const user = await response.json();
			return user;
		} catch (error) {
			return null;
		}
	}
	return null;
};
