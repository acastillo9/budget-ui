<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import FaXMark from '../icons/FaXMark.svelte';

	export let showModal: boolean;

	let dialog: HTMLDialogElement;

	$: dialog && showModal ? dialog.showModal() : dialog?.close();

	const dispatch = createEventDispatcher();
	function onCloseHandler() {
		showModal = false;
		dispatch('close');
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions a11y-autofocus -->
<dialog class="overflow-visible" bind:this={dialog} on:close={onCloseHandler}>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="p-4 w-[50rem]" on:click|stopPropagation>
		<div class="flex gap-4 pb-4 mb-4 items-center justify-between border-b">
			<slot name="header" />
			<button on:click={() => dialog.close()}><FaXMark width="30" height="30"></FaXMark></button>
		</div>
		<slot />
		<div class="flex gap-2 pt-4 mt-4 border-t items-center justify-end">
			<button class="py-2 px-4 rounded-lg border" autofocus on:click={() => dialog.close()}
				>Close</button
			>
			<slot name="buttons" />
		</div>
	</div>
</dialog>
