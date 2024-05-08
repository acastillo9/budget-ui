<script lang="ts">
	import './styles.css';

	export let data;
</script>

<svelte:head>
	<title>Budget</title>
	<meta name="description" content="Budget App" />
</svelte:head>

<div class="flex flex-col min-h-screen">
	<header class="bg-black p-4 flex justify-between">
		<h1 class="text-4xl font-bold text-white">Budget</h1>
		{#if data.user}
			<div class="flex items-center gap-2">
				<p class="text-white">{data.user.email}</p>
				<form action="/logout" method="get">
					<button type="submit" class="text-white border border-white p-2 rounded-lg"
						>Log out</button
					>
				</form>
			</div>
		{/if}
	</header>

	<main class="p-4 flex-1 flex">
		<slot />
	</main>

	<footer class="bg-black p-3">
		<p class="text-white text-center">© {new Date().getFullYear()} Budget</p>
	</footer>
</div>
