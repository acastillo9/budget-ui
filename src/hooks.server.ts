import { API_URL } from '$env/static/private';
import { type Handle, type HandleFetch } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const { cookies } = event;
  const token = cookies.get('AuthorizationToken');

  if (token) {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error();
      }

      const user = await response.json();
      event.locals.user = user
    } catch {
      event.locals.user = undefined
    }
  }

  if (!event.locals.user) cookies.delete('AuthorizationToken', { path: '/' })

  return resolve(event);
};

export const handleFetch: HandleFetch = async ({ request, fetch, event: { cookies } }) => {
  const token = cookies.get('AuthorizationToken');
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(request);
};
