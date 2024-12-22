/**
 * Check if the user is registered
 * @param email - The email of the user
 * @returns If the user is registered
 * @async
 */
export async function isValidEmail(email: string) {
  try {
    const response = await fetch(`/auth/user-registered?email=${email}`);
    const data = await response.json();
    return !data.registered
  } catch {
    return true;
  }
}
