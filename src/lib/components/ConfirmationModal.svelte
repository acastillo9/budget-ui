<script lang="ts">
	import Modal from './Modal.svelte';

	let {
		showModal = $bindable(),
		contentText,
		okButtonText,
		onOk
	} = $props<{
		showModal: boolean;
		contentText: string;
		okButtonText: string;
		onOk(): void;
	}>();
</script>

{#snippet header()}
	<h2 class="font-bold">Confirmation Modal</h2>
{/snippet}

{#snippet body()}
	<p>{contentText}</p>
{/snippet}

{#snippet buttons()}
	<button class="py-2 px-4 rounded-lg border border-red-500 text-white bg-red-500" onclick={onOk}>
		{okButtonText}
	</button>
{/snippet}

<Modal bind:showModal {header} {body} {buttons}></Modal>
