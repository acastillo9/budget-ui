<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/state';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import type { UserSession } from '$lib/types';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	let { data, children } = $props();

	const userStore = writable<UserSession | undefined>(data.user);
	setContext('user', userStore);

	// Show Toasts messages from flash store
	const flash = getFlash(page);

	$effect(() => {
		if (!$flash) return;

		toast[$flash.type]($flash.message);

		// Clear the flash message to avoid double-toasting.
		$flash = undefined;
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
