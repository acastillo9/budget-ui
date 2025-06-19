<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import Plus from '@lucide/svelte/icons/plus';
	import { t } from 'svelte-i18n';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { createCategorySchema } from '../../schemas/create-category.schema';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import IconPicker from './icon-picker.svelte';
	import Label from '../ui/label/label.svelte';

	let { data, categoryType } = $props();
	let open = $state(false);
	let selectedIcon = $state('');

	const form = superForm(data, {
		validators: zodClient(createCategorySchema),
		onSubmit({ formData, cancel }) {
			if (!categoryType) {
				cancel();
			}
			formData.set('icon', selectedIcon);
			formData.set('categoryType', categoryType);
		},
		onUpdate({ form }) {
			if (form.valid) {
				open = false;
			}
		}
	});

	const { form: formData, enhance, isTainted, tainted, allErrors, delayed, reset } = form;
</script>

<Dialog.Root
	bind:open
	onOpenChange={(open: boolean) => {
		if (!open) {
			selectedIcon = '';
			reset();
		}
	}}
>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<div class="flex flex-col items-center space-y-2">
				<Button
					{...props}
					variant="outline"
					size="icon"
					class="h-16 w-16 rounded-full border-2 border-dashed text-blue-600 transition-transform hover:scale-105 hover:bg-blue-50 hover:text-blue-700"
					onclick={() => (open = true)}
				>
					<Plus class="h-6 w-6" />
				</Button>
				<div class="text-center">
					<p class="text-xs font-medium text-blue-600">{$t('categories.createNew')}</p>
					<p class="text-muted-foreground text-xs">{$t('categories.category')}</p>
				</div>
			</div>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content escapeKeydownBehavior="ignore" interactOutsideBehavior="ignore">
		<Dialog.Header>
			<Dialog.Title>{$t('categories.createNewCategory')}</Dialog.Title>
		</Dialog.Header>
		<form
			id="createCategoryForm"
			action="?/addCategory"
			method="POST"
			class="space-y-4"
			use:enhance
		>
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>{$t('categories.categoryName')}</Form.Label>
						<Input
							type="text"
							placeholder={$t('categories.categoryNamePlaceholder')}
							{...props}
							bind:value={$formData.name}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div>
				<Label class="mb-2">{$t('categories.categoryIcon')}</Label>
				<IconPicker bind:icon={selectedIcon} />
			</div>
		</form>
		<Dialog.Footer>
			<Button
				class="mt-5 w-full"
				type="submit"
				form="createCategoryForm"
				disabled={$delayed || !isTainted($tainted?.name) || !selectedIcon || !!$allErrors.length}
			>
				{#if $delayed}<LoaderCircle class="mr-1 animate-spin" />{/if}
				{$t('categories.createCategory')}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
