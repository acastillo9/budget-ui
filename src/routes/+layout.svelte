<script lang="ts">
	import './styles.css';
	import { goto } from '$app/navigation';
	import { token } from '../stores/token';
	import { browser } from '$app/environment';

	token.subscribe((value) => {
		if (browser && !value) {
			goto('/login');
		}
	});

	if (browser && location.pathname === '/') {
		goto('/calendar');
	}
</script>

<div class="flex flex-col min-h-screen">
	<header class="bg-black p-4">
		<h1 class="text-4xl font-bold text-white">Budget</h1>
	</header>

	<main class="p-4 flex-1 flex">
		<slot />
	</main>

	<footer class="bg-black p-4">
		<p class="text-white text-center">© {new Date().getFullYear()} Budget</p>
	</footer>
</div>
