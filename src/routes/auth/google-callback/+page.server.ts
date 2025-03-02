import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ request, cookies }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const access_token = searchParams.get('access_token');

  // Set the cookie
  cookies.set('AuthorizationToken', `${access_token}`, {
    httpOnly: true,
    path: '/',
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 1 day
  });

  throw redirect(302, '/dashboard');
};
