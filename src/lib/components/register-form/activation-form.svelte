<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Control } from 'formsnap';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { activationSchema } from './schema';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import Countdown from '../countdown.svelte';
	import type { CountdownData } from '$lib/types';
	import { toast } from 'svelte-sonner';

	let { data, email, activationCodeResendAt, goToNextStep } = $props();
	let remainingTime = $state(activationCodeResendAt);
	let resendingActivationCode = $state(false);

	const form = superForm(data, {
		validators: zodClient(activationSchema),
		onSubmit({ formData, cancel }) {
			if (!email) {
				cancel();
			}
			formData.set('email', email);
		},
		onUpdate({ form, result }) {
			if (form.valid && result.data.step === 3 && result.data.accessToken) {
				goToNextStep(result.data.accessToken);
			}
		}
	});

	const { form: formData, isTainted, tainted, allErrors, delayed, enhance } = form;

	async function resendActivationCode() {
		resendingActivationCode = true;
		try {
			const response = await fetch('/resend-activation-code', {
				method: 'POST',
				body: JSON.stringify({ email })
			});

			const { activationCodeResendAt } = await response.json();
			remainingTime = new Date(activationCodeResendAt);
			toast.success('Activation code sent successfully, please check your email.');
		} catch {
			toast.error('Failed to send activation code, please try again later.');
		} finally {
			resendingActivationCode = false;
		}
	}
</script>

<form method="POST" action="?/activate" use:enhance>
	<Form.Field {form} name="activationCode">
		<Form.Control>
			{#snippet children({ attrs }: Control)}
				<Form.Label>Activation Code</Form.Label>
				<InputOTP.Root
					minlength={6}
					maxlength={6}
					{...attrs}
					bind:value={$formData.activationCode}
					pattern={REGEXP_ONLY_DIGITS}
				>
					{#snippet children({ cells })}
						<InputOTP.Group>
							{#each cells as cell}
								<InputOTP.Slot {cell} />
							{/each}
						</InputOTP.Group>
					{/snippet}
				</InputOTP.Root>
				<Form.Description>Please enter the one-time code sent to your email.</Form.Description>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Countdown from={remainingTime}>
		{#snippet remaining(data: CountdownData)}
			<div class="leading-none">
				<Button
					class={[
						'h-auto p-0',
						(resendingActivationCode || !data.done) && 'pointer-events-none text-muted'
					]}
					variant="link"
					onclick={resendActivationCode}>Resend activation code</Button
				>
				{#if !data.done}
					<small class="text-muted">
						in
						{#if data.hours}
							<span>{data.hours} hours</span>
						{/if}
						{#if data.minutes}
							<span>{data.minutes} minutes</span>
						{/if}
						<span>{data.seconds} seconds</span>
					</small>
				{/if}
			</div>
		{/snippet}
	</Countdown>

	<Button
		class="mt-5 w-full"
		type="submit"
		disabled={$delayed || !isTainted($tainted?.activationCode) || $allErrors.length}
	>
		{#if $delayed}<LoaderCircle class="mr-1 animate-spin" />{/if}
		Next
	</Button>
</form>
