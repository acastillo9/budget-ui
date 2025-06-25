import { fail, redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { API_URL } from "$env/static/private";
import { setFlash } from "sveltekit-flash-message/server";
import { $t } from "$lib/i18n";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { addAccountSchema } from "$lib/schemas/add-account.schema";
import { createCategorySchema } from "$lib/schemas/create-category.schema";
import { addTransactionSchema, addTransferSchema } from "$lib/schemas/add-transaction.schema";

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
    setFlash({ type: 'error', message: $t('accounts.loadAccountsError') }, cookies);
  }

  // load categories from the API
  let categories = [];
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to load categories');
    }
    categories = await response.json();
  } catch {
    setFlash({ type: 'error', message: $t('categories.loadCategoriesError') }, cookies);
  }

  // load transactions from the API
  let transactions = [];
  try {
    const response = await fetch(`${API_URL}/transactions`);
    if (!response.ok) {
      throw new Error('Failed to load transactions');
    }
    transactions = await response.json();
  } catch {
    setFlash({ type: 'error', message: $t('transactions.loadTransactionsError') }, cookies);
  }

  return {
    addAccountForm: await superValidate(zod(addAccountSchema)),
    createCategoryForm: await superValidate(zod(createCategorySchema)),
    addTransactionForm: await superValidate(zod(addTransactionSchema)),
    addTransferForm: await superValidate(zod(addTransferSchema)),
    accounts,
    categories,
    transactions
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

      setFlash({ type: 'success', message: $t('accounts.addAccountSuccess') }, cookies);
      return { form };
    } catch {
      setFlash({ type: 'error', message: $t('accounts.addAccountError') }, cookies);
      return fail(500, { form });
    }
  },
  addCategory: async ({ request, cookies, fetch }) => {
    const form = await superValidate(request, zod(createCategorySchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const response = await fetch(`${API_URL}/categories`, {
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

      setFlash({ type: 'success', message: $t('categories.addCategorySuccess') }, cookies);
      return { form };
    } catch {
      setFlash({ type: 'error', message: $t('categories.addCategoryError') }, cookies);
      return fail(500, { form });
    }
  },
  addTransaction: async ({ request, cookies, fetch }) => {
    const form = await superValidate(request, zod(addTransactionSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const response = await fetch(`${API_URL}/transactions`, {
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

      setFlash({ type: 'success', message: $t('transactions.addTransactionSuccess') }, cookies);
      return { form };
    } catch {
      setFlash({ type: 'error', message: $t('transactions.addTransactionError') }, cookies);
      return fail(500, { form });
    }
  },
  addTransfer: async ({ request, cookies, fetch }) => {
    const form = await superValidate(request, zod(addTransferSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const response = await fetch(`${API_URL}/transactions/transfer`, {
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

      setFlash({ type: 'success', message: $t('transactions.addTransactionSuccess') }, cookies);
      return { form };
    } catch {
      setFlash({ type: 'error', message: $t('transactions.addTransactionError') }, cookies);
      return fail(500, { form });
    }
  }
}
