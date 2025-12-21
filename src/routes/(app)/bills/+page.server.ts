import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "../$types";
import { zod4 } from "sveltekit-superforms/adapters";
import { createBillSchema } from "$lib/schemas/bill.schema";
import { API_URL } from "$env/static/private";
import { setFlash } from "sveltekit-flash-message/server";
import { $t } from "$lib/i18n";
import { fail, type Actions } from "@sveltejs/kit";
import { createCategorySchema } from "$lib/schemas/category.schema";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
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

  // load bills from the API for the current month
  let bills = [];
  const currentDate = new Date();
  const dateStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
  const dateEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];

  try {
    const response = await fetch(`${API_URL}/bills?dateStart=${dateStart}&dateEnd=${dateEnd}`);
    if (!response.ok) {
      throw new Error('Failed to load bills');
    }
    bills = await response.json();
  } catch {
    setFlash({ type: 'error', message: $t('bills.loadBillsError') }, cookies);
  }

  return {
    createBillForm: await superValidate(zod4(createBillSchema)),
    createCategoryForm: await superValidate(zod4(createCategorySchema)),
    accounts,
    bills,
    categories
  }
}

export const actions: Actions = {
  addBill: async ({ request, cookies, fetch }) => {
    const form = await superValidate(request, zod4(createBillSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const isEditing = Boolean(form.data.id && form.data.targetDate);
    try {
      const response = await fetch(`${API_URL}/bills${isEditing ? `/${form.data.id}/${form.data.targetDate}` : ''}`, {
        method: isEditing ? 'PATCH' : 'POST',
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

      const message = isEditing ? $t('bills.editBillSuccess') : $t('bills.addBillSuccess');
      setFlash({ type: 'success', message }, cookies);
      return { form };
    } catch {
      const message = isEditing ? $t('bills.editBillError') : $t('bills.addBillError');
      setFlash({ type: 'error', message }, cookies);
      return fail(500, { form })
    }
  }
}
