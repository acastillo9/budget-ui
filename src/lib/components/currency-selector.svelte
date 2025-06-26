<script lang="ts">
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import { Check, ChevronDown } from '@lucide/svelte';
	import Button from './ui/button/button.svelte';
	import { currencies, getCurrencyByCode } from '$lib/utils/currency';

	let { selectedCurrency = $bindable() } = $props();
	let selectedCurrencyData = $derived(getCurrencyByCode(selectedCurrency));
</script>

<Popover.Root>
	<Popover.Trigger>
		<Button variant="ghost" size="sm" class="h-8 gap-1 px-2">
			<span class="text-lg">{selectedCurrencyData?.flag}</span>
			<span class="font-medium">{selectedCurrency}</span>
			<ChevronDown className="h-3 w-3 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-full p-0">
		<Command.Root>
			<Command.List>
				<Command.Empty>No currency found.</Command.Empty>
				<Command.Group>
					{#each currencies as currency (currency.code)}
						<Command.Item
							value={`${currency.code} ${currency.name}`}
							onSelect={() => {
								selectedCurrency = currency.code;
							}}
							class="flex items-center gap-2"
						>
							<span class="text-lg">{currency.flag}</span>
							<div class="flex-1">
								<div class="font-medium">{currency.code}</div>
								<div class="text-muted-foreground text-xs">{currency.name}</div>
							</div>
							<Check
								class={`h-4 w-4 ${selectedCurrency === currency.code ? 'opacity-100' : 'opacity-0'}`}
							/>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
