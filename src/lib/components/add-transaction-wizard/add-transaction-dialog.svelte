<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Plus from '@lucide/svelte/icons/plus';
	import { t } from 'svelte-i18n';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Check from '@lucide/svelte/icons/check';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import SelectTransactionType from './select-transaction-type.svelte';
	import ChooseCategory from './choose-category.svelte';
	import { addTransactionSchema, addTransferSchema } from '$lib/schemas/add-transaction.schema';
	import AddTransactionForm from './add-transaction-form.svelte';
	import type { Category } from '$lib/types/category.types';
	import { Badge } from '$lib/components/ui/badge';
	import AddTransferForm from './add-transfer-form.svelte';

	let { addTransactionForm, addTransferForm, createCategoryForm, categories, accounts } = $props();
	let open = $state(false);
	let transactionStep = $state(1);
	let categoryType = $state('');
	let category: Category | null = $state(null);
	let filteredCategories = $derived(
		categories.filter((c: Category) => c.categoryType === categoryType)
	);

	function goToNextStep() {
		if (categoryType === 'TRANSFER') {
			transactionStep = 3; // Skip to details for transfer
		} else {
			transactionStep += 1;
		}
	}

	function goToPreviousStep() {
		if (categoryType === 'TRANSFER') {
			reset(); // Reset form if going back from transfer
      transferReset(); // Reset transfer form
			transactionStep = 1; // Go back to type selection for transfer
		} else {
			if (transactionStep === 2) {
				category = null; // Reset category if going back from details
			} else if (transactionStep === 3) {
				reset(); // Reset form if going back from details
        transferReset(); // Reset transfer form
			}
			transactionStep -= 1;
		}
	}

	const form = superForm(addTransactionForm, {
		validators: zodClient(addTransactionSchema),
		onSubmit({ formData, cancel }) {
			if (!category) {
				cancel();
				return;
			}
			formData.set('category', category.id);
		},
		onUpdate({ form }) {
			if (form.valid) {
				transactionStep = 1;
				categoryType = '';
				category = null;
				reset();
				open = false;
			}
		}
	});

	const { form: formData, enhance, isTainted, tainted, allErrors, delayed, reset } = form;

	const transferForm = superForm(addTransferForm, {
		validators: zodClient(addTransferSchema),
		onUpdate({ form }) {
			if (form.valid) {
				transactionStep = 1;
				transferReset();
				open = false;
			}
		}
	});

	const {
		form: transferFormData,
		enhance: transferEnhance,
		isTainted: transferIsTainted,
		tainted: transferTainted,
		allErrors: transferAllErrors,
		delayed: transferDelayed,
		reset: transferReset
	} = transferForm;
</script>

<Dialog.Root
	bind:open
	onOpenChange={(open: boolean) => {
		if (!open) {
			transactionStep = 1;
			categoryType = '';
			category = null;
			reset();
      transferReset();
		}
	}}
>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
		<Plus class="h-4 w-4 mr-2" />
		{$t('transactions.addTransaction')}
	</Dialog.Trigger>
	<Dialog.Content escapeKeydownBehavior="ignore" interactOutsideBehavior="ignore">
		<Dialog.Header>
			<Dialog.Title>{$t('transactions.addTransaction')}</Dialog.Title>
			<Dialog.Description>
				{$t('transactions.stepOf', { values: { step: transactionStep, totalSteps: 3 } })}
				{transactionStep === 1
					? $t('transactions.selectType')
					: transactionStep === 2
						? $t('transactions.chooseCategory')
						: $t('transactions.transactionDetails')}
			</Dialog.Description>
		</Dialog.Header>
		<div class="mb-6 flex items-center justify-between">
			{#each [1, 2, 3] as step}
				<div class="flex items-center">
					<div
						class={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
							step < transactionStep
								? 'bg-green-500 text-white'
								: step === transactionStep
									? 'bg-blue-500 text-white'
									: 'bg-gray-200 text-gray-600'
						}`}
					>
						{#if step < transactionStep}
							<Check class="h-4 w-4" />
						{:else}
							{step}
						{/if}
					</div>
					{#if step < 3}
						<div
							class={`mx-2 h-1 w-12 ${step < transactionStep ? 'bg-green-500' : 'bg-gray-200'}`}
						></div>
					{/if}
				</div>
			{/each}
		</div>
		{#if transactionStep === 1}
			<SelectTransactionType bind:type={categoryType} />
		{:else if transactionStep === 2}
			<ChooseCategory
				{categoryType}
				{createCategoryForm}
				categories={filteredCategories}
				bind:category
			/>
		{:else}
			<div class="space-y-4">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="font-medium">{$t('transactions.transactionDetails')}</h3>
					<div class="flex items-center gap-2">
						<Badge
							variant={categoryType === 'INCOME'
								? 'default'
								: categoryType === 'EXPENSE'
									? 'destructive'
									: 'secondary'}
						>
							{categoryType}
						</Badge>
						{#if category}
							<Badge variant="outline">
								{category.name}
							</Badge>
						{/if}
					</div>
				</div>
				{#if categoryType === 'TRANSFER'}
					<AddTransferForm
						form={transferForm}
						bind:formData={$transferFormData}
						enhance={transferEnhance}
						{accounts}
					/>
				{:else}
					<AddTransactionForm {form} bind:formData={$formData} {enhance} {accounts} />
				{/if}
			</div>
		{/if}
		<Dialog.Footer>
			<div class={`flex w-full pt-4 ${transactionStep > 1 ? 'justify-between' : 'justify-end'}`}>
				{#if transactionStep > 1}
					<Button variant="outline" class="flex items-center gap-2" onclick={goToPreviousStep}>
						<ArrowLeft class="h-4 w-4" />
						{$t('common.back')}
					</Button>
				{/if}
				{#if transactionStep < 3}
					<Button
						class="flex items-center gap-2"
						disabled={(transactionStep === 1 && !categoryType) ||
							(transactionStep === 2 && !category)}
						onclick={goToNextStep}
					>
						{$t('common.next')}
						<ArrowRight class="h-4 w-4" />
					</Button>
				{:else if categoryType === 'TRANSFER'}
					<Button
						class="flex items-center gap-2"
						form="addTransferForm"
						type="submit"
						disabled={$transferDelayed ||
							!transferIsTainted($transferTainted?.account) ||
							!transferIsTainted($transferTainted?.originAccount) ||
							!transferIsTainted($transferTainted?.amount) ||
							!transferIsTainted($transferTainted?.date) ||
							!transferIsTainted($transferTainted?.description) ||
							!!$transferAllErrors.length}
					>
						{#if $transferDelayed}<LoaderCircle class="mr-1 animate-spin" />{/if}
						{$t('common.save')}
					</Button>
				{:else}
					<Button
						class="flex items-center gap-2"
						form="addTransactionForm"
						type="submit"
						disabled={$delayed ||
							!isTainted($tainted?.account) ||
							!isTainted($tainted?.amount) ||
							!isTainted($tainted?.date) ||
							!isTainted($tainted?.description) ||
							!!$allErrors.length}
					>
						{#if $delayed}<LoaderCircle class="mr-1 animate-spin" />{/if}
						{$t('common.save')}
					</Button>
				{/if}
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
