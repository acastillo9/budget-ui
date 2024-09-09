<script lang="ts">
	import type { Snippet } from 'svelte';
	import FaXMark from '../icons/FaXMark.svelte';

	let {
		showModal = $bindable(),
		header,
		body,
		buttons,
		onClose
	} = $props<{
		showModal: boolean;
		header: Snippet;
		body: Snippet;
		buttons: Snippet;
		onClose?(): void;
	}>();

	let dialog: HTMLDialogElement;

	$effect(() => {
		if (dialog) {
			if (showModal) {
				dialog.showModal();
			} else {
				dialog.close();
			}
		}
	});

	function onCloseHandler() {
		showModal = false;
		if (onClose) {
			onClose();
		}
	}
</script>

<dialog class="overflow-visible" bind:this={dialog} onclose={onCloseHandler}>
	<div class="p-4 w-[50rem] max-w-full">
		<div class="flex gap-4 pb-4 mb-4 items-center justify-between border-b">
			{@render header()}
			<button onclick={() => dialog.close()}><FaXMark width="30" height="30"></FaXMark></button>
		</div>
		{@render body()}
		<div class="flex gap-2 pt-4 mt-4 border-t items-center justify-end">
			<button class="py-2 px-4 rounded-lg border" onclick={() => dialog.close()}>Close</button>
			{@render buttons()}
		</div>
	</div>
</dialog>
