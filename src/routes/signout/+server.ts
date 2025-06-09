import { API_URL } from "$env/static/private";
import { $t } from "$lib/i18n";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, fetch }) => {
  await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  cookies.delete('AuthorizationToken', { path: '/' });
  cookies.delete('RefreshToken', { path: '/' });
  return json({ message: $t('signOut.signOutSuccess') });
};
