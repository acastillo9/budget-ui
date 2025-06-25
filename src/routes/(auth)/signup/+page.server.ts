import { fail, redirect } from '@sveltejs/kit';
import { API_URL } from '$env/static/private';
import type { Actions, PageServerLoad } from './$types';
import { setError, superValidate, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { setFlash } from 'sveltekit-flash-message/server';
import { activationSchema, activationWithEmailSchema, checkEmailSchema, passwordSchema, passwordWithTokenSchema, signupFormSchema, type CheckEmailSchema } from '$lib/components/register-form/schema';
import { $t } from '$lib/i18n';

export const load: PageServerLoad = async ({ locals }) => {
  const { user } = locals
  if (user) {
    throw redirect(302, '/');
  }

  return {
    form: await superValidate(zod(signupFormSchema)),
    activationForm: await superValidate(zod(activationSchema)),
    passwordForm: await superValidate(zod(passwordSchema)),
  };
};

async function checkEmail(form: SuperValidated<Infer<CheckEmailSchema>>) {
  try {
    const response = await fetch(`${API_URL}/auth/email-registered?email=${form.data.email}`);
    const data = await response.json();
    return !data.registered
  } catch {
    return true;
  }
}

export const actions: Actions = {
  post: async ({ request, cookies, fetch }) => {
    const form = await superValidate(request, zod(signupFormSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    let userEmail;
    let userActivationCodeResendAt;
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form.data)
      });

      if (!response.ok) {
        const { message, statusCode } = await response.json();

        if (statusCode === 429) {
          setFlash({ type: 'error', message: $t('signUp.tooManyRequest') }, cookies);
        } else {
          setFlash({ type: 'error', message }, cookies);
        }

        return fail(statusCode, { form });
      }

      const { email, activationCodeResendAt } = await response.json();
      userEmail = email;
      userActivationCodeResendAt = activationCodeResendAt;

      setFlash({ type: 'success', message: $t('signUp.activationCodeSent') }, cookies);
    } catch {
      setFlash({ type: 'error', message: $t('signUp.activationCodeSentError') }, cookies);
      return fail(500, { form });
    }

    return { form, step: 2, email: userEmail, activationCodeResendAt: userActivationCodeResendAt };
  },
  check: async ({ request }) => {
    const form = await superValidate(request, zod(checkEmailSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const isValidEmail = await checkEmail(form);
    if (!isValidEmail) {
      setError(form, 'email', $t('signUp.validation.emailAlreadyExists'));
      return fail(400, { form });
    }

    return { form };
  },
  activate: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(activationWithEmailSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    let accessToken;
    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form.data)
      });

      if (!response.ok) {
        const { message, statusCode } = await response.json();
        setFlash({ type: 'error', message }, cookies);
        return fail(statusCode, { form });
      }
      const { access_token } = await response.json();
      accessToken = access_token;

      setFlash({ type: 'success', message: $t('signUp.activationSuccess') }, cookies);
    } catch {
      setFlash({ type: 'error', message: $t('signUp.activationError') }, cookies);
      return fail(500, { form });
    }

    return { form, step: 3, accessToken };
  },
  password: async ({ request, cookies }) => {
    const form = await superValidate(request, zod(passwordWithTokenSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const response = await fetch(`${API_URL}/auth/set-password/${form.data.accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form.data)
      });

      if (!response.ok) {
        const { message, statusCode } = await response.json();
        setFlash({ type: 'error', message }, cookies);
        if (statusCode === 401) {
          throw redirect(302, '/signup');
        }
        return fail(statusCode, { form });
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

      setFlash({ type: 'success', message: $t('signUp.setPasswordSuccess') }, cookies)
    } catch {
      setFlash({ type: 'error', message: $t('signUp.setPasswordError') }, cookies);
      return fail(500, { form });
    }

    throw redirect(302, '/');
  }
};
