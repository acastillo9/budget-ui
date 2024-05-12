<script lang="ts">
	import FaUser from '$lib/icons/FaUser.svelte';
	import './styles.css';

	export let data;

	$: userMenuOpen = false;

	function handleMenuClick() {
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

<div class="flex flex-col min-h-screen">
	<header class="bg-black p-4">
		<div class="container m-auto">
			<div class="flex justify-between items-center">
				<h1 class="text-4xl font-bold text-white">Budget</h1>
				{#if data.user}
					<div class="relative ml-3">
						<div>
							<button
								type="button"
								class="relative flex rounded-full bg-gray-800 text-sm"
								id="user-menu-button"
								aria-expanded="false"
								aria-haspopup="true"
								on:click|stopPropagation={handleMenuClick}
							>
								<span class="absolute -inset-1.5"></span>
								<span class="sr-only">Open user menu</span>
								<div class="bg-white rounded-full border">
									<FaUser width="34" height="34" />
								</div>
							</button>
						</div>

						{#if userMenuOpen}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<div
								class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
								role="menu"
								aria-orientation="vertical"
								aria-labelledby="user-menu-button"
								tabindex="-1"
								on:click|stopPropagation={() => {}}
							>
								<ul>
									<li>
										<form action="/logout" method="get">
											<button
												class="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
												role="menuitem"
												tabindex="-1"
												id="user-menu-item-2">Sign out</button
											>
										</form>
									</li>
								</ul>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</header>

	<main class="p-4 flex-1 flex">
		<div class="container m-auto">
			<slot />
		</div>
	</main>

	<footer class="bg-black p-3">
		<div class="container">
			<p class="text-white text-center">© {new Date().getFullYear()} Budget</p>
		</div>
	</footer>
</div>
