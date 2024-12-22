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

	let { data, email, goToNextStep } = $props();

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
				<Form.Description>Please enter the one-time password sent to your email.</Form.Description>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Button
		class="mt-5 w-full"
		type="submit"
		disabled={$delayed || !isTainted($tainted?.activationCode) || $allErrors.length}
	>
		{#if $delayed}<LoaderCircle class="mr-1 animate-spin" />{/if}
		Next
	</Button>
</form>
