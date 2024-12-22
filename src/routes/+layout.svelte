<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import { Toaster } from '$lib/components/ui/sonner';
	import { toast } from 'svelte-sonner';
	import type { ToastMessage } from '$lib/types';
	import Header from '$lib/components/header.svelte';
	import Footer from '$lib/components/footer.svelte';

	let { children } = $props();

	// Show Toasts messages from flash store
	const flash = getFlash(page);
	flash.subscribe((value: ToastMessage | undefined) => {
		if (value) {
			(toast[value.type] || toast)(value.message);
		}
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
