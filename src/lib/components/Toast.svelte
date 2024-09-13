<script lang="ts">
	import type { ToastNotification } from '$lib/types';
	import FaXmark from '../icons/FaXmark.svelte';

	let { data } = $props<{ data: ToastNotification }>();
	let showToast = $state(true);

	setTimeout(() => {
		showToast = false;
	}, 3000);
</script>

{#if showToast}
	<div
		class="border p-4 flex justify-between text-white rounded opacity-80"
		class:bg-red-600={data.type === 'error'}
		class:bg-green-600={data.type === 'success'}
	>
		<p class="mr-4">{data.message}</p>
		<button onclick={() => (showToast = false)}><FaXmark width="20" height="20" /></button>
	</div>
{/if}
