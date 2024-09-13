<script lang="ts">
	import { toast } from '../../stores/toast';
	import { onDestroy } from 'svelte';
	import type { ToastNotification } from '$lib/types';
	import Toast from './Toast.svelte';

	let toastList = $state<ToastNotification[]>([]);

	const toastSub = toast.subscribe((value) => {
		if (!value) return;
		toastList = [...toastList, value];
	});

	onDestroy(toastSub);
</script>

<div class="absolute bottom-16 left-1/2 -translate-x-1/2 w-64">
	{#each toastList as toastItem}
		<Toast data={toastItem} />
	{/each}
</div>
