import { API_URL } from "$env/static/private";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ params, fetch }) => {
  const { id } = params;

  const response = await fetch(`${API_URL}/transactions/transfer/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const { message, statusCode } = await response.json();
    return error(statusCode, { message });
  }

  const deletedTransaction = await response.json();
  return json(deletedTransaction);
}
