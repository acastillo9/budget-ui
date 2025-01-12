import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from "sveltekit-superforms/adapters";
import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { API_URL } from '$env/static/private';
import { passwordSchema, passwordWithTokenSchema } from '$lib/components/register-form/schema';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(passwordSchema)),
  };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(passwordWithTokenSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const response = await fetch(`${API_URL}/auth/set-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${form.data.accessToken}`
        },
        body: JSON.stringify(form.data)
      });

      if (!response.ok) {
        const { message, statusCode } = await response.json();
        setFlash({ type: 'error', message }, cookies);
        return fail(statusCode, { form });
      }

      setFlash({ type: 'success', message: 'Password has been reset successfully, please login with your new password' }, cookies)
    } catch {
      return fail(500, { form });
    }

    throw redirect(302, '/signin');
  }
}
