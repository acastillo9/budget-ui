<script lang="ts">
	import './styles.css';

	export let data;
</script>

<svelte:head>
	<title>Budget</title>
	<meta name="description" content="Budget App" />
</svelte:head>

<div class="flex flex-col min-h-screen">
	<header class="bg-black p-4">
		<div class="container m-auto">
			<div class="flex justify-between">
				<h1 class="text-4xl font-bold text-white">Budget</h1>
				{#if data.user}
					<div class="flex items-center gap-3">
						<p class="text-white text-sm font-bold">{data.user.name}</p>
						<form action="/logout" method="get">
							<button type="submit" class="text-white border border-white p-2 rounded-lg"
								>Log out</button
							>
						</form>
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
