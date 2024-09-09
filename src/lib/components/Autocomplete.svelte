<script lang="ts">
	import type { SelectOption } from '$lib/types';
	import Select from './Select.svelte';

	let {
		value = $bindable<string | null>(),
		id,
		name,
		options = [],
		onInput,
		onFocus,
		onBlur,
		onSelectOption,
		onAddOption
	} = $props<{
		value: string | null;
		id: string;
		name: string;
		options: SelectOption[];
		oninput?: (event: InputEvent) => void;
		onfocus?: (event: FocusEvent) => void;
		onblur?: (event: FocusEvent) => void;
		onSelectOption?: (value: string) => void;
		onAddOption?: (label: string) => void;
	}>();

	let inputValue = $state('');

	function selectOption(option: { key: string; text: string }) {
		value = option.text;
		onSelectOption(option.key);
	}
</script>

<div class="relative">
	<input
		class="w-full rounded-md border border-neutral-300 bg-white p-3 text-base font-normal text-gray-500 outline-none focus:border-sky-400 focus:shadow-md absolute z-10"
		type="text"
		bind:value={inputValue}
		onfocus={onFocus}
		oninput={onInput}
		onblur={onBlur}
	/>
	<Select {id} {name} {options} bind:value></Select>
</div>
