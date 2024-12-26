import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import { superValidate } from 'sveltekit-superforms';
import { loginFormSchema } from './schema';
import { zod } from "sveltekit-superforms/adapters";
import { setFlash } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async ({ locals  }) => {
  const { user } = locals
  if (user) {
    throw redirect(302, '/dashboard');
  }
  
  return {
    form: await superValidate(zod(loginFormSchema)),
  };
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(loginFormSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form.data)
      });

      if (!response.ok) {
        setFlash({ type: 'error', message: 'Login failed, please verify your email and password' }, cookies);
        return fail(401, { form });
      }

      const { access_token } = await response.json();

      // Set the cookie
      cookies.set('AuthorizationToken', `${access_token}`, {
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 1 day
      });
    } catch {
      setFlash({ type: 'error', message: 'Login failed, please verify your email and password' }, cookies);
      return fail(401, { form });
    }

    throw redirect(302, '/dashboard');
  },
};

