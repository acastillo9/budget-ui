<script lang="ts">
	import ButtonWithSpinner from './ButtonWithSpinner.svelte';
	import Modal from './Modal.svelte';

	let {
		showModal = $bindable(),
		contentText,
		okButtonText,
		isLoading = false,
		onOk
	} = $props<{
		showModal: boolean;
		contentText: string;
		okButtonText: string;
		isLoading?: boolean;
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
	<ButtonWithSpinner
		className="px-4 border-red-600 bg-red-600 hover:bg-red-500 hover:border-red-500 disabled:bg-red-400 disabled:border-red-400"
		{isLoading}
		onClick={onOk}
	>
		{okButtonText}
	</ButtonWithSpinner>
{/snippet}

<Modal bind:showModal {header} {body} {buttons}></Modal>
