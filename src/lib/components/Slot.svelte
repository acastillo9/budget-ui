<script lang="ts">
	export let disabled = false;
	export let active = false;
</script>

<div
	class={`h-32 border p-2 flex flex-col justify-between ${disabled ? 'opacity-40 bg-gray-200' : ''}`}
>
	<span
		class={`w-7 h-7 flex justify-center items-center ${active ? 'text-white font-bold bg-sky-400 rounded-full' : ''}`}
		><slot name="day" /></span
	>
	<slot />
</div>
