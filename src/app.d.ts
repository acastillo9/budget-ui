// See https://svelte.dev/docs/kit/types#app.d.ts

import type { UserSession } from '$lib/types';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
		interface Locals {
			user: UserSession | undefined;
		}
    interface PageData {
      flash?: import('$lib/types').ToastMessage;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
