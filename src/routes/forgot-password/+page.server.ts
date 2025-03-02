import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from "sveltekit-superforms/adapters";
import { forgotPasswordFormSchema } from './schema';
import { fail, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { API_URL } from '$env/static/private';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(forgotPasswordFormSchema)),
  };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(forgotPasswordFormSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form.data)
      });

      if (!response.ok) {
        const { message, statusCode } = await response.json();
        if (statusCode === 429) {
          setFlash({ type: 'error', message: 'Reset password limit reached, please try again tomorrow' }, cookies);
        } else {
          setFlash({ type: 'error', message }, cookies);
        }
        return fail(statusCode, { form });
      }

      setFlash({ type: 'success', message: 'An email has been sent to you with instructions on how to reset your password' }, cookies)
    } catch {
      return fail(500, { form });
    }

    throw redirect(302, '/signin');
  }
}
