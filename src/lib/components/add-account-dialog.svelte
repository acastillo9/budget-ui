<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Plus from '@lucide/svelte/icons/plus';
	import { t } from 'svelte-i18n';
	import { superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { Input } from '$lib/components/ui/input';
	import { getUserContext } from '$lib/context';
	import { currencies, getCurrencyByCode } from '$lib/utils/currency';
	import { createAccountSchema } from '$lib/schemas/account.schema';

	let { data, account = undefined, open = $bindable(false), onClose = () => {} } = $props();

	const form = superForm(data, {
		validators: zod4(createAccountSchema),
		onUpdate({ form }) {
			if (form.valid) {
				open = false;
			}
		}
	});

	const { form: formData, enhance, isTainted, tainted, allErrors, delayed, reset } = form;

	const userState = getUserContext();
	$formData.currencyCode = userState.user?.currencyCode || 'USD';
	let selectedCurrencyData = $derived(getCurrencyByCode($formData.currencyCode));

	$effect(() => {
		$formData.currencyCode = userState.user?.currencyCode || 'USD';
	});

	$effect(() => {
		if (account) {
			$formData.id = account.id;
			$formData.name = account.name;
			$formData.balance = account.balance;
			$formData.accountType = account.accountType;
			$formData.currencyCode = account.currencyCode;
		} else {
			reset();
		}
	});
</script>

<Dialog.Root
	bind:open
	onOpenChange={(open: boolean) => {
		if (!open) {
			reset();
			onClose();
		}
		$formData.currencyCode = userState.user?.currencyCode || 'USD';
	}}
>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>
		<Plus class="mr-2 h-4 w-4" />
		{$t('accounts.addAccount')}
	</Dialog.Trigger>
	<Dialog.Content escapeKeydownBehavior="ignore" interactOutsideBehavior="ignore">
		<Dialog.Header>
			<Dialog.Title>{$t('accounts.addAccount')}</Dialog.Title>
			<Dialog.Description>
				{$t('accounts.addAccountDescription')}
			</Dialog.Description>
		</Dialog.Header>
		<form id="addAccountForm" class="space-y-4" method="POST" action="?/addAccount" use:enhance>
			<input hidden name="id" value={$formData.id || ''} />
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>{$t('accounts.accountName')}</Form.Label>
						<Input
							type="text"
							placeholder={$t('accounts.accountNamePlaceholder')}
							{...props}
							bind:value={$formData.name}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="balance">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>{$t('accounts.accountBalance')}</Form.Label>
						<Input
							type="number"
							placeholder={$t('accounts.accountBalancePlaceholder')}
							{...props}
							bind:value={$formData.balance}
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="accountType">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>{$t('accounts.accountType')}</Form.Label>
						<Select.Root type="single" bind:value={$formData.accountType} name={props.name}>
							<Select.Trigger class="w-full" {...props}>
								{$formData.accountType
									? $t(`accounts.accountTypes.${$formData.accountType}`)
									: $t('accounts.accountTypePlaceholder')}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="CHECKING">{$t('accounts.accountTypes.CHECKING')}</Select.Item>
								<Select.Item value="CREDIT">{$t('accounts.accountTypes.CREDIT')}</Select.Item>
								<Select.Item value="CASH">{$t('accounts.accountTypes.CASH')}</Select.Item>
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="currencyCode">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>{$t('accounts.accountCurrency')}</Form.Label>
						<Select.Root type="single" bind:value={$formData.currencyCode} name={props.name}>
							<Select.Trigger class="w-full" {...props}>
								{selectedCurrencyData
									? `${selectedCurrencyData.flag} ${selectedCurrencyData.code}`
									: $t('accounts.accountCurrencyPlaceholder')}
							</Select.Trigger>
							<Select.Content>
								{#each currencies as currency}
									<Select.Item value={currency.code}
										>{`${currency.flag} ${currency.code}`}</Select.Item
									>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Button
				class="mt-5 w-full"
				type="submit"
				form="addAccountForm"
				disabled={$delayed ||
					!isTainted($tainted?.name) ||
					!isTainted($tainted?.balance) ||
					!!$allErrors.length}
			>
				{#if $delayed}<LoaderCircle class="mr-1 animate-spin" />{/if}
				{$t('accounts.createAccount')}
			</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
