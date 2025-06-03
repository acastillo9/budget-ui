import { API_URL } from "$env/static/private";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, fetch }) => {
  await fetch(`${API_URL}/auth/logout`);
  cookies.delete('AuthorizationToken', { path: '/' });
  cookies.delete('RefreshToken', { path: '/' });
  return json({ message: 'Signout successfully' });
};
