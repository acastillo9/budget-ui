import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals  }) => {
  const { user } = locals
  throw user ? redirect(302, '/dashboard') : redirect(303, '/signin')
}
