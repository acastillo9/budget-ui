<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="bg-black text-white w-80 shadow border-r border-r-neutral-300 border-opacity-30">
	<ul class="p-3">
		<li class="mb-2">
			<a
				class="block p-3 text-lg rounded hover:bg-neutral-300 hover:bg-opacity-30 [&.active]:font-bold [&.active]:bg-neutral-300 [&.active]:bg-opacity-30"
				class:active={$page.url.pathname === '/dashboard'}
				href="/dashboard">Dashboard</a
			>
		</li>
		<li>
			<a
				class="block p-3 text-lg rounded hover:bg-neutral-300 hover:bg-opacity-30 [&.active]:font-bold [&.active]:bg-neutral-300 [&.active]:bg-opacity-30"
				class:active={$page.url.pathname === '/accounts'}
				href="/accounts">Accounts</a
			>
		</li>
	</ul>
</div>
