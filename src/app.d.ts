// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session } from '$lib/types';

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
		interface Locals {
			user: Session | null;
		}
    interface PageData {
      flash?: import('$lib/types').ToastMessage;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
