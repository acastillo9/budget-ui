import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { addAccountSchema } from "$lib/schemas/add-account.schema";
import { API_URL } from "$env/static/private";
import { setFlash } from "sveltekit-flash-message/server";
import { $t } from "$lib/i18n";

export const load: PageServerLoad = async ({ locals, cookies, fetch }) => {
  const { user } = locals
  if (!user) {
    throw redirect(302, '/signin')
  }

  // Load accounts from the API
  let accounts = [];
  try {
    const response = await fetch(`${API_URL}/accounts`);
    if (!response.ok) {
      throw new Error('Failed to load accounts');
    }
    accounts = await response.json();
  } catch {
    setFlash({ type: 'error', message: $t('account.loadAccountsError') }, cookies);
  }

  return {
    form: await superValidate(zod(addAccountSchema)),
    accounts
  }
};

export const actions: Actions = {
  addAccount: async ({ request, cookies, fetch }) => {
    const form = await superValidate(request, zod(addAccountSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const response = await fetch(`${API_URL}/accounts`, {
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

      setFlash({ type: 'success', message: $t('account.addAccountSuccess') }, cookies);
      return { form };
    } catch {
      setFlash({ type: 'error', message: $t('account.addAccountError') }, cookies);
      return fail(500, { form });
    }
  }
}
