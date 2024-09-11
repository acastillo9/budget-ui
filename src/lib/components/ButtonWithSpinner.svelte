<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		type = 'button',
		isLoading = false,
		children
	} = $props<{ type: string; isLoading: boolean; children: Snippet }>();
</script>

<button
	class="bg-black text-white font-bold py-2 rounded-lg border flex justify-center hover:bg-neutral-800 disabled:bg-neutral-700"
	{type}
	disabled={isLoading}
>
	{#if isLoading}
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
			><path
				fill="currentColor"
				d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
				><animateTransform
					attributeName="transform"
					dur="1.05s"
					repeatCount="indefinite"
					type="rotate"
					values="0 12 12;360 12 12"
				/></path
			></svg
		>
	{:else}
		{@render children()}
	{/if}
</button>
