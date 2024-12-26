<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import type { ToastMessage, UserSession } from '$lib/types';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	let { data, children } = $props();

	const userStore = writable<UserSession | undefined>(data.user);
	setContext('user', userStore);

	// Show Toasts messages from flash store
	const flash = getFlash(page);
	flash.subscribe((value: ToastMessage | undefined) => {
		if (value) {
			(toast[value.type] || toast)(value.message);
		}
	});

	$effect(() => {
		userStore.set(data.user);
	});
</script>

<Toaster />

<ModeWatcher />

<div class="flex h-screen flex-col">
	<Header borderless></Header>

	<div class="flex-grow">
		{@render children()}
	</div>

	<Footer></Footer>
</div>
