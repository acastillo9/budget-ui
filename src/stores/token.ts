import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const token = writable(browser && localStorage.getItem('token'));
