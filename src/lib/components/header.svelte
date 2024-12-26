<script lang="ts">
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import LogOut from 'lucide-svelte/icons/log-out';
	import { getContext } from 'svelte';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Writable } from 'svelte/store';
	import type { UserSession } from '$lib/types';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let { borderless = false } = $props();

	const user: Writable<UserSession | undefined> = getContext('user');

	async function signOut() {
		try {
			const res = await fetch('/signout', {
				method: 'POST'
			});

			if (!res.ok) {
				throw new Error();
			}

			user.set(undefined);
      goto('/signin')
		} catch {
      toast['error']('An error occurred while signing out');
		}
	}
</script>

<header class="flex h-20 w-full items-center p-4 backdrop-blur" class:border-b={!borderless}>
	<div class="flex w-full items-center justify-between">
		<a href="/">
			<h1 class="font-cursive text-4xl">Budget</h1>
		</a>
		<div class="flex items-center gap-2">
			{#if $user}
				<div class="flex items-center gap-2">
					<span>{$user.name}</span>
					<Button variant="outline" size="icon" onclick={signOut}>
						<LogOut class="h-5 w-5"></LogOut>
					</Button>
				</div>
			{/if}
			<Button onclick={toggleMode} variant="outline" size="icon">
				<Sun class="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<Moon
					class="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</div>
</header>
