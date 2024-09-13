import type { ToastNotification } from '$lib/types';
import { writable } from 'svelte/store';

export const toast = writable<ToastNotification | null>(null);
