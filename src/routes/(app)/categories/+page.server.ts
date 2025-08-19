import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "../$types";
import { zod4 } from "sveltekit-superforms/adapters";
import { createCategorySchema } from "$lib/schemas/category.schema";
import { fail, type Actions } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { API_URL } from "$env/static/private";
import { $t } from "$lib/i18n";
import type { Category } from "$lib/types/category.types";

export const load: PageServerLoad = async ({ cookies, fetch }) => {

  let categories: Category[] = []
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to load categories');
    }
    categories = await response.json();
  } catch {
    setFlash({ type: 'error', message: $t('categories.loadCategoriesError') }, cookies);
  }

  return {
    createCategoryForm: await superValidate(zod4(createCategorySchema)),
    categories
  }
}

export const actions: Actions = {
  addCategory: async ({ request, cookies, fetch }) => {
    const form = await superValidate(request, zod4(createCategorySchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const isEditing = Boolean(form.data.id);
    try {
      const response = await fetch(`${API_URL}/categories${isEditing ? `/${form.data.id}` : ''}`, {
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

      const message = isEditing ? $t('categories.editCategorySuccess') : $t('categories.addCategorySuccess');
      setFlash({ type: 'success', message }, cookies);
      return { form };
    } catch {
      const message = isEditing ? $t('categories.editCategoryError') : $t('categories.addCategoryError');
      setFlash({ type: 'error', message }, cookies);
      return fail(500, { form });
    }
  },
}
