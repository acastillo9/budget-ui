<script lang="ts">
	import type { SelectOption } from '$lib/types';

	let {
		id,
		name,
		value = $bindable(''),
		options = []
	} = $props<{
		id: string;
		name: string;
		value: string;
		options: SelectOption[];
	}>();

	let isOpen = $state(false);
	let selectedOption = $state<SelectOption | null>(null);

	$effect(() => {
		selectedOption = options.find((option: SelectOption) => option.value === value) || null;
	});

	function toggleSelectOptions() {
		isOpen = !isOpen;
	}

	function selectOption(option: SelectOption) {
		selectedOption = option;
		value = option.value;
		isOpen = false;
	}

	function handleSelectClick(event: MouseEvent) {
		event.stopPropagation();
		toggleSelectOptions();
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
		} else {
			document.removeEventListener('click', handleClickOutside);
		}
	}

	function handleClickOutside() {
		isOpen = false;
		document.removeEventListener('click', handleClickOutside);
	}
</script>

<div class="relative">
	<select class="hidden" {id} {name} {value}>
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>

	<div class="relative cursor-pointer">
		<div
			class="p-3 bg-white rounded-md border border-neutral-300"
			role="button"
			tabindex="0"
			onclick={handleSelectClick}
			onkeyup={toggleSelectOptions}
		>
			{selectedOption?.label || 'Select an option'}
		</div>
		{#if isOpen}
			<div
				class="absolute top-full left-0 w-full bg-white border border-neutral-300 rounded-md z-10"
			>
				{#each options as option}
					<div
						class="p-2.5 cursor-pointer hover:bg-neutral-100 [&.active]:bg-neutral-200"
						class:active={selectedOption?.value === option.value}
						role="button"
						tabindex="0"
						onclick={() => selectOption(option)}
						onkeyup={() => selectOption(option)}
					>
						{option.label}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
