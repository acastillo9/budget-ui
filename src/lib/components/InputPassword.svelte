<script lang="ts">
	import FaEye from '$lib/icons/FaEye.svelte';
	import FaEyeSlash from '$lib/icons/FaEyeSlash.svelte';

	let {
		id,
		name,
		placeholder,
		value = $bindable('')
	} = $props<{
		id: string;
		name: string;
		placeholder: string;
		value: string;
	}>();

	let showPassword = $state(false);
</script>

<div class="relative">
	<input
		class="w-full rounded-md border border-neutral-300 bg-white p-3 pr-10 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md"
		type={showPassword ? 'text' : 'password'}
		{id}
		{name}
		{placeholder}
		bind:value
	/>
	<button
		class="absolute right-0 top-1/2 transform -translate-y-1/2 mr-3"
		type="button"
		onclick={() => (showPassword = !showPassword)}
	>
		{#if !showPassword}
			<FaEye width="22" height="22" />
		{:else}
			<FaEyeSlash width="22" height="22" />
		{/if}
	</button>
</div>
