import { API_URL } from '$env/static/private';
import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('AuthorizationToken');
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: 'GET'
    });

    if (!response.ok) {
      throw redirect(302, '/signout');
    }

    const user = await response.json();
    event.locals.user = user
  } catch {
    event.locals.user = null
  }
  return resolve(event);
};

export const handleFetch: HandleFetch = async ({ request, fetch, event: { cookies } }) => {
  const token = cookies.get('AuthorizationToken');
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(request).then((response) => {
    if (response.status === 401) {
      throw redirect(302, '/signout');
    }
    return response;
  });
};
