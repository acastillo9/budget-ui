// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    interface PageData {
      flash?: import('$lib/types').ToastMessage;
    }
    // interface PageState {}
    // interface Platform {}
  }
}

export { };
