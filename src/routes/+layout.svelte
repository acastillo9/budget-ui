<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Toasts from '$lib/components/Toasts.svelte';
	import FaUser from '$lib/icons/FaUser.svelte';
	import './styles.scss';

	let { data, children } = $props();
	let userMenuOpen = $state(false);

	function handleMenuClick(event: MouseEvent) {
		event.stopPropagation();
		userMenuOpen = !userMenuOpen;
		if (userMenuOpen) {
			document.addEventListener('click', handleClickOutside);
		} else {
			document.removeEventListener('click', handleClickOutside);
		}
	}

	function handleClickOutside() {
		userMenuOpen = false;
		document.removeEventListener('click', handleClickOutside);
	}
</script>

<svelte:head>
	<title>Budget</title>
	<meta name="description" content="Budget App" />
</svelte:head>

<div class="flex flex-col min-h-screen relative pt-20">
	<header
		class="bg-black p-4 shadow fixed top-0 z-10 w-full h-20 flex items-center border-b border-b-neutral-300 border-opacity-30"
	>
		<div class="flex justify-between items-center w-full">
			<a href="/">
				<h1 class="text-4xl font-bold text-white font-cursive">Budget</h1>
			</a>
			{#if data.user}
				<div class="relative ml-3">
					<div>
						<button
							type="button"
							class="relative flex rounded-full bg-gray-800 text-sm"
							id="user-menu-button"
							aria-expanded="false"
							aria-haspopup="true"
							onclick={handleMenuClick}
						>
							<span class="absolute -inset-1.5"></span>
							<span class="sr-only">Open user menu</span>
							<div class="bg-white rounded-full border">
								<FaUser width="34" height="34" />
							</div>
						</button>
					</div>

					<div
						class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
						class:hidden={!userMenuOpen}
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="user-menu-button"
						tabindex="-1"
					>
						<ul>
							<li>
								<form action="/logout" method="get">
									<button
										class="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
										role="menuitem"
										tabindex="-1"
										type="submit"
										id="user-menu-item-2">Sign out</button
									>
								</form>
							</li>
						</ul>
					</div>
				</div>
			{/if}
		</div>
	</header>

	<div class="flex flex-1">
		{#if data.user}
			<Sidebar />
		{/if}
		<div class="w-full flex flex-col">
			<main class="p-4 flex-1 flex bg-neutral-100 relative">
				{@render children()}
			</main>
			<footer class="bg-black p-3">
				<p class="text-white text-center">
					© {new Date().getFullYear()}
					<a class="hover:underline" href="https://acastillo.dev" target="_blank">acastillo.dev</a>
				</p>
			</footer>
		</div>
	</div>
</div>

<Toasts />
