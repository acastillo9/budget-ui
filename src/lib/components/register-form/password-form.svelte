<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { passwordSchema } from './schema';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Control } from 'formsnap';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	let { data, accessToken } = $props();

	const form = superForm(data, {
		validators: zodClient(passwordSchema),
		onSubmit({ formData, cancel }) {
			if (!accessToken) {
				cancel();
			}
			formData.set('accessToken', accessToken);
		}
	});

	const { form: formData, isTainted, tainted, allErrors, delayed, enhance } = form;
</script>

<form method="POST" action="?/password" use:enhance>
	<Form.Field {form} name="password">
		<Form.Control>
			{#snippet children({ attrs }: Control)}
				<Form.Label>Password</Form.Label>
				<Input type="password" {...attrs} bind:value={$formData.password} />
				<Form.Description>
					Create a password for your account. Password must contain at least 8 characters, including
					at least one letter and one number.
				</Form.Description>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Button
		class="mt-5 w-full"
		type="submit"
		disabled={$delayed || !isTainted($tainted?.password) || $allErrors.length}
	>
		{#if $delayed}<LoaderCircle class="mr-1 animate-spin" />{/if}
		Next
	</Button>
</form>
