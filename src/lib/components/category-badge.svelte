<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { TrendingDown, TrendingUp } from '@lucide/svelte';

	let { category, size = 'default' } = $props();

	let isIncome = $derived(category.categoryType === 'INCOME');
	let Icon = $derived(isIncome ? TrendingUp : TrendingDown);
	let colorClass = $derived(
		isIncome
			? 'bg-green-100 text-green-800 hover:bg-green-200'
			: 'bg-red-100 text-red-800 hover:bg-red-200'
	);
</script>

<Badge variant="outline" class={`${colorClass} ${size === 'sm' ? 'px-1 py-0 text-xs' : ''}`}>
	<Icon class={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
	{category.name}
</Badge>
