import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete('AuthorizationToken', { path: '/' });
  return json({ message: 'Signout successfully' })
};
