<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		disabled = false,
		active = false,
		day,
		children
	} = $props<{
		disabled: boolean;
		active: boolean;
		day: Snippet;
		children: Snippet;
	}>();
</script>

<div
	class={`h-32 border p-2 flex flex-col justify-between ${disabled ? 'opacity-40 bg-gray-200' : ''}`}
>
	<span
		class={`w-7 h-7 flex justify-center items-center ${active ? 'text-white font-bold bg-sky-400 rounded-full' : ''}`}
		>{@render day()}</span
	>
	{@render children()}
</div>
